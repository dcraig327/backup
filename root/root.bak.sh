#!/bin/bash

# A script to perform incremental backups using rsync
#echo "hello $USER. creating backup."

#set -o errexit
set -o nounset
set -o pipefail

readonly SOURCE_DIR="/"
readonly BACKUP_DIR="/pool/backups"
readonly DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
readonly BACKUP_PATH="${BACKUP_DIR}/${DATETIME}"
readonly LATEST_LINK="${BACKUP_DIR}/latest"
readonly EXCLUDE_LIST="${BACKUP_DIR}/exclude.list"
#mkdir -p "${BACKUP_DIR}"

if rsync -a --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" ; then 
	rm -rf "${LATEST_LINK}"
	ln -s "${BACKUP_PATH}" "${LATEST_LINK}"
	echo `date` >> "${BACKUP_DIR}/backup.log"
fi
