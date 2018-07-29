set -e # this script will exit if any command returns a non-null value

source ../.env # must define UPLOAD_PATH

OLD_BACKUPS="$(find * -type d -maxdepth 0 | sed \$d)"

for NAME in $OLD_BACKUPS
do
  echo "Deleting $NAME from ./ and $UPLOAD_PATH ..."
  rm -r ./$NAME
  rm ./$NAME*.* &>/dev/null
  rm $UPLOAD_PATH/trello/$NAME.* &>/dev/null
done

echo "✅ Done."
