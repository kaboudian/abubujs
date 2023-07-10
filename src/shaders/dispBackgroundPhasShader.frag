#version 300 es
/*========================================================================
 * dispBackgroundPhasShader 
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:23 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
uniform float       minValue ;
uniform float       maxValue ;
uniform vec3        tiptColor ;
uniform float       tiptThickness ;     
uniform vec4        minColor, maxColor ;
uniform bool        enableMaxColor, enableMinColor ;

uniform sampler2D   phas ;
uniform sampler2D   background ;
uniform sampler2D   map ;
uniform sampler2D   tipt ;
uniform sampler2D   clrm ;
uniform sampler2D   prob ;
uniform vec4        channelMultiplier ;
uniform vec3        phaseColor ;
in  vec2            pixPos ;
out vec4            FragColor ;

/*=========================================================================
 * Hyperbolic Tangent
 *=========================================================================
 */
float Tanh(float x){
    if ( x<-3.0){
        return -1.0 ;
    } else if (x>3.0){
        return 1.0 ;
    } else {
        return x*(27.0 + x*x)/(27.0+9.0*x*x) ;
    }
}

/*=========================================================================
 * Main body of Display Fragment Shader 
 *=========================================================================
 */
void main()
{
    float   isTipt ;
    float   r, gamma;
    vec4    t = texture(map,pixPos);
    vec4    phase = texture( phas, pixPos ) ;
    
    vec2 size   = vec2(textureSize(map,0)) ;
    vec2 ii = vec2(1.,0.)/size ;
    vec2 jj = vec2(0.,1.)/size ;

    
    isTipt = texture(tipt, pixPos).a ;
    
    isTipt = max(isTipt, texture(tipt, pixPos+ii            ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos+ii+jj         ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos+jj            ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos-ii            ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos-ii-jj         ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos-jj            ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos+ii-jj         ).a ) ;
    isTipt = max(isTipt, texture(tipt, pixPos-ii+jj         ).a ) ;

    r = dot(t, channelMultiplier) ;
    r = (r-minValue)/(maxValue-minValue) ;

    vec4 pixColor   = texture(  clrm, vec2(r,0.5)   ) ;
    vec4 probColor  = texture(  prob, pixPos        )  ;

    if ( enableMinColor ) if (r < 0.) pixColor = minColor ;
    if ( enableMaxColor ) if (r >1.) pixColor = maxColor ;

    if ( phase.r > .98 ){
        FragColor    = mix(mix(pixColor, vec4(tiptColor,1.0),isTipt), probColor, probColor.a) ;
    }else{
        FragColor    = vec4(phaseColor,1.) ;
        r = 0.0 ;
    }

    vec4 backgroundColor = texture(background, pixPos ) ;
    FragColor = mix(backgroundColor,FragColor, r) ;
}
