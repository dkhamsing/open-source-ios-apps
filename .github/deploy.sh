#!/bin/bash

echo 'set -e'
set -e

echo 'git config'
git config user.name "READMEbot"
git config user.email "readmebot@users.noreply.github.com"

status=`git status`
echo $status

if [[ $status == *"README.md"* ]]
then
  echo 'git add readme'
  git add README.md
  git commit -m "[auto] [ci skip] Generate README"
fi

if [[ $status == *"ARCHIVE.md"* ]]
then
  echo 'git add archive'
  git add ARCHIVE.md
  git commit -m "[auto] [ci skip] Generate ARCHIVE"
fi

if [[ $status == *"APPSTORE.md"* ]]
then
  echo 'git add appstore'
  git add APPSTORE.md
  git commit -m "[auto] [ci skip] Generate APPSTORE"
fi

echo 'git push'
git push  "https://test:test@github.com/dkhamsing/open-source-ios-apps" master:master > /dev/null 2>&1
