#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * clearTexture.frag    :    clear a texture -- this is used to address a
 * bug that was interfering with the normal calculations
 * 
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Mon 13 Sep 2021 12:45:10 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl
in vec2 cc ;
out vec4 ocolor ;
void main(){
    ocolor = vec4(0.) ;
    return ;
}
