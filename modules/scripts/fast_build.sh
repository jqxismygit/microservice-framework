#!/bin/bash
PWD=`pwd`

APP_JSON_CONFIG_FILE="../framework/public/app_dev.json"
LERNA_CONFIG_FILE="$PWD/lerna.json"
LERNA_CONFIG_FILE_TMP="$PWD/lerna_tmp.json"
LERNA_CONFIG_FILE_BAK="$PWD/lerna.bak.json"

echo "-------------->>"
pwd
echo $APP_JSON_CONFIG_FILE
echo $LERNA_CONFIG_FILE
echo $LERNA_CONFIG_FILE_TMP
echo $LERNA_CONFIG_FILE_BAK
echo "-------------->>"

cp $LERNA_CONFIG_FILE_BAK $LERNA_CONFIG_FILE 

rm -rf $LERNA_CONFIG_FILE_TMP
cp $LERNA_CONFIG_FILE $LERNA_CONFIG_FILE_TMP 

python ./scripts/fast.py  $APP_JSON_CONFIG_FILE $LERNA_CONFIG_FILE $LERNA_CONFIG_FILE_BAK 

cp $LERNA_CONFIG_FILE_TMP $LERNA_CONFIG_FILE
rm -rf $LERNA_CONFIG_FILE_TMP

# LERNA_CONFIG=`cat lerna.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj"`
# APP_DEV_CONFIG=`cat ../framework/public/app_dev.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj"`

# echo $LERNA_CONFIG

echo $APP_DEV_CONFIG

lerna run build --parallel --concurrency 1 --stream