#!/bin/bash
set -e

echo "🔒 getting gpg password from bitwarden"
BITWARDEN_ENTRY_ID="cbaf30f6-c20d-4c37-b52b-abb20117bba5" #  cf $ bw list items --search "Personal data backup"
GPG_PASSPHRASE="$(bw get password ${BITWARDEN_ENTRY_ID})"

(echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 --decrypt "$1") > "$1.decrypted"
