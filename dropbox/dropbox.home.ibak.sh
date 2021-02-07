#!/bin/bash

# A script to perform incremental backups using rsync

set -o errexit
set -o nounset
set -o pipefail

readonly BIN_DIR="${HOME}/bin/backup/dropbox"
readonly SOURCE_DIR="/pool/backups/home/latest"
readonly BACKUP_DIR="/pool/cloud/Dropbox"
readonly BACKUP_PATH="${BACKUP_DIR}/backups/home"
readonly LATEST_LINK="${SOURCE_DIR}"
readonly EXCLUDE_LIST="${BIN_DIR}/dropbox.home.exclude.list"
readonly LOG_FILE="${BIN_DIR}/dropbox.home.ibak.log"

while [ `pgrep -n rsync` ]
do
	sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" >> "${LOG_FILE}" 2>&1
echo `date` >> "${LOG_FILE}"
