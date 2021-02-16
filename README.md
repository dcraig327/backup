# backup
## this app will backup & restore your data


### project goals ###
* assists in creating, managing & maintaining a data backup system
  * **assists** meaning project is not required for the backup to function
* informative to users
  * explains hard links and how they will result in incorrect directory sizes
  * explains the popular 3-2-1 backup strategy
  * explains when a ups should be used
* if unable to create a proper 3-2-1 backup, suggest inexpensive solutions based on community recommendations
  * physical hard drives for mirroring
  * remote hardware to rent for cloud storage
  * local hardware for a diy nas
* host webapp on localserver and/or inexpensive virtual private server
* accessable from any device that can connect to the server
* webapp with login
* ui to display graphs & tables
  * assists in choosing a backup strategy
  * change the backup strategy
  * reports of drive health & stats
  * total cost of strategy from bandwidth to electricity & hardware
* modular system allowing freedom to change
  * hard drives
  * data/ui servers
  * file systems
  * file/data transfer software
  * using the ui server
* all dependencies must be open source
  * proper license to guarantee project remains open source
  * may later switch from GPLv3 to AGPLv3


### project direction ###
* bash scripts to manage the backup
  * perform backup via rsync / syncoid
  * scheduled via cronjob
  * input/output data in files accessable by backup.sh 
* to revert from a previous snapshot
  * instructions on restoring from rescue mode or a live disc
  * create a custom grub / boot entry
  * revert one file
  * revert a directory and all of it's dependent directories & files disabled in certain situations
    * on certain directories
    * if any of the destination files
      * are in use
      * have been used recently
      * are executables
      * are requirements for other files
    * it maybe best to start with unlocked non-root or non-system directories as those likely don't depend on outside files
    * however the .local and .config directories do store application version specific data
* webapp for ui
  * backup.sh with a ui
* deploy project onto another server/client
