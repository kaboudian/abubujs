#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrc2FShader  :   2nd Pass Fragment Shader for Volume-Ray-Casting
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 28 Nov 2018 12:16:39 (EST) 
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*------------------------------------------------------------------------
 * Interface vars.
 *------------------------------------------------------------------------
 */
in      vec3        worldSpaceCoords;
in      vec4        projectedCoords;
uniform sampler2D   backfaceCrdTxt;
uniform sampler2D   phaseTxt ;
uniform sampler2D   target ;
uniform sampler2D   compMap ;
uniform sampler2D   lightTxt ;
uniform sampler2D   clrm ;
uniform bool        rayCast ;
uniform bool        usePhaseField , useCompMap ;
uniform bool        drawFilament, showXCut, showYCut, showZCut ;
uniform sampler2D   flmt ;
uniform float       xLevel, yLevel, zLevel ;
uniform vec4        filamentColor ;
uniform float       minValue, maxValue, threshold ;
uniform vec4        channelMultiplier ;

uniform int         noSteps ;
uniform float       alphaCorrection ;

uniform float       mx, my ;
uniform float       lightShift ;
uniform float       structural_alpha ;

out     vec4        FragColor ;

/*========================================================================
 * Acts like a texture3D using Z slices and trilinear filtering
 *========================================================================
 */
/*------------------------------------------------------------------------
 * Texture3D
 *------------------------------------------------------------------------
 */
vec4 Texture3D( sampler2D S, vec3 texCoord )
{
    vec4    vColor1, vColor2 ;
    float x, y ;
    float wd = mx*my - 1.0 ;

    float zSliceNo  = floor( texCoord.z*mx*my) ;

    x = texCoord.x / mx ;
    y = texCoord.y / my ;

    x += (mod(zSliceNo,mx)/mx) ;
    y += floor((wd-zSliceNo)/ mx )/my ;

    vColor1 = texture( S,  vec2(x,y) ) ;

    zSliceNo = ceil( texCoord.z*mx*my) ;

    x = texCoord.x / mx ;
    y = texCoord.y / my ;

    x += (mod(zSliceNo,mx)/mx) ;
    y += floor((wd-zSliceNo)/ mx )/my ;
    vColor2 = texture( S,  vec2(x,y) ) ;

    return mix(
        vColor2,
        vColor1,
        zSliceNo/(mx*my)-texCoord.z
    ) ;
}

/*------------------------------------------------------------------------
 * CompTexture3D
 *------------------------------------------------------------------------
 */
vec4 CompTexture3D( sampler2D S, vec3 texCoord )
{
    vec4    vColor1, vColor2 ;
    float   x, y ;
    float   wd = mx*my - 1.0 ;

    float zSliceNo  = floor( texCoord.z*mx*my) ;

    x = texCoord.x / mx ;
    y = texCoord.y / my ;

    x += (mod(zSliceNo,mx)/mx) ;
    y += floor((wd-zSliceNo)/ mx )/my ;

    vColor1 = texture(
        S,
        texture(compMap, vec2(x,y)).xy
    ) ;

    zSliceNo = ceil( texCoord.z*mx*my) ;

    x = texCoord.x / mx ;
    y = texCoord.y / my ;

    x += (mod(zSliceNo,mx)/mx) ;
    y += floor((wd-zSliceNo)/ mx )/my ;

    vColor2 = texture(
        S,
        texture(compMap, vec2(x,y)).xy
    ) ;

    return mix(
        vColor2,
        vColor1,
        zSliceNo/(mx*my)-texCoord.z
    ) ;
}


const float SQRT3 = sqrt(1.) ;

/*========================================================================
 * noPhaseField
 *========================================================================
 */
vec4 noPhaseField(){
    // getting the projected coordiante of the texture on the screen
    vec2 texc = ((projectedCoords.xy/projectedCoords.w) + vec2(1.))*0.5 ;

    // getting position on the back face of the cube
    vec3    backCrd = texture( backfaceCrdTxt, texc).xyz ;

    // coordinate of the front face
    vec3    frontCrd = worldSpaceCoords ;

    // direction vector from front to back
    vec3    ray     = backCrd - frontCrd ;
    float   rayLength   = length(ray) ;

    // marching vectors for ray casting
    float   marchLength = rayLength / float(noSteps) ;
    vec3    marchRay    = normalize(ray)*marchLength ;

    vec3    currentCrd  = frontCrd ;

    // Accumulated values during ray casting march
    vec4    accumulatedColor    = vec4(0.);
    float   accumulatedAlpha    = 0. ;
    float   accumulatedLength   = 0. ;

    // Sampled Values
    vec4    sampledTarget ;
    float   sampledValue ;
    float   scaledValue ;
    vec4    sampledColor ;
    float   sampledAlpha ;
    float   sampledLight ;

    // Ray marching loop
    for(int i=0 ; i < noSteps; i++){
        sampledTarget   = Texture3D( target ,   currentCrd ) ;
        sampledValue    = dot(sampledTarget, channelMultiplier ) ;
        scaledValue     = (sampledValue-minValue)
                        / (maxValue - minValue) ;
        sampledLight = Texture3D( lightTxt , currentCrd ).r ;
        if (sampledValue > threshold){
            sampledColor = texture( clrm, vec2(scaledValue, 0.5)) ;
            sampledAlpha = alphaCorrection;
            sampledColor = sampledColor*sampledLight;
        }else{
            sampledAlpha = 0. ;
        }
        sampledAlpha = scaledValue*alphaCorrection ;

        accumulatedColor    += (1.-accumulatedAlpha)
                            *   sampledColor
                            *   sampledAlpha ;
        accumulatedAlpha += sampledAlpha ;
        accumulatedColor.a = accumulatedAlpha ;

        currentCrd += marchRay ;
        accumulatedLength += marchLength ;

        if ( accumulatedAlpha >= 1.0 || accumulatedLength> rayLength){
            accumulatedAlpha = 1.0 ;
            break ;
        }
    }
    return accumulatedColor ;
}

/*========================================================================
 * noRayCast
 *========================================================================
 */
vec4 noRayCast(){
    // getting the projected coordiante of the texture on the screen
    vec2 texc = ((projectedCoords.xy/projectedCoords.w) + vec2(1.))*0.5 ;

    // getting position on the back face of the cube
    vec3    backCrd = texture( backfaceCrdTxt, texc).xyz ;

    // coordinate of the front face
    vec3    frontCrd = worldSpaceCoords ;

    // direction vector from front to back
    vec3    ray     = backCrd - frontCrd ;
    float   rayLength   = length(ray) ;

    // marching vectors for ray casting
    float   marchLength = rayLength / float(noSteps) ;
    vec3    marchRay    = normalize(ray)*marchLength ;

    vec3    currentCrd  = frontCrd ;

    // Accumulated values during ray casting march
    vec4    accumulatedColor    = vec4(0.);
    float   accumulatedAlpha    = 0. ;
    float   accumulatedLength   = 0. ;

    // Sampled Values
    vec4    sampledTarget ;
    float   sampledValue ;
    float   scaledValue ;
    vec4    sampledColor ;
    float   sampledAlpha ;
    float   sampledLight ;
    bool colored = false ;

     // Ray marching loop
    for(int i=0 ; i < noSteps; i++){
        sampledTarget   = Texture3D(    target ,   currentCrd ) ;
        sampledValue    = dot( sampledTarget, channelMultiplier ) ;
        scaledValue     = (sampledValue-minValue)
                        / (maxValue - minValue) ;
        sampledLight = Texture3D( lightTxt , currentCrd ).r ;

        sampledColor = texture ( clrm , vec2(scaledValue, 0.5 )) ;
        
        if (    currentCrd.x < (xLevel+0.005) &&
                currentCrd.x > (xLevel-0.005) &&
                showXCut ){
            accumulatedColor.rgb = sampledColor.rgb + vec3(0.2);
            accumulatedAlpha = 1.0 ;
            colored = true ;
            break ;
        }

        if (    currentCrd.y < (yLevel+0.005) &&
                currentCrd.y > (yLevel-0.005) &&
                showYCut ){
            accumulatedColor.rgb = sampledColor.rgb + vec3(0.1);
            accumulatedAlpha = 1.0 ;
            colored = true ;
            break ;
        }

        if (    currentCrd.z < (zLevel+0.005) &&
                currentCrd.z > (zLevel-0.005) &&
                showZCut ){
            accumulatedColor.rgb = sampledColor.rgb + vec3(0.3);
            accumulatedAlpha = 1.0 ;
            colored = true ;
            break ;
        }
        
        if(drawFilament){        
            sampledValue = Texture3D( flmt, currentCrd ).r ;
            sampledAlpha = 0.0 ;
            if (sampledValue >0.5){
                sampledColor.rgb = filamentColor.rgb*sampledLight ;
                sampledAlpha = alphaCorrection ;
                colored = true ;
            }else{
                sampledAlpha = 0. ;
            }

            accumulatedColor    += (1.-accumulatedAlpha)
                *   sampledColor
                *   sampledAlpha ;
            accumulatedAlpha += sampledAlpha ;
            accumulatedColor.a = accumulatedAlpha ;
        }
        currentCrd += marchRay ;
        accumulatedLength += marchLength ;

        if ( accumulatedAlpha >= 1.0 || accumulatedLength> rayLength){
            accumulatedAlpha = 1.0 ;
            break ;
        }
    }

    if (colored){
        accumulatedAlpha = min(accumulatedAlpha, 1.) ;
        accumulatedColor.a = accumulatedAlpha ;
        return accumulatedColor ;
    }else{
        return vec4(0.) ;
    }
}
/*========================================================================
 * withPhaseField
 *========================================================================
 */
vec4 withPhaseField(){
    // getting the projected coordiante of the texture on the screen
    vec2    texc = (
                (projectedCoords.xy/projectedCoords.w)
                + vec2(1.)
            )*0.5 ;

    // getting position on the back face of the cube
    vec3    backCrd = texture( backfaceCrdTxt, texc).xyz ;

    // coordinate of the front face
    vec3    frontCrd = worldSpaceCoords ;

    // direction vector from front to back
    vec3    ray     = backCrd - frontCrd ;
    float   rayLength   = length(ray) ;

    // marching vectors for ray casting
    float   marchLength = rayLength / float(noSteps) ;
    vec3    marchRay    = normalize(ray)*marchLength ;

    vec3    currentCrd  = frontCrd ;

    // Accumulated values during ray casting march
    vec4    accumulatedColor    = vec4(0.);
    float   accumulatedAlpha    = 0. ;
    float   accumulatedLength   = 0. ;

    // Sampled Values
    vec4    sampledTarget ;
    float   sampledPhase ;
    float   sampledValue ;
    float   scaledValue ;
    vec4    sampledColor ;
    float   sampledAlpha ;
    float   sampledLight ;
    float   phaserAlpha ;
    // Ray marching loop
    for(int i=0 ; i < noSteps; i++){
        sampledTarget   = Texture3D( target ,   currentCrd ) ;
        sampledPhase    = Texture3D( phaseTxt, currentCrd).r ;
        sampledValue    = dot(sampledTarget, channelMultiplier ) ;
        scaledValue     = (sampledValue-minValue)
                        / (maxValue - minValue) ;
        sampledLight = Texture3D( lightTxt , currentCrd ).r ;
        if (sampledPhase > 0.6){
            if (sampledValue > threshold){
                sampledColor = texture( clrm, vec2(scaledValue, 0.5)) ;
                sampledColor = sampledColor*
                    (1.5+lightShift+sampledLight)/(2.5+lightShift);
                phaserAlpha = 1.0 ;
            }else{
                sampledColor.rgb = vec3(0.)+vec3(sampledLight) ;
                phaserAlpha = structural_alpha ;
            }
            sampledAlpha = sampledPhase*alphaCorrection*phaserAlpha ;
        }else{
            sampledColor.rgb = vec3(0.)+vec3(sampledLight) ;
            sampledAlpha = 0. ;
        }

        accumulatedColor    += (1.-accumulatedAlpha)
                            *   sampledColor
                            *   sampledAlpha ;
        accumulatedAlpha += sampledAlpha ;
        accumulatedColor.a = accumulatedAlpha ;

        currentCrd += marchRay ;
        accumulatedLength += marchLength ;

        if ( accumulatedAlpha >= 1.0 || accumulatedLength> rayLength){
            accumulatedAlpha = 1.0 ;
            break ;
        }
    }
    return accumulatedColor ;
}

/*========================================================================
 * withCompressedPhaseField
 *========================================================================
 */
vec4 withCompressedPhaseField(){
    // getting the projected coordiante of the texture on the screen
    vec2    texc = (
                (projectedCoords.xy/projectedCoords.w)
                + vec2(1.)
            )*0.5 ;

    // getting position on the back face of the cube
    vec3    backCrd = texture( backfaceCrdTxt, texc).xyz ;

    // coordinate of the front face
    vec3    frontCrd = worldSpaceCoords ;

    // direction vector from front to back
    vec3    ray     = backCrd - frontCrd ;
    float   rayLength   = length(ray) ;

    // marching vectors for ray casting
    float   marchLength = rayLength / float(noSteps) ;
    vec3    marchRay    = normalize(ray)*marchLength ;

    vec3    currentCrd  = frontCrd ;

    // Accumulated values during ray casting march
    vec4    accumulatedColor    = vec4(0.);
    float   accumulatedAlpha    = 0. ;
    float   accumulatedLength   = 0. ;

    // Sampled Values
    vec4    sampledTarget ;
    float   sampledPhase ;
    float   sampledValue ;
    float   scaledValue ;
    vec4    sampledColor ;
    float   sampledAlpha ;
    float   sampledLight ;
    float   phaserAlpha ;
    // Ray marching loop
    for(int i=0 ; i < noSteps; i++){
        sampledTarget   = CompTexture3D( target ,   currentCrd ) ;
        sampledPhase    = Texture3D( phaseTxt, currentCrd).r ;
        sampledValue    = dot(sampledTarget, channelMultiplier ) ;
        scaledValue     = (sampledValue-minValue)
                        / (maxValue - minValue) ;

        
        sampledLight = Texture3D( lightTxt , currentCrd ).r ;
        if (sampledPhase > 0.98){
            if (sampledValue > threshold){
                sampledColor = texture( clrm, vec2(scaledValue, 0.5)) ;
                sampledColor = sampledColor*
                    (1.+lightShift+sampledLight)/(2.+lightShift);
                phaserAlpha = 1.0 ;
            }else{
                sampledColor.rgb = vec3(0.)+vec3(sampledLight) ;
                phaserAlpha = structural_alpha ;
            }
            sampledAlpha = sampledPhase*alphaCorrection*phaserAlpha ;
        }else{
            sampledColor.rgb = vec3(0.)+vec3(sampledLight) ;
            sampledAlpha = 0. ;
        }

        accumulatedColor    += (1.-accumulatedAlpha)
                            *   sampledColor
                            *   sampledAlpha ;
        accumulatedAlpha += sampledAlpha ;
        accumulatedColor.a = accumulatedAlpha ;

        currentCrd += marchRay ;
        accumulatedLength += marchLength ;

        if ( accumulatedAlpha >= 1.0 || accumulatedLength> rayLength){
            accumulatedAlpha = 1.0 ;
            break ;
        }
    }
    return accumulatedColor ;
}

/*========================================================================
 * Main body of pass2Shader
 *========================================================================
 */
void main( void ) {
    if ( usePhaseField ){
        if ( useCompMap ){
            FragColor = withCompressedPhaseField() ;
        }else{
            FragColor = withPhaseField() ;
        }
    }else{
        if (rayCast ){
            FragColor = noPhaseField() ;
        }else{
            FragColor = noRayCast() ;
        }
    }
}
