#!/bin/bash

# Target Variables
GIT_SLUG="wtd.net.in/wtd_server"
GIT_TOKEN="8kcDJeNjwjxBHztdq1tx"
GIT_BRANCH="master"
GIT_CLONE_DIR="temp-server"

TARGET_DIR="/var/www/wtd_server"
# ------------------------------------------------------------>

# Clean and Clone
rm -rf ${GIT_CLONE_DIR}
git clone --depth=1 --branch=${GIT_BRANCH} https://gitlab-ci-token:${GIT_TOKEN}@gitlab.com/${GIT_SLUG}.git ${GIT_CLONE_DIR}
if [ $? != 0 ]; then exit $?; fi

# Sync with the latest
sudo rsync -r ${GIT_CLONE_DIR}/* ${TARGET_DIR}/


# Build @latest
# ------------------------------------------------------------>
cd ${TARGET_DIR}
sudo npm i
sudo rm -rf build
sudo npm run tsc
if [ $? != 0 ]; then exit $?; fi
sudo chmod +x ./build/index.js

# Restart service
# ------------------------------------------------------------>
sudo service wtd_server.service restart

echo "Succussfully  deployed!"
exit 0
