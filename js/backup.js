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
//const fs = require("fs");
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
    //BUG: only slice Buffers, string might not end 0A
    //TODO: slice -2 for other platforms end 0D 0A
    //might be a cross-platform function that handles it
    outString = outString.slice(0, -1);
    console.log(outString);
  }
  return exitCode;
  //return outString;
}

//returns 0 if process active
function pgrep(process) {
  return sh(`pgrep -n ${process} > /dev/null`);
}

env.BIN_DIR = "${HOME}/bin/backup/root";
env.SOURCE_DIR = "/";
env.BACKUP_DIR = "/pool/backups/root";
env.LATEST_LINK = "${BACKUP_DIR}/latest";
env.EXCLUDE_LIST = "${BIN_DIR}/root.exclude.list";
env.LOG_FILE = "${BIN_DIR}/root.ibak.log";

while (!pgrep("rsync")) {
  sh("sleep 1");
}

let one =
  'rsync -aAXv --dry-run --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${LATEST_LINK}" > /dev/null 2>&1';
let two = 'echo `date` > "${LOG_FILE}"';

// copy home vars and test that directory
