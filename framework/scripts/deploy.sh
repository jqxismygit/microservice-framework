#!/bin/bash

TARGET=$1
PWD=`pwd`
export NODE_ENV="production"
export API_HOST="https://api.yangbentong.com"
export VERSION=`cat package.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj['version']"`
export BUILD_DIR="$PWD/$VERSION"
export DEPLOY_DIR="/srv/webapps/orbit-assets-released/v3-framework"
export PUBLIC_PATH="https://assets-cdn.yangbentong.com/v3-framework/${VERSION}"
export PACKAGE_BUNDLE_PREFIX="https://assets-cdn.yangbentong.com/v3-modules/official"

if [[ -z $TARGET ]]; then
  TARGET='ecs-sh'
fi

echo -e "\033[30m\033[42m framework@$VERSION \033[0m"
echo -e "TARGET: $TARGET"
echo -e "VERSION: $VERSION"
echo -e "BUILD_DIR: ${BUILD_DIR}"
echo -e "DEPLOY_DIR: $DEPLOY_DIR"

npm run build
echo "build success ${VERSION}"

echo "gen manifest.json"
BUILD_DIR=${BUILD_DIR} ./scripts/gen_manifest.js

# echo "archiving ..."
# zip -r -m -q ./${VERSION}.zip ${VERSION}/*
# if [ ! -e ./${VERSION}.zip ]; then
#   echo "-- zip faild!"
#   exit 1
# fi
#
# echo "sync ${VERSION}.zip"
# scp ./${VERSION}.zip $TARGET:$DEPLOY_DIR
echo -e "\033[32mArchiving ...\033[0m"
tar -czf $VERSION.tar.gz -C $PWD/$VERSION ./
if [ ! -e $VERSION.tar.gz ]; then
  echo -e "\033[31m\n❗❗❗ zip faild!\033[0m\n"
  exit 1
fi

function deploy() {
  ssh $1 bash -c "'
    if [[ ! -d $DEPLOY_DIR ]]; then
      mkdir -p $DEPLOY_DIR
      exit 0
    fi
  '"

  echo -e "\033[32mSync to $1 ...\033[0m"
  # TODO 需要判断当前版本是否已存在，version不可重复发布，必须增加版本号
  scp -q $VERSION.tar.gz $1:$DEPLOY_DIR

  ssh $1 bash -c "'
    cd $DEPLOY_DIR
    mkdir -p $VERSION
    tar -xzf $VERSION.tar.gz -C $VERSION
    rm $VERSION.tar.gz
    exit 0
  '"
}

deploy $TARGET

if [ $TARGET == "ecs-sh" ]; then
  deploy "ecs-hk"
fi

rm -rf $VERSION $VERSION.tar.gz

echo -e "\033[32mDeploy successfully 💪💪💪\033[0m"
echo -e ""
echo -e "$PUBLIC_PATH/manifest.json"
echo -e ""
