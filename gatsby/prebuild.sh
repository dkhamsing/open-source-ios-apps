#!/bin/bash

# Ensure that our target directory exists
if ! [[ -d ../../open-source-ios-apps ]]
then
	mkdir ../../open-source-ios-apps
fi

# Get the file
cd ../../open-source-ios-apps
if ! [[ -f contents.json ]]
then
  wget "https://github.com/dkhamsing/open-source-ios-apps/raw/master/contents.json"
fi
