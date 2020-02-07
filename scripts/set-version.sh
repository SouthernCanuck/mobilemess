#!/bin/bash

set -eu

TMPJSON=$( mktemp )

echo "Setting 'buildNumer' (iOS CFBundleVersion) and 'versionCode' (Android) to $CIRCLE_BUILD_NUM"

jq ".expo.ios.buildNumber=\"$CIRCLE_BUILD_NUM\"" app.json > "$TMPJSON"
jq ".expo.android.versionCode=$CIRCLE_BUILD_NUM" "$TMPJSON" > app.json

rm -f "$TMPJSON"
