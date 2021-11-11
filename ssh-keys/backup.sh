# Backup ssh keys from ~/.ssh

set -e # this script will exit if any command returns a non-null value

KEYS_PATH="${HOME}/.ssh"
TAR_FILE="ssh-keys.tgz"
DEST_FILE="ssh-keys.tgz.gpg"
DECRYPTED_FILE_TO_TEST="ssh-keys-decrypted.tgz"

echo "Building an encrypted archive for ${KEYS_PATH}/* to ${DEST_FILE} ..."
source ./.env # loads GPG_PASSPHRASE
tar cvzf "${TAR_FILE}" ${KEYS_PATH}/*
echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 -o "${DEST_FILE}" --symmetric "${TAR_FILE}"

echo "Making sure that we're able to decrypt the archive"
echo "${GPG_PASSPHRASE}" | gpg --batch --yes --passphrase-fd 0 --decrypt "${DEST_FILE}" > "${DECRYPTED_FILE_TO_TEST}"
diff "${TAR_FILE}" "${DECRYPTED_FILE_TO_TEST}" 

# clean up
rm "${TAR_FILE}" "${DECRYPTED_FILE_TO_TEST}"

echo "✅ Done."
echo "ℹ️ Next steps: run ./zip-and-upload.sh && ./clean-up.sh"
