#!/bin/bash

# A script to perform incremental backups using rsync

set -o errexit
set -o nounset
set -o pipefail

readonly BIN_DIR="${HOME}/bin/backup/home"
readonly SOURCE_DIR="${HOME}"
readonly BACKUP_DIR="/pool/backups/home"
readonly LATEST_LINK="${BACKUP_DIR}/latest"
readonly EXCLUDE_LIST="${BIN_DIR}/home.exclude.list"
readonly LOG_FILE="${BIN_DIR}/home.ibak.log"

while [ `pgrep -n rsync` ]
do
	sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${LATEST_LINK}" >> "${LOG_FILE}" 2>&1
echo `date`>> "${LOG_FILE}"
