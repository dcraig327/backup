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
require('dotenv').config();

//SOURCE_DIR        Directory of what to backup
//BACKUP_DIR        Directory of Where to backup
//LATEST_LINK       File that points to latest backup
//EXCLUDE_LIST      File that contains exclude list
//LOG_FILE          File for logs

  // /%([^%]+)%/g, (_, n) => process.env[n])


//this evaluates '~/downloads' and should check for ~
//fooDir = fooDir.replace(/^~\//, process.env.HOME + '/');

//This function doesn't handle the special variables: $0,$!,$$,$?,$-,$#,$@
//No clue what's going on , heading to learn RegEx
function evaluate(command) {
  // const original = command;
  // console.log(command);
  // command = command.replace(/(${)([^{]+)}/g, (_,n) => { console.log(n); return process.env[n] || _; });
  // console.log(command);
  // command = command.replace(/([^$]+)/g, (_, n) => { console.log(n); return process.env[n] || _; });
  // console.log(command);
  // while (original !== command) {
  //   command = evaluate(command);
  // }
  // console.log(command);
  return command;
}

function sh(command) {
  let exitCode = 0;
  let outString;

  command = evaluate(command);

  try {
    outString = execSync(command);
  } catch (err) {
    exitCode = err.status;
  }
  if (Buffer.isBuffer(outString)) {
    outString = outString.toString();
  }
  if (outString) {
    outString = outString.replace(/(\r\n|\n|\r).*$/, "");
    console.log(outString);
  }
  return exitCode;
}

//returns 0 if process active
function pgrep(process) {
  return sh(`pgrep -n ${process} > /dev/null`);
}

// while (!pgrep("rsync")) {
//   sh("sleep 1");
// }

//sh("echo ~");
//sh("echo $PATH");
//sh("echo ${PATH}");

sh("echo ${LOG_DIR}");


// sh("pwd");
// sh("echo $HOME");

// sh("echo $SOURCE_DIR");
// sh("echo $BACKUP_DIR");
// sh("echo $BIN_DIR");
// sh("echo $DATETIME");

// sh(`echo ${env.SOURCE_DIR}`);
// sh(`echo ${env.DATETIME}`);
// sh(`echo ${env.BIN_DIR}`);
// sh(`echo ${env.LATEST_LINK}`);

// //$(date '+%Y-%m-%d_%H:%M:%S')
// sh("date '+%Y-%m-%d_%H:%M:%S'");

// env.DT = "date '+%Y-%m-%d_%H:%M:%S'";
// sh(`${env.DT}`);
// //sh("echo $DT");
// //sh("date '+%Y-%m-%d_%H:%M:%S'");


// sh(
//   'echo rsync -aAXv --dry-run --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1'
// );

//setup latest link

//here's the full backup
//rsync -aAXv --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1

// sh(
//   `echo rsync -aAXv --dry-run --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1`
// );
//sh("echo \`date\` >" + `${env.LOG_FILE}`);
//sh(`echo ${env.LOG_FILE}`);

//sh('rm -rf "${LATEST_LINK}"');
//sh('ln -s "${BACKUP_PATH}" "${LATEST_LINK}"');

//kill env vars and instead do everything in js

// sh("echo `${TEST}`");
