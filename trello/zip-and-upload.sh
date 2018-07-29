set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH

LAST_BACKUP_DIR="$(find * -type d -maxdepth 0 | tail -1)"

echo "Archiving last backup files to $LAST_BACKUP_DIR.zip ..."
zip -q -r -9 $LAST_BACKUP_DIR.zip $LAST_BACKUP_DIR

mv $LAST_BACKUP_DIR.zip $UPLOAD_PATH/trello

echo "✅ Done."
echo "ℹ️ Next steps: clean up old backups, and store the last backup somewhere safe."
