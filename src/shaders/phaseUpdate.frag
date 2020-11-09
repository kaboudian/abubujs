#version 300 es 
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * phaseUpdate.frag : updates the phase value of at the probe location
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Mon 09 Nov 2020 11:00:51 (EST)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float ;
precision highp int ;

in vec2 cc ;

uniform sampler2D   icolor ;    /*  
                                    previous texture's color:
                                    the red channel represents a current
                                    value of the phase in the phase-space.

                                    the green channel represents the
                                    previous points visited in the phase
                                    space.
                                 */
uniform sampler2D   xcolor ;   /* texture to read the horizontal value in
                                  phase-space from */
uniform sampler2D   ycolor ;   /* texture to read the vertical value in
                                  the phase-space from */

uniform vec4        xMultiplier ; /* channel multiplier for the horizontal
                                     value */
uniform vec4        yMultiplier ; /* channel multiplier for the vertical
                                     value */

uniform float       xMin, xMax, yMin, yMax ;/* range of x and y */

uniform vec2        probePosition ; /* position of the probe */

#define probe       probePosition

layout (location = 0) out vec4 ocolor ;

void main(){
    vec4  color  = texture( icolor, cc ) ;
    float x     = (dot( xMultiplier, texture( xcolor,probe ) ) - xMin)
                /(xMax-xMin)  ;
    float y     = (dot( yMultiplier, texture( ycolor,probe ) ) - yMin) 
                /(yMax-yMin) ;

    if ( color.r > 0.5 ){
        color.g = 1. ;
        color.r = 0. ;
    }

    if ( length(cc-vec2(x,y)) < 0.013 ){
        color.r = 1. ;
    }

    ocolor = vec4(color) ;

    return ;
}
