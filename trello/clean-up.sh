source ../.env # must define UPLOAD_PATH

OLD_BACKUPS="$(find * -type d -maxdepth 0 | sed \$d)" # all but the last backup directory

for NAME in $OLD_BACKUPS
do
  echo "Deleting $NAME from ./ and $UPLOAD_PATH ..."
  rm -r ./$NAME
  rm ./$NAME*.*
  rm $UPLOAD_PATH/trello/$NAME*.*
done

echo "✅ Done."
