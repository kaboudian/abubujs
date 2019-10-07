#version 300 es
/*========================================================================
 * tiptShader 
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:07:07 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
in      vec2 pixPos ;
uniform sampler2D  vPrv;
uniform sampler2D  vCur;
uniform sampler2D  tips ;
uniform float Uth ;
uniform vec4 channel ;

uniform bool path ;

out     vec4    ftipt ;

/*=========================================================================
 * main
 *=========================================================================
 */
void main(){
    if (!path){
        ftipt = vec4( 0., 0., 0., 0.) ;
        return ;
    }

    vec4 tip = texture( tips, pixPos ) ;
    vec2 size = vec2( textureSize(vPrv,0)) ;
    vec2 ii = vec2(1.,0.)/size  ;
    vec2 jj = vec2(0.,1.)/size  ;

    float v0 = dot(texture( vCur, pixPos ),channel) ;
    float vx = dot(texture( vCur, pixPos + ii),channel) ;
    float vy = dot(texture( vCur, pixPos + jj),channel) ;
    float vxy= dot(texture( vCur, pixPos + ii+ jj),channel) ;

    float f0 = v0 - Uth ;
    float fx = vx - Uth ;
    float fy = vy - Uth ;
    float fxy= vxy - Uth ;

    float s = step(0., f0) + step(0., fx) + step(0., fy) +
        step(0., fxy ) ;
    bool bv = (s>.5) && ( s<3.5 ) ;

    float d0    = v0   -   dot(texture( vPrv, pixPos          ),channel) ; 
    float dx    = vx   -   dot(texture( vPrv, pixPos + ii     ),channel);
    float dy    = vy   -   dot(texture( vPrv, pixPos + jj     ),channel) ;
    float dxy   = vxy  -   dot(texture( vPrv, pixPos + ii + jj),channel) ;

    s = step(0., d0) + step(0., dx) + step(0., dy) + step(0.,dxy) ;
    bool bdv = (s>.25) && ( s<3.5 ) ;

    if( !( (tip.r > .5) || (bv && bdv) ) ){
        ftipt = tip ;
        return;
    }

    fx -= f0;  fy -= f0;  dx -= d0;  dy -= d0;
    float det1 = 1./(fx*dy - fy*dx);
    float x = -(f0*dy - d0*fy)*det1; // intersection coordinates
    float y = -(fx*d0 - dx*f0)*det1;
    if  ( (x > 0.) && (x < 1.) && (y > 0.) && (y < 1.) ){
        tip = vec4(1.,1.,1.,1.) ;
    }

    ftipt = tip ;
    return ;
}
