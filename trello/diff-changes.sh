set -e # this script will exit if any command returns a non-null value

tree () {
  find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
}

DIRS="$(find * -type d -maxdepth 0)"

for DIR in $DIRS
do
  OUTPUT_FILE="$DIR.tree.txt"
  echo "Generating $OUTPUT_FILE ..."
  cd $DIR
  tree >../$OUTPUT_FILE
  cd ..
done

TWO_LAST_DIRS=($(find * -type d -maxdepth 0 | tail -2))
DIR1="${TWO_LAST_DIRS[0]}"
DIR2="${TWO_LAST_DIRS[1]}"
OUTPUT_FILE="diff-from-$DIR1-to-$DIR2.log"

echo "Generating diff of last two backups => $OUTPUT_FILE ..."
# LAST_TWO_FILES="$(ls -1 *.txt | tail -2)"
# git diff $LAST_TWO_FILES >$OUTPUT_FILE

diff -r --brief $DIR1 $DIR2 | sed -e "s/Only in $DIR2/+ /g" -e "s/Only in $DIR1/- /g" >$OUTPUT_FILE

CHANGES="$(cat $OUTPUT_FILE | wc -l | tr -d ' ')"
ADDITIONS="$(grep '^+ ' $OUTPUT_FILE | wc -l | tr -d ' ')"
REMOVALS="$(grep '^- ' $OUTPUT_FILE | wc -l | tr -d ' ')"
echo "🗒 found $CHANGES changes since last backup (+$ADDITIONS -$REMOVALS)"

echo "✅ Done."
