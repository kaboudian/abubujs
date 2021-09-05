<?php
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * shader : Script used for importing shaders and handling 
 *          "#include" directives in the shader files
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Wed 01 Sep 2021 20:22:08 (EDT)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

/*========================================================================
 * a function that creates a script section with the id of the file
 * and also reads the content file into the script section 
 *========================================================================
 */
function commentLine($n, $char, $oc="<!-- ", $ec=" -->" ){
    echo $oc ;
    for($i=0 ; $i< $n ; $i++){
        echo $char ;
    }
    echo $ec . "\n" ;
}

/*========================================================================
 * This function loads the content of a file line by line and if there is
 * any include statements it loads those files recursively
 *========================================================================
 */
function getShader($file, $dir ){
    $output = "" ;
    
    // get the text content of the file ..................................
    $content = file_get_contents( $dir . $file ) ;
    
    // array of lines ....................................................
    $arr = explode("\n", $content); 
    
    // number of lines in the file .......................................
    $noLines = count($arr) ;

    // process each line of the file .....................................
    for($i=0 ; $i<$noLines ; $i++){
        $lineArray = preg_split('/\s+/', $arr[$i]);

        /* if the first word of the line is #include load the included
           file, otherwise, append the line as is */
        $noWords=count($lineArray) ;
        $noInclude=true ;
        for($j=0 ; $j<$noWords; $j++){
            if ( $lineArray[$j] == "#include" ){
                $noInclude=false ;
                $output = $output . getShader( $lineArray[$j+1], $dir ) ;
                break ;
            }
        }
        if ($noInclude){
            $output = $output . $arr[$i] . "\n" ;
        }
    }
    return $output ;
}

/*========================================================================
 * creates a shader block by providing the name of the shader without the 
 * extension of the file. The supported extensions are .frag, .vert, .glsl
 * 
 * The optional $dir argument was added to look for the shader in the $dir
 * directory rather than the default base directory
 *========================================================================
 */
function shader($name, $dir = __dir__ . "/"){
    commentLine(65, "*") ;
    $F = $dir . $name ;

    //
    if ( file_exists( $F . ".frag" ) ){
        echo "<script id='" . $name . "' type='x-shader-fragment'>" ;
        $FEXT=".frag" ;
    }else if ( file_exists( $F . ".vert" ) ){
        echo "<script id='" . $name . "' type='x-shader-vertex'>" ;
        $FEXT=".vert" ;
    }else if ( file_exists( $F . ".glsl" ) ) {
        echo "<script id='" . $name . "' type='x-shader'>" ;
        $FEXT=".glsl" ;
    }


    $content = trim(getShader($name . $FEXT, $dir )) ;

    echo $content ;
    echo "\n</script><!-- end of " . 
        $name . 
        " shader's source code -->\n\n" ;
}

/*=========================================================================
 * shader2js: an alias for the shader function 
 *=========================================================================
 */
function shader2js($name, $dir = __dir__ . "/" ){
    shader($name, $dir) ;
}

/*=========================================================================
 * shader2var: creates a JavaScript variable compatible with the Abubu.js  
 *=========================================================================
 */
function shader2var($name,$dir = __dir__ . "/"){
    commentLine(72, "$" , "/*", "") ;
    echo " * " . $name . "\n" ;
    commentLine(72, "$" , " *", "") ;
    echo " */\n" ;

    $F = $dir . $name ;
    
    if ( file_exists( $F . ".frag" ) ){
        $FEXT=".frag" ;
    }else if ( file_exists( $F . ".vert" ) ){
        $FEXT=".vert" ;
    }else if ( file_exists( $F . ".glsl" ) ) {
        $FEXT=".glsl" ;
    }

    
    $content = trim(getShader($name . $FEXT, $dir )) ;

    echo "var " . $name . " = { value : `" . $content . "` } ;" ;
    echo "\n\n" ;
}
?>
