#!/bin/bash

set -e

git config user.name "READMEbot"
git config user.email "readmebot@users.noreply.github.com"

status=`git status`

if [[ $status == *"README.md"* ]]
then
  git add README.md
  git commit -m "[auto] [ci skip] Generate README"
fi

if [[ $status == *"ARCHIVE.md"* ]]
then
  git add ARCHIVE.md
  git commit -m "[auto] [ci skip] Generate ARCHIVE"
fi

git push --quiet "https://${GH_TOKEN}@github.com/dkhamsing/open-source-ios-apps" master:master > /dev/null 2>&1
