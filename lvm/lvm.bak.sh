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
# lvm.bak.sh
#
# backup script for lvm
# MUST be run as root/sudo
# goal to use one function that will auto-backup
# all lv's and then use rsync to offsite them
###############################################################################


snapshot() {
	# mount /mnt/images
  mount -a
	# root_yyyymmdd_hhmm
	new_bak=root_`date '+%Y%m%d_%H%M%S'`
##make -L size of root
	lvcreate /dev/mapper/lv-root -L 20G -s -n $new_bak
	umount -q /mnt/images
}

snapshot
