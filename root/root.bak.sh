#!/bin/bash
##########################################################################
# backup - backup & restore your data
# Copyright (C) 2021 David Craig
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
##########################################################################
# root.bak.sh
#
# A script to perform incremental backups using rsync
##########################################################################

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

#rsync -aAXv --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > /dev/null 2>&1

rsync -aAXv --delete "${SOURCE_DIR}/" --link-dest "${LATEST_LINK}" --exclude-from="${EXCLUDE_LIST}" "${BACKUP_PATH}" > "${LOG_FILE}" 2>&1

rm -rf "${LATEST_LINK}"
ln -s "${BACKUP_PATH}" "${LATEST_LINK}"
echo `date` >> "${LOG_FILE}"
