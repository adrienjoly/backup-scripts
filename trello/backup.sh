# tested docker image: jtpio/trello-full-backup (build date: 2017-05-30, build code: bot7hjnqmaxqedjdteypexk)

set -e # this script will exit if any command returns a non-null value

source .env # must define TRELLO_API_KEY and TRELLO_TOKEN

BACKUP_PATH="$PWD"
# ℹ️ the script will generate a subdirectory in it like: 2018-07-29_12-13-18_backup

mkdir -p $BACKUP_PATH

echo "Backing up trello boards to a subdirectory of $BACKUP_PATH ..."

docker run -t -e TRELLO_API_KEY=$TRELLO_API_KEY -e TRELLO_TOKEN=$TRELLO_TOKEN \
           -v $BACKUP_PATH:/app jtpio/trello-full-backup trello-full-backup --attachment-size -1 --organizations
           # --closed-boards --archived-cards

echo "✅ Done."
echo "ℹ️ Next steps: run ./diff-changes.sh && zip-and-upload.sh && ./clean-up.sh"
