#!/bin/bash

# Target Variables
GIT_SLUG="wtd.net.in/wtd_server"
GIT_TOKEN="8kcDJeNjwjxBHztdq1tx"
GIT_BRANCH="master"
GIT_CLONE_DIR="temp_server"

TARGET_DIR="/var/www/wtd_server"
# ------------------------------------------------------------>

# Clean and Clone
echo ">>>> Cleaning previous temp directory: "${GIT_CLONE_DIR}
rm -rf ${GIT_CLONE_DIR}
echo ">>>> Cloning target repo"
git clone --depth=1 --branch=${GIT_BRANCH} https://gitlab-ci-token:${GIT_TOKEN}@gitlab.com/${GIT_SLUG}.git ${GIT_CLONE_DIR}
if [ $? != 0 ]; then exit $?; fi

# Sync with the latest
echo ">>>> Synchronizing with the latest version"
sudo rsync -r ${GIT_CLONE_DIR}/* ${TARGET_DIR}/ --exclude=.git


# Build @latest
# ------------------------------------------------------------>
cd ${TARGET_DIR}
echo ">>>> Updating npm modules"
sudo npm i
echo ">>>> Moving the previous build to temp directory"
sudo rm -rf build_pre
sudo mv build build_pre
echo ">>>> Running typescript compile"
sudo npm run tsc2
if [ $? != 0 ]
then
    echo ">>>> Error in compiling typescript, Falling back to previous version!"
    sudo rm -rf build
    sudo mv build_pre build
    echo ">>>> Restarting server service!"
    sudo sudo service wtd_server restart
    exit $?
fi
echo ">>>> Successfully compiled typescript!"
echo ">>>> Copying keys to the newer build!"
sudo cp -rf ./src/config/keys ./build/src/config/
if [ $? != 0 ]; then exit $?; fi
sudo chmod +x ./build/index.js

# Restart service
# ------------------------------------------------------------>
echo ">>>> Restarting server service!"
sudo service wtd_server restart
echo ">>>> Cleaning the previous version"
sudo rm -rf build_pre
echo ">>>> Succussfully  deployed!"
exit 0
