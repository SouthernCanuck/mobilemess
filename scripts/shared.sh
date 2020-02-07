#!/bin/bash

function get_publish_channel() {
  if [ -z ${CIRCLE_BRANCH+x} ] || [ -z ${CIRCLE_BUILD_NUM+x} ] ; then
    echo "$(hostname)_local"
  else
    echo "${CIRCLE_BRANCH}-${CIRCLE_BUILD_NUM}"
  fi
}

export -f get_publish_channel
