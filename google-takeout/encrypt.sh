#!/bin/bash
set -e

# Encrypts files passed as arguments
# E.g. $ ./encrypt.sh "~/Downloads/google takeout/"*

source .env # must define BITWARDEN_ENTRY_ID, cf $ brew install bitwarden-cli && bw list items --search "Personal data backup" | jq '.[0].id'

echo "🔒 getting gpg password from bitwarden..."
GPG_PASSPHRASE="$(bw get password ${BITWARDEN_ENTRY_ID})"

for INPUT_FILE in "$@"; do
	DEST_FILE="${INPUT_FILE}.gpg"
	echo "🐌 encrypting to ${DEST_FILE}..."
	echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 -o "${DEST_FILE}" --symmetric "${INPUT_FILE}"
	echo "✅ Done encrypting ${INPUT_FILE}."
done

echo "ℹ️ Next steps: upload crypted files to a safe place"
