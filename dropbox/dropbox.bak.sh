#!/bin/bash


#copy /pool/bak/latest into /pool/cloud/Dropbox/bak


# A script to perform incremental backups using rsync
#echo "hello $USER. creating backup."

#set -o errexit
set -o nounset
set -o pipefail

readonly SOURCE_DIR="/pool/bak/latest"
readonly BACKUP_DIR="/pool/cloud"
#readonly DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
readonly BACKUP_PATH="${BACKUP_DIR}/Dropbox/bak"
readonly LATEST_LINK="${SOURCE_DIR}"
readonly EXCLUDE_LIST="${BACKUP_DIR}/exclude.list"
#mkdir -p "${BACKUP_DIR}"

while [ `pgrep -n rsync` ]
do
	sleep 1
done

rsync -aAXv --delete "${SOURCE_DIR}/" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${BACKUP_DIR}/bak-dropbox.log" 2>&1
echo `date` >> "${BACKUP_DIR}/bak-dropbox.log"
