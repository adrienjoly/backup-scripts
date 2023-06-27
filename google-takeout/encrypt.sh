#!/bin/bash
set -e

source .env # must define BITWARDEN_ENTRY_ID, cf $ brew install bitwarden-cli && bw list items --search "Personal data backup" | jq '.[0].id'

echo "🔒 getting gpg password from bitwarden..."
GPG_PASSPHRASE="$(bw get password ${BITWARDEN_ENTRY_ID})"

INPUT_FILE="$1"
DEST_FILE="${INPUT_FILE}.gpg"

echo "🐌 encrypting to ${DEST_FILE}..."
echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 -o "${DEST_FILE}" --symmetric "${INPUT_FILE}"

echo "✅ Done."
echo "ℹ️ Next steps: upload ${DEST_FILE} to a safe place"
