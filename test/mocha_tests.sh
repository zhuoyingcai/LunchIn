#!/bin/bash
find ./server -type d -name '*test*' -print | while read line
do
  mocha $line
done
