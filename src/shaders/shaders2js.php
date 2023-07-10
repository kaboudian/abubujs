<?php
    include 'shader.php' ;
    $dir = __dir__ . "/" ;

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

    shader2var('vrc1FShader'             , $dir . "vrc/"   ) ;
    shader2var('vrc1VShader'             , $dir . "vrc/"   ) ;
    shader2var('vrc2FShader'             , $dir . "vrc/"   ) ;
    shader2var('vrc2VShader'             , $dir . "vrc/"   ) ;
    shader2var('vrcClickCrdShader'       , $dir . "vrc/"   ) ;
    shader2var('vrcClickVoxelCrdShader'  , $dir . "vrc/"   ) ;
    shader2var('vrcCrdShader'            , $dir . "vrc/"   ) ;
    shader2var('vrcFrmShader'            , $dir . "vrc/"   ) ;
    shader2var('vrcLgtShader'            , $dir . "vrc/"   ) ;
    shader2var('vrcPCShader'             , $dir . "vrc/"   ) ;
    shader2var('filamentShader'          , $dir . "vrc/"   ) ;


    // StructureFromJSON .................................................
    shader2var( 'compressedCoordinator' , $dir . "StructureFromJSON/"   ) ;
    shader2var( 'fullCoordinator'       , $dir . "StructureFromJSON/"   ) ;
    shader2var( 'normals'               , $dir . "StructureFromJSON/"   ) ;

    // SurfaceVisualizer .................................................
    shader2var( 'vsurfaceView'          , $dir . "SurfaceVisualizer/"   ) ;
    shader2var( 'fsurfaceView'          , $dir . "SurfaceVisualizer/"   ) ;
    shader2var( 'fsurfaceViewBlend'     , $dir . "SurfaceVisualizer/"   ) ;
    shader2var( 'fsurfaceViewCompressedClickPosition'     
                                    , $dir . "SurfaceVisualizer/"   ) ;

?>
