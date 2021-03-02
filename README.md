# backup
### this app will backup & restore your data


## project goals
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


## project direction
* program to manage the backup
  * port the shell scripts to js for cross-platform
  * perform backup via rsync / syncoid
  * scheduled via cronjob
* input/output data via json files
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
  * do what can be done on the command line
  * display data so it's usable
* deploy project onto another server/client

## TODO
* create help output for application usage
* backup() should be smarter
  * if no directories in BACKUP_DIR, run new backup
  * else if no LATEST_LINK, create LATEST_LINK
  * it's possible to create multiple sub-directories in the backup destination
    ```
    # To create to sub-directories using YYYY-MM-DD/HH:MM:SS format:
    BACKUP_SUFFIX=echo $(date "+%Y-%m-%d")/$(date "+%H:%M:%S")
    ```
* prevent executing commands or expanding variables code from .env file. 
  * add more code to do this within the program in a controlled manner

* Stop executing shell commands which are going to be platform-dependent.
* Look at other projects that do backup much better, syncoid
* Create a UI