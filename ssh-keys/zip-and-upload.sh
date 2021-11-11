set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH
DEST_PATH="${UPLOAD_PATH}/ssh-keys"

echo "Copying backup to ${DEST_PATH} ..."
mkdir -p "${DEST_PATH}"
cp -f "ssh-keys.tgz.gpg" "${DEST_PATH}"
echo "gpg --decrypt ssh-keys.tgz.gpg > ssh-keys.tgz" > "${DEST_PATH}/decrypt.sh"

echo "✅ Done."
