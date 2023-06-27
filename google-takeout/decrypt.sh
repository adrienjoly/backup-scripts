#!/bin/bash
set -e

source .env # must define BITWARDEN_ENTRY_ID, cf $ brew install bitwarden-cli && bw list items --search "Personal data backup" | jq '.[0].id'

echo "🔒 getting gpg password from bitwarden..."
GPG_PASSPHRASE="$(bw get password ${BITWARDEN_ENTRY_ID})"

INPUT_FILE="$1"
DEST_FILE="${INPUT_FILE}.decrypted"

echo "🐌 decrypting to ${DEST_FILE}..."
(echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 --decrypt "${INPUT_FILE}") > "${DEST_FILE}"

echo "✅ Done: ${DEST_FILE}"
