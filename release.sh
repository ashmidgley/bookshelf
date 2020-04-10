#!/bin/bash

npm install
npm run build
rm -r /var/www/bookshelf.co.nz/html/*
cp -r ./build/* /var/www/bookshelf.co.nz/html