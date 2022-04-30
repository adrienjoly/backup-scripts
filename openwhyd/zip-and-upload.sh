set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH

LAST_BACKUP_DIR="$(find * -type d -maxdepth 0 | tail -1)"
BACKUP_FILE="${LAST_BACKUP_DIR}.zip"
DEST_DIR="${UPLOAD_PATH}/openwhyd"

echo "Archiving last backup to ${BACKUP_FILE} ..."
zip -q -r -9 "${BACKUP_FILE}" "${LAST_BACKUP_DIR}"

echo "Moving archive to ${DEST_DIR} ..."
mkdir -p "${DEST_DIR}"
mv "${BACKUP_FILE}" "${DEST_DIR}"

echo "Renaming ${LAST_BACKUP_DIR} to ${LAST_BACKUP_DIR}_archived ..."
mv "${LAST_BACKUP_DIR}" "${LAST_BACKUP_DIR}_archived"

echo "✅ Done."
echo "ℹ️  Next steps: run ./clean-up.sh"
