#!/bin/bash

set -euo pipefail

. ./scripts/shared.sh

PLATFORM="$1"

expo build:"$PLATFORM" --release-channel "$( get_publish_channel )" --no-publish --no-wait | tee /tmp/TMP_"$PLATFORM"

# this is a terrible, terrible solution, but there is no other way to get the ID
ID="$( grep 'https://expo.io/' /tmp/TMP_"$PLATFORM" | egrep -o '[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}' )"

[ ! -z ${CIRCLE_BUILD_NUM+x} ] || CIRCLE_BUILD_NUM=0
DATA=$( jq --arg key0 notes --arg value0 "$( git log -1 --pretty=%B)" \
  '. | .[$key0]=$value0' <<<"{ \"id\": \"$ID\", \"platform\": \"$PLATFORM\", \"buildNumber\": ${CIRCLE_BUILD_NUM} }" )

echo "Build request ID: $ID"
echo "Registering request with data:"
echo "$DATA"

curl -s -X POST -H "Content-Type: application/json" \
  -d "$DATA" \
  https://general.salsitasoft.com/register
