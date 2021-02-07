#!/bin/bash

# A script to perform incremental backups using rsync

#set -o errexit
set -o nounset
set -o pipefail

readonly BIN_DIR="${HOME}/bin/backup/root"
readonly SOURCE_DIR="/"
readonly BACKUP_DIR="/pool/backups/root"
readonly DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
readonly BACKUP_PATH="${BACKUP_DIR}/${DATETIME}"
readonly LATEST_LINK="${BACKUP_DIR}/latest"
readonly EXCLUDE_LIST="${BIN_DIR}/root.exclude.list"
readonly LOG_FILE="${BIN_DIR}/root.bak.log"

while [ `pgrep -n rsync` ]
do
	sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1
rm -rf "${LATEST_LINK}"
ln -s "${BACKUP_PATH}" "${LATEST_LINK}"
echo `date` >> "${LOG_FILE}"
