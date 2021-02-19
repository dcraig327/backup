#!/usr/bin/env node
"use strict";
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
