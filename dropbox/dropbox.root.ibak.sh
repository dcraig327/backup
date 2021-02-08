#!/bin/bash

# A script to perform incremental backups using rsync

#set -o errexit
set -o nounset
set -o pipefail

readonly BIN_DIR="${HOME}/bin/backup/dropbox"
readonly SOURCE_DIR="/pool/backups/root/latest"
readonly BACKUP_DIR="/pool/cloud/Dropbox"
readonly BACKUP_PATH="${BACKUP_DIR}/backups/root"
#readonly LATEST_LINK="${SOURCE_DIR}"
readonly EXCLUDE_LIST="${BIN_DIR}/dropbox.root.exclude.list"
readonly LOG_FILE="${BIN_DIR}/dropbox.root.ibak.log"

while [ `pgrep -n rsync` ]
do
  sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1
echo `date` >> "${LOG_FILE}"
