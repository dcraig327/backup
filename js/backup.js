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

//returns 0 if process active
function pgrep(process) {
  return sh(`pgrep -n ${process} > /dev/null`);
}

function setup_variables() {
  env.BACKUP_PATH = env.BACKUP_DIR;
  if (env.BACKUP_SUFFIX) {
    env.BACKUP_PATH += "/";
    env.BACKUP_PATH += sh(`${env.BACKUP_SUFFIX}`, true);
  }
}

function print_variables() {
  sh("echo ${SOURCE_DIR}");
  sh("echo ${BACKUP_DIR}");
  sh("echo ${BACKUP_PATH}");
  sh("echo ${BACKUP_SUFFIX}");
  sh("echo ${LATEST_LINK}");
  sh("echo ${EXCLUDE_LIST}");
  sh(`echo ${env.LOG_FILE}`);
  sh("echo ----");
  console.log(env);
}

function is_root() {
  if (env.USER === "root") {
    return true;
  } else {
    return false;
  }
}

function wait_for_no_rsync() {
  while (!pgrep("rsync")) {
    sh("sleep 1");
  }
}

function missing_variables() {
  let output_string = "";

  const source_dir_desc = "SOURCE_DIR\t\t\t\tSource irectory to backup\n";
  const backup_dir_desc =
    "BACKUP_DIR\t\t\t\tDestination directory to store backup\n";
  const backup_suffix_desc = "BACKUP_SUFFIX\t\t\tappended to backup_edir\n";
  const latest_link_desc =
    "LATEST_LINK\t\t\t\tFile that points to latest backup\n";
  const exclude_list_desc =
    "EXCLUDE_LIST\t\t\tFile that contains exclude list\n";
  const log_file_desc = "LOG_FILE\t\t\t\t\tFile for logs\n";

  if (!env.SOURCE_DIR) {
    output_string += source_dir_desc;
  }

  if (!env.BACKUP_DIR) {
    output_string += backup_dir_desc;
  }

  if (!env.LATEST_LINK) {
    output_string += latest_link_desc;
  }

  if (!env.EXCLUDE_LIST) {
    output_string += exclude_list_desc;
  }

  if (!env.LOG_FILE) {
    output_string += log_file_desc;
  }

  //kill ending \n if populated
  return output_string.trim();
}

function get_backup_subdirectories() {
  sh(`find -L ${env.BACKUP_DIR} -maxdepth 1 -type d | sed '1d'`);
}

function backup() {
  //if no directories in backup folder, run new backup
  //env.BACKUP_PATH += sh(`${env.BACKUP_SUFFIX}`, true);

  //("${BACKUP_DIR}");
  //if no latest link, then find latest directory and create the latest link

  //run incremental backup
  sh(
    "rsync -aAXv --delete ${SOURCE_DIR}/ --link-dest ${LATEST_LINK} --exclude-from=${EXCLUDE_LIST} ${BACKUP_PATH} > ${LOG_FILE} 2>&1"
  );

  sh("echo `date` >> ${LOG_FILE}");

  sh("rm -rf ${LATEST_LINK}");
  sh("ln -s ${BACKUP_PATH} ${LATEST_LINK}");
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

  let invalid_variables = missing_variables();
  if (invalid_variables) {
    const invalid_variables_error = "Missing variables: \n" + invalid_variables;
    if (env.LOG_FILE) {
      sh(`echo ${invalid_variables_error} >> ${env.LOG_FILE}`);
    } else {
      console.log(invalid_variables_error);
    }
    return 2;
  }

  setup_variables();
  wait_for_no_rsync();
  print_variables();
  backup();
}

/////////////////////////////////////////////////
main();
