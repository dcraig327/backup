#!/bin/bash
###############################################################################
# backup script for lvm
# MUST be run as root/sudo
###############################################################################
# goal to use one function that will auto-backup
# all lv's and then use rsync to offsite them
###############################################################################


function do_image() {
	# mount /mnt/images
	mount -a
	umount -q /mnt/ss-root


	# find the current lv-root backup name
	old_bak=`lvs | grep root_ | awk '{print $1;}'`

	
	# current naming scheme is to use the date, nothing more
	# so verify this is not run already today
	#### no , use hh-mm signature
	
	mount /dev/mapper/lv-$old_bak /mnt/ss-root/

	#only bug is the size of images, maybe too small
	old_bak_size=`du -sb /mnt/ss-root | awk '{print $1;}'`
	dest_free_size=`df /mnt/images | grep images | awk '{print $4;}'`
	if [[ $old_bak_siz -ge $dest_free_size ]]; then
		echo "Need more free space to run the backup..."
		exit 1
		#vgdisplay
		#e2fsck -f /lv
		#resize2fs /lv
		#extend it another 50G
		#but have to check vgdisplay to make sure 50G is available
		#and there also must be room for the snapshot as well
		#else need to delete the oldest backup
	fi

	#tar -cvzf /mnt/images/$old_bak.tar.gz /mnt/ss-root
#	tar cvzf /mnt/images/$old_bak.tar.gz /mnt/ss-root | pv -s $(du -sb /mnt/ss-root | awk '{print $1}')
	find /mnt/ss-root -type s -print > /tmp/sockets-to-exclude 2>/dev/null
	#tar cf - /mnt/ss-root -P -X /tmp/sockets-to-exclude --exclude=/mnt/ss-root/proc --exclude=/mnt/ss-root/lost+found --exclude=/mnt/ss-root/tmp --exclude=/mnt/ss-root/TEMP_BACKUPS --exclude=/mnt/ss-root/mnt --exclude=/mnt/ss-root/sys | pv -s $(du -sb /mnt/ss-root | awk '{print $1}') | gzip > /mnt/images/$old_bak.tar.gz
	tar cf - -X /tmp/sockets-to-exclude /mnt/ss-root -P | pv -s $old_bak_size | gzip > /mnt/images/$old_bak.tar.gz
	umount -q /mnt/ss-root
	lvremove -y /dev/mapper/lv-$old_bak
}

function do_backup() {
	# root_yyyymmdd_hhmm
	new_bak=root_`date '+%Y%m%d_%H%M%S'`
	lvcreate /dev/mapper/lv-root -L 50G -s -n $new_bak
	#umount -q /mnt/images
}

do_image
do_backup
