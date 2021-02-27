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

function sh(command) {
  let exitCode = 0;
  let outString;
  try {
    outString = execSync(command);
  } catch (err) {
    exitCode = err.status;
  }
  if (Buffer.isBuffer(outString)) {
    outString = outString.toString();
  }
  if (outString) {
    //this removes all line breaks at the end of string for linux,mac,windows
    //need to only remove the very last linebreak
    outString = outString.replace(/(\r\n|\n|\r)$/gm, "");
    console.log(outString);
  }
  return exitCode;
}

//returns 0 if process active
function pgrep(process) {
  return sh(`pgrep -n ${process} > /dev/null`);
}

//env.BIN_DIR="${HOME}/bin/backup/root";
env.BIN_DIR="${HOME}/bin";
env.SOURCE_DIR="/";
env.BACKUP_DIR="/pool/backups/root";
env.DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')";
env.BACKUP_PATH="${BACKUP_DIR}/${DATETIME}";
env.LATEST_LINK="${BACKUP_DIR}/latest";
env.EXCLUDE_LIST="${BIN_DIR}/exclude.root.list";
env.LOG_FILE="${BIN_DIR}/backup.root.log";

while (!pgrep("rsync")) {
  sh("sleep 1");
}

sh("echo $HOME");
sh("echo $BIN_DIR");

// sh(
//   'echo rsync -aAXv --dry-run --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1'
// );

//setup latest link

//here's the full backup
//rsync -aAXv --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1

// sh(
//   'rsync -aAXv --dry-run --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1'
// );
// sh('echo `date` > "${LOG_FILE}"');

//sh('rm -rf "${LATEST_LINK}"');
//sh('ln -s "${BACKUP_PATH}" "${LATEST_LINK}"');

//kill env vars and instead do everything in js
