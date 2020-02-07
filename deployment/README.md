# CircleCI - Expo - AppCenter - Slack integration

## Overview

This folder contains a python server, which is being used as running builds registery, webhook endpoint, AppCenter publisher and Slack notifier.
Dockerized redis server is used as registery.
The server is currently hosted on `https://general.salsitasoft.com` and responses to these calls:

* `GET /`: shows json status of registered builds.
* `POST /register`: adds build into registery.
* `POST /webhook`: if build ID is found in registery, it announces its status to slack, downloads the build and uploads it to AppCenter.


### CircleCI

To save CCI time, the build process does not wait until expo build is done.
It triggers the expo build and then calls endpoint `/register` with ID, platfrom, build number and commit notes of a build.

### Expo

Once expo build is done, it is setup up to call webhook `/webhook` with info about the build (ID, platform, success/failure, download URL),

### AppCenter

There are 2 apps and 2 distribution groups in AC, a pair for Android and a pair for iOS.
Each successful build is being dowloaded from expo by the python server, uploaded to AC app and released to distribution group.

### Slack

Upon webhook call, if the ID of build is found, Slack channel is informent with build number, platform and status of the build.
If the build succeeded, expo download URL is appended into message.
