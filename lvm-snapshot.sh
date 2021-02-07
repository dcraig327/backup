#!/bin/bash
###############################################################################
# backup script for lvm
# MUST be run as root/sudo
###############################################################################
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
