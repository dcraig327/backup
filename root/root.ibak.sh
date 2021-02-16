#!/bin/bash

# A script to perform incremental backups using rsync

#set -o errexit
set -o nounset
set -o pipefail

readonly BIN_DIR="${HOME}/bin/backup/root"
readonly SOURCE_DIR="/"
readonly BACKUP_DIR="/pool/backups/root"
readonly LATEST_LINK="${BACKUP_DIR}/latest"
readonly EXCLUDE_LIST="${BIN_DIR}/root.exclude.list"
readonly LOG_FILE="${BIN_DIR}/root.ibak.log"

while [ `pgrep -n rsync` ]
do
  sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${LATEST_LINK}" > /dev/null 2>&1
echo `date` > "${LOG_FILE}"
