#!/bin/bash
PWD=`pwd`

LERNA_CONFIG_FILE="$PWD/lerna.json"
LERNA_CONFIG_FILE_BAK="$PWD/lerna.bak.json"

cp $LERNA_CONFIG_FILE_BAK $LERNA_CONFIG_FILE

lerna run build --parallel --concurrency 1 --stream