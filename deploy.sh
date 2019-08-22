#!/bin/sh

$BUILD_DIR = ./build
$SITE_DIR = 

npm install
npm run build
rm -r $SITE_DIR/*
cp $BUILD_DIR/* $SITE_DIR -r
rm -r $BUILD_DIR
