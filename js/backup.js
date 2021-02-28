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
//require('dotenv').config();
//let dotenv = require('dotenv');
//dotenv-expand...

//SOURCE_DIR        Directory of what to backup
//BACKUP_DIR        Directory of Where to backup
//BACKUP_SUFFIX     appended to backup_edir
//LATEST_LINK       File that points to latest backup
//EXCLUDE_LIST      File that contains exclude list
//LOG_FILE          File for logs


function evaluate(command) {
  let original = command;
  
  console.log("start: " + command);

  command = command.replace(/\${(.*)}/g, (_, n) => { return process.env[n] || _; });
  
  command = command.replace(/\$([_0-9a-zA-Z]*)/g, (_, n) => { return process.env[n] || _; });

  command = command.replace(/(~)/g, (_, n) => { return process.env.HOME || _; });

  while (original !== command) {
    original = command;
    command = evaluate(command);
  }

  console.log("end: " + command);

  return command;
}

function sh(command,quiet=false) {
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
    outString = outString.replace(/(\r\n|\n|\r).*$/, "");
    
    if (quiet)
      return outString;
    
    console.log(outString);
  }
  return exitCode;
}

//returns 0 if process active
function pgrep(process) {
  return sh(`pgrep -n ${process} > /dev/null`);
}

function setup_variables() {
  env.BACKUP_PATH = env.BACKUP_DIR + '/';
  if(env.BACKUP_SUFFIX)
    env.BACKUP_PATH += sh(`${env.BACKUP_SUFFIX}`, true);
}

function print_variables() {
  sh("echo ${SOURCE_DIR}");
  sh("echo ${BACKUP_DIR}");
  sh("echo ${BACKUP_PATH}");
  sh("echo ${BACKUP_SUFFIX}");
  sh("echo ${LATEST_LINK}");
  sh("echo ${EXCLUDE_LIST}");
  sh(`echo ${env.LOG_FILE}`);
  sh('echo ----');
  console.log(env);
}

setup_variables();

while (!pgrep("rsync")) {
  sh("sleep 1");
}



//SET LATEST
//what'll happen if no link dest?
//sh("rsync -aAXv --delete ${SOURCE_DIR}/ --exclude-from=${EXCLUDE_LIST} ${BACKUP_PATH}");



//--progress -- --info=progress2

/////////////
//// SHOULD SAY IF NOT ROOT
/////////////

sh("rsync -aAXv --delete ${SOURCE_DIR}/ --link-dest ${LATEST_LINK} --exclude-from=${EXCLUDE_LIST} ${BACKUP_PATH} > ${LOG_FILE} 2>&1");

sh("echo `date` >> ${LOG_FILE}");

sh("rm -rf ${LATEST_LINK}");
sh("ln -s ${BACKUP_PATH} ${LATEST_LINK}");
