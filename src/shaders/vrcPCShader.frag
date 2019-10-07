#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcPCShader  :   Volume-Ray-Casting Projected Coordinate Shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Sat 12 Aug 2017 06:25:30 PM EDT
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
uniform bool        usePhaseField ;

uniform float       minValue, maxValue, threshold ;
uniform vec4        channelMultiplier ;
uniform float       clickPenetration ;

uniform int         noSteps ;
uniform float       mx, my ;

out vec4 FragColor ;

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
    
    accumulatedColor.rgb = frontCrd ;
    accumulatedColor.a = 1. ;
    return accumulatedColor ;
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
    float   sampledPhase ;
    vec4    sampledColor ;
    float   sampledAlpha ;

    // Ray marching loop
    for(int i=0 ; i < noSteps; i++){
        sampledPhase    = Texture3D( phaseTxt, currentCrd).r ;
        if (sampledPhase > 0.99){
            sampledColor.rgb = currentCrd + marchRay*clickPenetration;
            sampledAlpha = 2.0 ;
        }else{
            sampledColor.rgb = vec3(0.)  ;
            sampledAlpha = 0. ;
        }

        accumulatedColor    +=  sampledColor ;
        accumulatedAlpha    += sampledAlpha ;

        currentCrd += marchRay ;
        accumulatedLength += marchLength ;

        if ( accumulatedAlpha >= 1.0 || accumulatedLength> SQRT3){
            accumulatedAlpha = 1.0 ;
            break ;
        }
    }
    accumulatedColor.a = accumulatedAlpha ;
    return accumulatedColor ;
}

/*========================================================================
 * Main body of pass2Shader
 *========================================================================
 */
void main( void ) {
    if ( usePhaseField ){
        FragColor = withPhaseField() ;
    }else{
        FragColor = noPhaseField() ;
    }
}
