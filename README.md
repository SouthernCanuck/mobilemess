# Firstam-inspection

App is using [react native](https://facebook.github.io/react-native/) with [expo](https://expo.io/) library.

### Running on windows

1. install [chocolatey](https://chocolatey.org/)

   Run `Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))` as admin in PowerShell

1. install [node.js](https://nodejs.org/): `choco install nodejs-lts`
1. install [adb](https://developer.android.com/studio/command-line/adb): `choco install adb`
1. install adb usb drivers - follow instructions on https://developer.android.com/studio/run/oem-usb

   * To check, if you sucessfully installed driver, you should turn on phone debugging ([see](https://developer.android.com/studio/debug/dev-options.html))
   * Connect phone via USB cable to computer
   * Run `adb devices` and you should see some device in a list

1. run `npm install` to install application dependencies
1. run `npm start` to start the app

   * It will ask you to install `expo-cli` globally. (There may be issues installing expo - [see](https://github.com/expo/expo-cli/issues/1237))
   * Download expo client app to your android phone
   * It is usefull to create expo account and log in on developer machine and on phone
