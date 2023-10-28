#!/usr/bin/env bash

# Backup notes from a Notion workspace

set -e # this script will exit if any command returns a non-null value

echo "Cloning Notion backup script ..."
# rm -rf notion-backup || true
# git clone https://github.com/darobin/notion-backup.git
# rm -rf notion-backup || true
# git clone https://github.com/ivanik/notion-backup.git

# echo "Deleting previous backup ..."
# rm -rf markdown html *.zip

source ./.env # loads NOTION_SPACE_ID, NOTION_TOKEN and NOTION_FILE_TOKEN
echo "Archiving Notion workspace ${NOTION_SPACE_ID} ..."
mkdir last_backup_data || true
cd last_backup_data
# NODE_VERSION=18 \
# NODE_OPTIONS="--max-http-header-size 15000" \
# NOTION_TOKEN=${NOTION_TOKEN} \
# NOTION_SPACE_ID=${NOTION_SPACE_ID} \
# NOTION_FILE_TOKEN=${NOTION_FILE_TOKEN} \
# ~/.nvm/nvm-exec \
# npx --yes notion-backup

# docker run \
#     --rm=true \
#     --env-file=../.env \
#     ghcr.io/jckleiner/notion-backup

# docker run \
#     --rm=true \
#     --env-file=../.env \
#     ivanik/notion-backup

NODE_VERSION=18 \
NODE_OPTIONS="--max-http-header-size 15000" \
EMAIL=${EMAIL} \
PASSWORD=${PASSWORD} \
EXPORT_TYPE=${EXPORT_TYPE} \
~/.nvm/nvm-exec \
npx --yes github:adrienjoly/notion-backup
# npx --yes run-url https://raw.githubusercontent.com/ivanik7/notion-backup/master/notion.js

echo "✅ Done."
# echo "ℹ️ Next steps: run ./zip-and-upload.sh && ./clean-up.sh"
