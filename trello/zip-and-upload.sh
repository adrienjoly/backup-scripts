set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH

LAST_BACKUP_DIR="$(find * -type d -maxdepth 0 | tail -1)"

echo "Archiving last backup files to $LAST_BACKUP_DIR.zip ..."
zip -q -r -9 "${LAST_BACKUP_DIR}.zip" "$LAST_BACKUP_DIR"

echo "Moving archive to ${UPLOAD_PATH}/trello ..."
mkdir -p "${UPLOAD_PATH}/trello"
mv "${LAST_BACKUP_DIR}.*" "${UPLOAD_PATH}/trello"

echo "Renaming ${LAST_BACKUP_DIR} to ${LAST_BACKUP_DIR}_archived ..."
mv "${LAST_BACKUP_DIR}" "${LAST_BACKUP_DIR}_archived"

echo "✅ Done."
echo "ℹ️ Next steps: run ./clean-up.sh"
