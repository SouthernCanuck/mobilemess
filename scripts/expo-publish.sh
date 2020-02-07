#!/bin/bash

set -eu

. ./scripts/shared.sh

expo publish --release-channel "$( get_publish_channel )" --max-workers 1
