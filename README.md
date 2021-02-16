# backup
## this app will backup & restore your data

###project goals###
* assists in creating, managing & maintaining a data backup system
  * **assists** meaning project is not required for the backup to function
* informative to users
  * explains hard links and how they will result in incorrect directory sizes
  * explains the popular 3-2-1 backup strategy
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
* modular system allowing freedom to change
  * hard drives
  * data/ui servers
  * file systems
  * file/data transfer software
  * using the ui server
* all dependencies must be open source
  * proper license to guarantee project remains open source
  * may later switch from GPLv3 to AGPLv3

###project direction###
* bash scripts to manage the backup
  * perform backup via rsync / syncoid
  * scheduled via cronjob
  * input/output data in files accessable by backup.sh  
* webapp for ui
  * backup.sh with a ui
* deploy project onto another server/client
