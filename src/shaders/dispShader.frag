#version 300 es
/*========================================================================
 * dispShader 
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:29 PM EDT
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
uniform vec4        minColor, maxColor ;
uniform bool        enableMaxColor, enableMinColor ;
uniform float       tiptThickness ;                                                      
uniform sampler2D   map ;
uniform sampler2D   tipt ;
uniform sampler2D   clrm ;
uniform sampler2D   prob ;
uniform vec4        channelMultiplier ;

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
    
    vec2 size   = vec2(textureSize(map,0)) ;
    vec2 ii = vec2(1.,0.)/size ;
    vec2 jj = vec2(0.,1.)/size ;
    
    isTipt = texture(tipt, pixPos).a ;
    for(float i=-0.5*tiptThickness ; i<(tiptThickness*0.5) ; i++){
        for(float j=-0.5*tiptThickness ; j<(tiptThickness*0.5) ; j++){
            isTipt = max(isTipt, texture(tipt, pixPos + ii*i).a) ;
            isTipt = max(isTipt, texture(tipt, pixPos + jj*j).a) ;
            isTipt = max(isTipt, texture(tipt, pixPos + ii*i + jj*j).a) ;
        }
    }

    r = dot(t, channelMultiplier) ;
    r = (r-minValue)/(maxValue-minValue) ;


    vec4 pixColor   = texture(  clrm, vec2(r,0.5)   ) ;

    if ( enableMinColor ) if (r < 0.) pixColor = minColor ;
    if ( enableMaxColor ) if (r >1.) pixColor = maxColor ;

    vec4 probColor  = texture(  prob, pixPos        )  ;
    FragColor    = mix(mix(pixColor, vec4(tiptColor,1.0),isTipt), probColor, probColor.a) ;
}
