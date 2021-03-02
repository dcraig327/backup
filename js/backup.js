#!/usr/bin/env node
"use strict";
/*
backup - backup & restore your data
Copyright (C) 2021 David Craig

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const execSync = require("child_process").execSync;
const env = require("process").env;

function print_variables() {
  output_message(`${env.BACKUP_TYPE}`);
  output_message(`${env.SOURCE_DIR}`);
  output_message(`${env.BACKUP_DIR}`);
  output_message(`${env.BACKUP_PATH}`);
  output_message(`${env.BACKUP_SUFFIX}`);
  output_message(`${env.LATEST_LINK}`);
  output_message(`${env.EXCLUDE_LIST}`);
  output_message(`${env.LOG_FILE}`);
}

function output_message(str) {
  if (env.LOG_FILE) {
    sh(`echo ${str} >> ${env.LOG_FILE}`);
  } else {
    console.log(str);
  }
}

function validate_variables() {
  let return_value = true;
  let output_string = "";

  const source_dir_desc = "SOURCE_DIR\t\t\t\tSource irectory to backup\n";
  const backup_dir_desc =
    "BACKUP_DIR\t\t\t\tDestination directory to store backup\n";
  const backup_suffix_desc = "BACKUP_SUFFIX\t\t\tappended to backup_edir\n";
  const latest_link_desc =
    "LATEST_LINK\t\t\t\tSymlink to latest backup directory\n";
  const exclude_list_desc =
    "EXCLUDE_LIST\t\t\tFile that contains exclude list\n";
  const log_file_desc = "(*) LOG_FILE\t\t\t\t\tFile for logs\n";
  const backup_type_desc = 'BACKUP_TYPE either "inc" OR "full"';

  // TODO: If no directories exist in backup folder,
  //or latest link doesn't point to a directory, then we just exit
  //but we should create a new non-incremental backup and create that latest link
  if (!is_link_valid()) {
    output_string += latest_link_desc;
    return_value = false;
  }

  if (!is_backup_type_valid()) {
    output_string += backup_type_desc;
    return_value = false;
  }

  if (!env.SOURCE_DIR) {
    output_string += source_dir_desc;
    return_value = false;
  }

  if (!env.BACKUP_DIR) {
    if (env.BACKUP_TYPE === "inc") {
      output_string += "(~) ";
    } else {
      return_value = false;
    }

    output_string += backup_dir_desc;
  }

  if (!env.EXCLUDE_LIST) {
    output_string += exclude_list_desc;
    return_value = false;
  }

  if (!env.LOG_FILE) {
    output_string += log_file_desc;
  }

  if (!env.BACKUP_SUFFIX) {
    output_string += backup_suffix_desc;
  }

  //if any output string, this will prevent string from ending with "\n" stopping a trim() call
  if (output_string) {
    output_string +=
      "(*) - optional / (!) - not used for BACKUP_TYPE / (~) - optional for BACKUP_TYPE";
    output_string = "" + output_string;
  }

  output_message(output_string);
}

function is_backup_type_valid() {
  if (!env.BACKUP_TYPE) {
    return false;
  } else if (env.BACKUP_TYPE !== "inc" && env.BACKUP_TYPE !== "full") {
    return false;
  } else {
    return true;
  }
}

function is_link_valid() {
  //check symlink to directory exists
  let latest_exists = sh(
    `if [[ -L ${env.LATEST_LINK} && -d ${env.LATEST_LINK} ]]; then echo yes; else echo no; fi`,
    true
  );

  if ("yes" === latest_exists) {
    return true;
  } else {
    return false;
  }
}

function setup_variables() {
  if (env.BACKUP_DIR) {
    env.BACKUP_PATH = env.BACKUP_DIR;
    if (env.BACKUP_SUFFIX) {
      env.BACKUP_PATH += "/";
      env.BACKUP_PATH += sh(`${env.BACKUP_SUFFIX}`, true);
    }
  }
}

function create_backup_path() {
  if (env.BACKUP_PATH) {
    sh(`mkdir -p ${env.BACKUP_PATH}`);
  }
}

function is_root() {
  if (env.USER === "root") {
    return true;
  } else {
    return false;
  }
}

//returns 0 if process active
function pgrep(process) {
  return sh(`pgrep -n ${process} > /dev/null`);
}

function wait_for_no_rsync() {
  while (!pgrep("rsync")) {
    sh("sleep 1");
  }
}

function evaluate(command) {
  let original = command;

  console.log("start: " + command);

  command = command.replace(/\${(.*)}/g, (_, n) => {
    return process.env[n] || _;
  });

  command = command.replace(/\$([_0-9a-zA-Z]*)/g, (_, n) => {
    return process.env[n] || _;
  });

  command = command.replace(/(~)/g, (_, n) => {
    return process.env.HOME || _;
  });

  while (original !== command) {
    original = command;
    command = evaluate(command);
  }

  console.log("end: " + command);

  return command;
}

function sh(command, quiet = false) {
  let exitCode = 0;
  let outString;

  console.log(command);

  try {
    outString = execSync(command);
  } catch (err) {
    exitCode = err.status;
  }
  console.log(outString);

  if (Buffer.isBuffer(outString)) {
    outString = outString.toString();
  }
  if (outString) {
    outString = outString.replace(/(\r\n|\n|\r).*$/, "");

    if (quiet) {
      return outString;
    }

    console.log(outString);
  }
  return exitCode;
}

function backup() {
  if (env.BACKUP_TYPE === "inc") {
    sh(
      "rsync -aAXv --delete ${SOURCE_DIR}/ --exclude-from=${EXCLUDE_LIST} ${LATEST_LINK} > ${LOG_FILE} 2>&1"
    );
  } else if (env.BACKUP_TYPE === "full") {
    sh(
      "rsync -aAXv --delete ${SOURCE_DIR}/ --link-dest ${LATEST_LINK} --exclude-from=${EXCLUDE_LIST} ${BACKUP_PATH} > ${LOG_FILE} 2>&1"
    );

    sh("rm -rf ${LATEST_LINK}");
    sh("ln -s ${BACKUP_PATH} ${LATEST_LINK}");
  } else {
    return 1;
  }

  sh("echo `date` >> ${LOG_FILE}");
}

function main() {
  if (!is_root()) {
    const non_root_error = "Usage: backup.js must be run as root";
    if (env.LOG_FILE) {
      sh(`echo ${non_root_error} >> ${env.LOG_FILE}`);
    } else {
      console.log(non_root_error);
    }
    return 1;
  }

  //TODO: still debugging validate variables for other users
  //TODO: verify can write/edit all the files/folders pointed to
  // if (!validate_variables()) {
  //   return 2;
  // }

  setup_variables();
  create_backup_path();
  wait_for_no_rsync();
  backup();
}

/////////////////////////////////////////////////
main();
