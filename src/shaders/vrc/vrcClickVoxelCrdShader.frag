#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcClickVoxelCrdShader.frag 
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 May 2018 04:09:17 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*------------------------------------------------------------------------
 * interface variables 
 *------------------------------------------------------------------------
 */
in      vec2        pixPos ;
uniform float       mx, my ;
uniform sampler2D   clickCoordinates ;
uniform bool        useCompMap ;
uniform sampler2D   compMap ;

/*------------------------------------------------------------------------
 * output variable
 *------------------------------------------------------------------------
 */
layout (location = 0) out vec4 voxelPos ;

/*========================================================================
 * main
 *========================================================================
 */
void main(){
    vec4    pos = vec4(1.) ;
    vec3    crd = texture( clickCoordinates, vec2(0.5)).xyz ;
    float   RN, CN, SN ; /* row, column, and slice numbers */
    SN = floor(crd.z*mx*my) ;
    RN = floor(SN/mx) ;
    CN = SN-RN*mx ;
    pos.x = crd.x/mx + CN/mx ;
    pos.y = crd.y/my + (my-1.-RN)/my ;

    if (useCompMap){
        voxelPos = texture( compMap, pos.xy) ;
    }else{
        voxelPos = pos ;
    }
    return ;
}
