<?php
    include 'shader.php' ;

    // General ...........................................................
    shader2var('DefaultVertexShader'        ) ;
    shader2var('vertShader'                 ) ;

    // Copy ..............................................................
    shader2var('wA2bShader'                 ) ;   

    // line/curve shaders ................................................
    shader2var('lfgmShader'                 ) ;
    shader2var('lpvtShader'                 ) ;
    shader2var('lvtxShader'                 ) ;

    // SignalPlot ........................................................
    shader2var('histShader'                 ) ;
    shader2var('sctwShader'                 ) ;
    shader2var('ipltShader'                 ) ;

    // PhasePlot .........................................................
    shader2var('phaseInit'                  ) ;
    shader2var('phaseUpdate'                ) ;
    shader2var('phaseDisplay'               ) ;

    // Plot2D ............................................................
    shader2var('bgndShader'                 ) ;
    shader2var('tiptInitShader'             ) ;
    shader2var('tiptShader'                 ) ;
    shader2var('dispPhasShader'             ) ;
    shader2var('dispBackgroundPhasShader'   ) ;
    shader2var('dispShader'                 ) ;

    // Tvsx ..............................................................
    shader2var('tvsxShader'                 ) ;
    shader2var('tstpShader'                 ) ;

    // volume ray-caster .................................................
    shader2var('vrc1FShader'             , __dir__ . "/vrc/"   ) ;
    shader2var('vrc1VShader'             , __dir__ . "/vrc/"   ) ;
    shader2var('vrc2FShader'             , __dir__ . "/vrc/"   ) ;
    shader2var('vrc2VShader'             , __dir__ . "/vrc/"   ) ;
    shader2var('vrcClickCrdShader'       , __dir__ . "/vrc/"   ) ;
    shader2var('vrcClickVoxelCrdShader'  , __dir__ . "/vrc/"   ) ;
    shader2var('vrcCrdShader'            , __dir__ . "/vrc/"   ) ;
    shader2var('vrcFrmShader'            , __dir__ . "/vrc/"   ) ;
    shader2var('vrcLgtShader'            , __dir__ . "/vrc/"   ) ;
    shader2var('vrcPCShader'             , __dir__ . "/vrc/"   ) ;
    shader2var('filamentShader'          , __dir__ . "/vrc/"   ) ;
?>
