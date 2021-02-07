#!/bin/bash

# A script to perform incremental backups using rsync
#echo "hello $USER. creating backup."

set -o errexit
set -o nounset
set -o pipefail

readonly SOURCE_DIR="${HOME}"
readonly BACKUP_DIR="/pool/backups/home"
#readonly DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
#readonly BACKUP_PATH="${BACKUP_DIR}/${DATETIME}"
readonly LATEST_LINK="${BACKUP_DIR}/latest"
readonly EXCLUDE_LIST="${BACKUP_DIR}/exclude.list"
#mkdir -p "${BACKUP_DIR}"

while [ `pgrep -n rsync` ]
do
	sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${LATEST_LINK}" > "${BACKUP_DIR}/log-ibak.log" 2>&1
echo `date`>> "${BACKUP_DIR}/log-ibak.log"
