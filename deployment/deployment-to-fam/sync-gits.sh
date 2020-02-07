#!/bin/bash

set -ex

cd /srv/firstam/firstam-sketchpad
git checkout master
git pull
git push -f bitbucket master:dev-salsita

cd /srv/firstam/firstam-inspection
git checkout master
git pull
git push -f bitbucket master:dev-salsita
