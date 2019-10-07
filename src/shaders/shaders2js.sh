#!/bin/bash

outputfile="shaders.js"
rm -rf $outputfile
for filename in `ls *.frag *.vert`; do
    name=`echo $filename|awk -F. '{print $1}'`
    content=`cat $filename`
    echo "var $name = { value : \`$content\` } ;" >> $outputfile
    echo >> $outputfile
    echo >> $outputfile
    echo >> $outputfile
done
