#!/bin/bash

output="libs/Abubu.js"
rm -rf $output
echo >> $output
banner=`cat src/abububanner.js`
datgui=`cat src/libs/dat.gui.js`
glMatrix=`cat src/libs/gl-matrix.js`
version=`grep "var version" src/abubumain.js|awk -F\' '{print $2}'`


cat  src/abububanner.js >> $output
echo >> $output
echo >> $output
echo >> $output
echo >> $output
echo "eval(\`$datgui\`);">> $output
echo >> $output

echo "eval(\`$glMatrix\`);" >> $output
echo >> $output

cat src/abubuhead.js >> $output 


cat src/shaders/shaders.js >> $output 
echo >> $output 
cat src/colormaps.js >> $output 
echo >> $output 
cat src/abubumain.js >> $output 
echo >> $output 
cat src/abubutail.js >> $output
echo >> $output

cp -v $output libs/Abubu.latest.js
cp -v $output libs/Abubu.$version.js
