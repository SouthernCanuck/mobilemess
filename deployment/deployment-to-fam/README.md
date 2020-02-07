# Deployment to FAM

## Google, GitHub, BitBucket
user: firstam@salsitasoft.com
passwords: in passpack
ssh key: in passpack

## Sync

* runs script `sync-gits.sh` on general.salsitasoft.com (AWS EC2 machine), user `firstam`
* uses ssh key
* cronjob `*/10 * * * * /srv/firstam/sync-gits.sh`
* periodically synces Salsita's `master` branch to FAM's `dev-salsita`
