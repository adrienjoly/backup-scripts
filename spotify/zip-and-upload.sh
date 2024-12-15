set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH

echo "Copying backup to ${UPLOAD_PATH}/spotify ..."
mkdir -p "${UPLOAD_PATH}/spotify"
cp -f "spotify.json" "${UPLOAD_PATH}/spotify"

echo "✅ Done."
