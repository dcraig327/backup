#!/bin/bash

# A script to perform incremental backups using rsync

#set -o errexit
set -o nounset
set -o pipefail

#there has to be a way to auto-set this BIN_DIR
readonly BIN_DIR="${HOME}/bin/backup/home"
readonly SOURCE_DIR="${HOME}"
readonly BACKUP_DIR="/pool/backups/home"
readonly DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
readonly BACKUP_PATH="${BACKUP_DIR}/${DATETIME}"
readonly LATEST_LINK="${BACKUP_DIR}/latest"
readonly EXCLUDE_LIST="${BIN_DIR}/home.exclude.list"
readonly LOG_FILE="${BIN_DIR}/home.bak.log"

while [ `pgrep -n rsync` ]
do
	sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1
rm -rf "${LATEST_LINK}"
ln -s "${BACKUP_PATH}" "${LATEST_LINK}"
echo `date` >> "${LOG_FILE}"
