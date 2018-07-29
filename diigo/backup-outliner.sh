set -e # this script will exit if any command returns a non-null value

source .env # must define DIIGO_USERNAME and DIIGO_URLENCODED_PASSWORD

# echo "Backing up Diigo bookmarks to a subdirectory of $OUTPUT_FILE ..."

URL="https://www.diigo.com"

fetchCookiesFromCurl () {
  $1 2>&1 | grep "Set-Cookie" | sed -E 's/^< Set-Cookie: ([^;]*;).*$/\1/' | tr '\n' ' '
}

# COOKIES=($(curl -v -s $URL 2>&1 | grep "Set-Cookie" | sed -e "s/< Set-Cookie: ([^;]+;)/\$1/g"))

# COOKIES="$(curl -v -s $URL 2>&1 | grep "Set-Cookie" | sed -E 's/^< Set-Cookie: ([^;]*;).*$/\1/' | tr '\n' ' ')"

echo "Accessing $URL ..."
COOKIES=$(fetchCookiesFromCurl "curl -v -s $URL")
echo "=> Initial Cookies: $COOKIES"

# curl "$URL/sign-in" -v -s 2>&1 -H 'Pragma: no-cache' -H 'Origin: https://www.diigo.com' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en-GB;q=0.7,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: */*' -H 'Cache-Control: no-cache' -H 'X-Requested-With: XMLHttpRequest' -H "Cookie: $COOKIES" -H 'Connection: keep-alive' -H 'Referer: https://www.diigo.com/sign-in?referInfo=https%3A%2F%2Fwww.diigo.com' --data 'referInfo=https%3A%2F%2Fwww.diigo.com&username=xxx&password=xxx' --compressed

# curl "$URL/sign-in" -v -s 2>&1 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: */*' -H "Cookie: $COOKIES" -H 'Connection: keep-alive' -H 'Referer: https://www.diigo.com/sign-in?referInfo=https%3A%2F%2Fwww.diigo.com' --data 'referInfo=https%3A%2F%2Fwww.diigo.com&username=xx&password=xxx'

echo "Logging is as $DIIGO_USERNAME ..."
CURL="curl $URL/sign-in -v -s -H \"Cookie: $COOKIES\" --data \"referInfo=https%3A%2F%2Fwww.diigo.com&username=$DIIGO_USERNAME&password=$DIIGO_URLENCODED_PASSWORD\""
# echo $CURL ...

# LOGIN_COOKIES="$($CURL 2>&1 | grep "Set-Cookie" | sed -E 's/^< Set-Cookie: ([^;]*;).*$/\1/' | tr '\n' ' ')"

LOGIN_COOKIES=$(fetchCookiesFromCurl "$CURL")
echo "=> Final Cookies: $LOGIN_COOKIES"

CURL="curl $URL/outliner/list -H \"Cookie: $LOGIN_COOKIES\""

echo "$CURL ..."

$CURL

# echo "✅ Done."
# echo "ℹ️ Next steps: run ./diff-changes.sh && zip-and-upload.sh && ./clean-up.sh"
