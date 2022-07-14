#!/bin/bash
set -e

echo "🔒 getting gpg password from bitwarden"
BITWARDEN_ENTRY_ID="cbaf30f6-c20d-4c37-b52b-abb20117bba5" #  cf $ bw list items --search "Personal data backup"
GPG_PASSPHRASE="$(bw get password ${BITWARDEN_ENTRY_ID})"

INPUT_FILE="$1"
DEST_FILE="${INPUT_FILE}.gpg"

# Encrypt
echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 -o "${DEST_FILE}" --symmetric "${INPUT_FILE}"

# Decrypt
# echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 --decrypt "${DEST_FILE}" > "${DECRYPTED_FILE}"
