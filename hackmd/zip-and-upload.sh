set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH

BACKUP_FILE="$(find *.zip -type f -maxdepth 0 | tail -1)"
DEST_DIR="${UPLOAD_PATH}/hackmd"

echo "Moving ${BACKUP_FILE} to ${DEST_DIR} ..."
mkdir -p "${DEST_DIR}"
mv "${BACKUP_FILE}" "${DEST_DIR}"

echo "✅ Done."
echo "ℹ️  Next steps: run ./clean-up.sh"
