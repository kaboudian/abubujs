var DefaultVertexShader = { value : `#version 300 es
/*========================================================================
 * vertShader   :  Default Vertex Shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:07:21 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface variables
 *========================================================================
 */
in  vec3 position;

out vec2 pixPos ;
out vec2 pixelPosition ;
out vec2 cc ;

out vec3 pixCrd ;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{   
    cc = position.xy ;
    pixPos = position.xy ;
    pixelPosition = pixPos ;
    pixCrd = position.xyz ;
    gl_Position = vec4(position.xy*2.-vec2(1.),0.,1.0);
}` } ;



var bgndShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * bgndShader   :   COLOR BACGROUNDS
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:01 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*-------------------------------------------------------------------------
 * Varying variables
 *-------------------------------------------------------------------------
 */
in vec2        pixPos ;
uniform sampler2D   bgrnd ;
uniform vec3        color ;
out vec4 FragColor ;

/*=========================================================================
 * Main body
 *=========================================================================
 */
void main()
{    
    vec4    crvc = texture(bgrnd, pixPos ) ;

    FragColor = mix(vec4(color,1.0),crvc, crvc.a ) ;
}` } ;



var dispBackgroundPhasShader = { value : `#version 300 es
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
}` } ;



var dispPhasShader = { value : `#version 300 es
/*========================================================================
 * dispPhasShader 
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
    }
}` } ;



var dispShader = { value : `#version 300 es
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
}` } ;



var filamentShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * filamentShader:  calculating  the filament
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Fri 15 Jun 2018 16:54:56 (EDT) 
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;

/*------------------------------------------------------------------------
 * Interface variables
 *------------------------------------------------------------------------
 */
in vec2     pixPos ;

uniform sampler2D   inFtrgt, inStrgt ;
uniform sampler2D   crdtMap ;

uniform float       filamentThickness ;

uniform vec3        domainResolution ;
uniform float       mx, my ;
uniform float       filamentThreshold ;
uniform float       filamentBorder ;

layout (location = 0 ) out vec4 outTrgt ;

/*========================================================================
 * Texture3D
 *========================================================================
 */
vec4 Texture3D( sampler2D S, vec3 texCoord )
{
    vec4    vColor1, vColor2 ;
    float   x, y ;
    float   wd = mx*my - 1.0 ;

    float zSliceNo  = floor( texCoord.z*mx*my) ;

    x = texCoord.x / mx ;
    y = texCoord.y / my ;

    x += (mod(zSliceNo,mx)/mx) ;
    y += floor((wd-zSliceNo)/ mx )/my ;

    vColor1 = texture( S,  vec2(x,y) ) ;

    zSliceNo = ceil( texCoord.z*mx*my   ) ;

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

/*========================================================================
 * isFilament
 *========================================================================
 */
bool isFilament( sampler2D S1, sampler2D S2, vec3 pos, vec3 ii ){
    float s1 = 0. ;
    float s2 = 0. ;

    float f,v,d ;
    vec3 cc ;
    for (float i=0. ; i < 2. ; i++){
        for (float j=0. ; j<2. ;j++){
            for(float k=0. ; k<2. ; k++){
                cc=  pos + vec3(i,j,k)*ii ;
                v = Texture3D( S1, cc).r ;
                f = v - filamentThreshold ;
                d = v - Texture3D( S2, cc).r ;
                s1 += step(0.,f) ;
                s2 += step(0.,d) ;
            }
        }
    }

    bool b1 = ((s1>0.5) && (s1<7.5)) ;
    bool b2 = ((s2>0.5) && (s2<7.5)) ;

    return (b1 && b2) ;
}

/*========================================================================
 * main body of the filament shader
 *========================================================================
 */
void main(){ 
    bool s = false ;
    vec3 ii = vec3(1.)/domainResolution ;
    vec3 pos = texture( crdtMap, pixPos ).rgb ;

    float upperVal = 1.-filamentBorder ;
    float lowerVal = filamentBorder ;

    
    if (    pos.x<lowerVal ||   pos.x>upperVal || pos.y<lowerVal ||   
            pos.y>upperVal ||   pos.z<lowerVal || pos.z>upperVal    ){
        outTrgt = vec4(0.) ;
        return ;
    }

    for (float i=-filamentThickness ; i < 1. ; i++)
      for (float j=-filamentThickness ; j < 1. ; j++)
        for (float k=-filamentThickness ; k < 1. ; k++)
          s = s || isFilament( inFtrgt, inStrgt, pos+vec3(i,j,k)*ii, ii) ;

    outTrgt = (s) ? vec4(1.):vec4(0.) ;
}` } ;



var histShader = { value : `#version 300 es
/*========================================================================
 * histShader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:40 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
uniform vec2        probePosition ;
uniform sampler2D   surf ;
uniform sampler2D   curv ;
uniform float       shift ;
uniform vec4        channel ;

in      vec2        pixPos ;
layout (location = 0 ) out     vec4        FragColor ;
/*=========================================================================
 * Main body 
 *=========================================================================
 */
void main()
{
    float r ;
    vec4 probVal  = texture(surf , probePosition  ) ;
    vec4 pixlVal  = texture(curv , vec2(pixPos.x+shift, pixPos.y )) ;

    vec4 fragColor ;
    fragColor.a     = pixPos.x  ;
    fragColor.rgb   = pixlVal.rgb ;
    r =    dot( probVal,channel) ;
    
    if (pixPos.x >= (1. - shift)){
        fragColor.rgb = vec3(r,r,r) ;
    }

    FragColor = fragColor;
}` } ;



var ipltShader = { value : `#version 300 es
/*========================================================================
 * ipltShader   : Fragmet Shader for Initializing Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:50 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
in      vec2    pixPos ;
uniform float   restValue ;

layout (location = 0 ) out  vec4    FragColor1 ;
layout (location = 1 ) out  vec4    FragColor2 ;

/*=========================================================================
 * Main body of ipltShader
 *=========================================================================
 */
void main()
{
    float r = restValue ;
    FragColor1 = vec4(r,r,r,1.0) ;
    FragColor2 = vec4(r,r,r,1.0) ;
}` } ;



var lfgmShader = { value : `#version 300 es
/*========================================================================
 * lfgmShader   :  Fragmet Shader for Creating Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:02 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
in      vec2        pixPos ;
uniform vec3        color ;
uniform float       visible ;
out     vec4        FragColor ;

/*=========================================================================
 * Main body
 *=========================================================================
 */
void main()
{
    FragColor = vec4(color,1.0);
}` } ;



var lpvtShader = { value : `#version 300 es
/*========================================================================
 * lpvtShader   : Shader for Creating Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:21 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*-------------------------------------------------------------------------
 * Varying variables must be defined here
 *-------------------------------------------------------------------------
 */
out     vec2        pixPos ;
uniform sampler2D   map ;
uniform vec2        xrange ;
uniform vec2        yrange ;
uniform vec4        channelMultiplier ;

in      vec4        position;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{
    pixPos = position.xy ;   /* uv.x, uv.y is always in [0,1.0] */
    vec4 mapVal = texture(map, position.xy ) ;
    vec2 pos ;
    float   yval    = dot(mapVal, channelMultiplier) ;
    float   xval ;
    yval            = (yval-yrange.x)/(yrange.y - yrange.x) ;
    xval            = position.x*(xrange.y-xrange.x)+xrange.x ;
    gl_Position     = vec4(xval*2.-1., yval*2.-1.,0., 1.0) ;
    return ;
}` } ;



var lvtxShader = { value : `#version 300 es
/*========================================================================
 * lvtxShader   : Shader for Creating Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:21 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*-------------------------------------------------------------------------
 * Varying variables must be defined here
 *-------------------------------------------------------------------------
 */
out     vec2        pixPos ;
uniform sampler2D   map ;
uniform float       minValue ;
uniform float       maxValue ;
in      vec4        position;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{
    float  amp = maxValue-minValue ;
    pixPos = position.xy ;   /* uv.x, uv.y is always in [0,1.0] */
    vec4 point = texture(map, position.xy ) ;
    vec2 pos ;
    pos.x  = point.a ;
    pos.y  = (point.r-minValue)/amp ;
    //pos.x = position.x ;
    gl_Position = vec4(pos.x*2.-1., pos.y*2.-1.,0., 1.0) ;
}` } ;



var phaseDisplay = { value : `#version 300 es 
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * phaseDisplay.frag : displays the phase values on the screen
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Mon 09 Nov 2020 11:20:50 (EST)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float ;
precision highp int ;

in vec2 cc ;
uniform sampler2D   icolor ;

out vec4 ocolor ;

#define     u   color.r
#define     v   color.g
void main(){
    vec4 color = texture( icolor, cc ) ;

    if ( u > 0.5 ){
        ocolor = vec4( .8, 0.,0.,1. ) ;
        return ;
    }

    if ( v>0.5 ){
        ocolor = vec4(.378,0.639,0.851,1.) ;
        return ;
    }

    ocolor=vec4(0) ;
    //ocolor= vec4(vec3(0.99),1.) ;
    return ;
}` } ;



var phaseInit = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * phaseInit.frag : initial the phase textures for the PhasePlot
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Mon 09 Nov 2020 12:31:13 (EST)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float ;
precision highp int ;

layout (location = 0) out vec4 ocolor1 ;
layout (location = 1) out vec4 ocolor2 ;

void main(){
    ocolor1 = vec4(0.) ;
    ocolor2 = vec4(0.) ;
    return ;
}` } ;



var phaseUpdate = { value : `#version 300 es 
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
}` } ;



var sctwShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * sctwShader   :  scales the time window
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 02:07:45 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

in vec2     pixPos ;

uniform sampler2D   map ;
uniform float       oldWindow ;
uniform float       newWindow ;

layout (location =0 ) out vec4 FragColor ;

void main(){
    float   scale = newWindow/oldWindow ;
    float   x   = pixPos.x-(1.- 1./scale) ;
    x *= scale ;
    
    FragColor = texture( map, vec2(x,0.5)) ;
    return ;
}` } ;



var tiptInitShader = { value : `#version 300 es

/*========================================================================
 * tiptInitShader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:52 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
in      vec2    pixPos ;
layout (location=0) out     vec4    ftipt ;
layout (location=1) out     vec4    stipt ;
/*=========================================================================
 * main
 *=========================================================================
 */
void main(){
    ftipt = vec4(0.,0.,0.,0.) ;
    stipt = vec4(0.,0.,0.,0.) ;
    return ;
}` } ;



var tiptShader = { value : `#version 300 es
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
}` } ;



var tstpShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * tstpShader   :   time step shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 26 Sep 2018 18:42:01 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;

uniform float       timeWindow, dt;
uniform sampler2D   inTtex ;

layout (location = 0 ) out vec4 outTtex ;

void main(){
    float t = texture( inTtex, vec2(0.5)).r ;
    t += dt ;
    if ( t>timeWindow ){
        t = 0. ;
    }
    outTtex = vec4(t) ;

    return ;
}` } ;



var tvsxShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * tvsxShader   :   create a time vs x graph
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 26 Sep 2018 18:05:11 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;

in vec2             pixPos ;

uniform sampler2D   inText, inTvsx , ttex ;
uniform vec4        rgba0 ;
uniform float       timeWindow ;
uniform float       yLevel ;
layout  (location = 0) out vec4 outTvsx ;
uniform bool        refresh ;

void main(){
    outTvsx = texture( inTvsx , pixPos ) ;
    float   t       = texture( ttex, vec2(0.5) ).r/timeWindow ;
    float   dt      = 1./vec2(textureSize( inTvsx, 0 )).x ;
    
    if (abs(t-pixPos.y)<= dt ){
        outTvsx = texture(inText, vec2(pixPos.x,yLevel)) ;
    }
    if (t<dt && refresh){
        outTvsx = rgba0 ;
    }
    return ;
}` } ;



var vertShader = { value : `#version 300 es
/*========================================================================
 * vertShader   :  Default Vertex Shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:07:21 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface variables
 *========================================================================
 */
in  vec3 position;

out vec2 pixPos ;
out vec3 pixCrd ;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{   
    pixPos = position.xy ;
    pixCrd = position.xyz ;
    gl_Position = vec4(position.x*2.-1., position.y*2.-1.,0.,1.0);
}` } ;



var vrc1FShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrc1FShader  :   First Pass of Volume Ray Casting
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Sat 12 Aug 2017 06:24:26 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*------------------------------------------------------------------------
 * Interface Vars.
 *------------------------------------------------------------------------
 */
in vec3 worldSpaceCoords;

out vec4 back_face_Crds ;
/*========================================================================
 * Main
 *========================================================================
 */
void main()
{
    // Sets the fragment color as the fragment coordinates.
    back_face_Crds = vec4(   worldSpaceCoords, 1.0   ) ;
}` } ;



var vrc1VShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrc1VShader  :   1st Pass Vertex Shader of Volume-Ray-Casting
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Sat 12 Aug 2017 06:24:44 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;


/*------------------------------------------------------------------------
 * Interface vars.
 *------------------------------------------------------------------------
 */
in  vec3        position ;
out vec3        worldSpaceCoords;


uniform mat4 viewMatrix ;
uniform mat4 modelMatrix ;
uniform mat4 projectionMatrix ;

/*========================================================================
 * Main
 *========================================================================
 */
void main()
{
    //Set the world space coordinates of the back faces vertices as output.
    worldSpaceCoords = position ; 
    gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4( position, 1.0 );
}` } ;



var vrc2FShader = { value : `#version 300 es
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
}` } ;



var vrc2VShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrc2VShader  :   2nd Pass Vertex Shader for Volume-Ray-Casting
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Sat 12 Aug 2017 06:25:12 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*------------------------------------------------------------------------
 * Interface vars.
 *------------------------------------------------------------------------
 */
in      vec3        position ;

out     vec3        worldSpaceCoords ;
out     vec4        projectedCoords ;

uniform mat4        viewMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        projectionMatrix ;

/*========================================================================
 * Main
 *========================================================================
 */
void main()
{
    worldSpaceCoords    =   position ; 
    
    projectedCoords     =   projectionMatrix 
                        *   viewMatrix
                        *   modelMatrix 
                        *   vec4( position, 1.0 ) ;

    gl_Position = projectedCoords ;
}` } ;



var vrcClickCrdShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcClickCrdShader   :   shades the click coordinate
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 24 Aug 2017 11:49:46 AM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*========================================================================
 * interface variables
 *========================================================================
 */
uniform sampler2D   projectedCrds ;
uniform vec2        clickPosition ;
layout (location=0) out vec4 clickCoordinates ;

/*========================================================================
 * main body
 *========================================================================
 */
void main(){
    clickCoordinates = texture( projectedCrds , clickPosition ) ;
}` } ;



var vrcClickVoxelCrdShader = { value : `#version 300 es
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
}` } ;



var vrcCrdShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcCrdShader :   calculates the coordinate of each point in 3d
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Mon 14 Aug 2017 10:35:08 AM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*------------------------------------------------------------------------
 * Interface Vars.
 *------------------------------------------------------------------------
 */
in      vec2        pixPos ;
uniform float       mx, my ;

/*------------------------------------------------------------------------
 * Output
 *------------------------------------------------------------------------
 */
layout (location = 0 ) out vec4  crd ;

/*========================================================================
 * main body 
 *========================================================================
 */
void main(){
    crd = vec4(1.0) ;

    crd.x = (pixPos.x - floor(pixPos.x * mx)/mx ) * mx ;
    crd.y = (pixPos.y - floor(pixPos.y * my)/my ) * my ;

    float sliceNo = floor(pixPos.x * mx) 
                +   ( ( my-1.0) - floor(pixPos.y * my) )*mx ;
    crd.z = sliceNo/(mx*my) ;
}` } ;



var vrcFrmShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcFrmShader :   colors an object to a particular color
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 14 Jun 2018 15:08:10 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;

/*------------------------------------------------------------------------
 * Interface variables
 *------------------------------------------------------------------------
 */
uniform vec4    frameColor ;

/*------------------------------------------------------------------------
 * output of the shader
 *------------------------------------------------------------------------
 */
out vec4    FragColor ;

/*========================================================================
 * main body of shader
 *========================================================================
 */
void main(){
    FragColor = frameColor ;
    return ;
}` } ;



var vrcLgtShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcLgtShader :   shading the light on the structure
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Mon 14 Aug 2017 11:01:43 AM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*------------------------------------------------------------------------
 * interface vars.
 *------------------------------------------------------------------------
 */
const   int         MAX_NO = 100 ;
in      vec2        pixPos ;

uniform sampler2D   phaseTxt ;
uniform sampler2D   crdtTxt ;
uniform sampler2D   target  ;
uniform bool        usePhaseField ;

uniform float       mx, my ;

uniform vec3        dfls[ MAX_NO ] ;        /* directional flood lights */
uniform int         noDfls ;                /* number of D.F.L's        */
uniform vec3        ptls[ MAX_NO ] ;        /* point lights             */
uniform int         noPtls ;                /* number of P.L's          */

uniform float       threshold , minValue, maxValue;
uniform vec4        channelMultiplier ;
uniform float       alphaCorrection ;
uniform float       structural_alpha ;

uniform float       lightShift ;
/*------------------------------------------------------------------------
 * output
 *------------------------------------------------------------------------
 */
layout (location = 0) out vec4 light ;

/*=========================================================================
 * Acts like a texture3D using Z slices and trilinear filtering
 *=========================================================================
 */
vec4 Texture3D( sampler2D S, vec3 texCoord )
{
    vec4    vColor ;
    float x, y ;
    float wd = mx*my - 1.0 ;

    float zSliceNo  = floor( texCoord.z*mx*my) ;

    x = texCoord.x / mx ;
    y = texCoord.y / my ;

    x += (mod(zSliceNo,mx)/mx) ;
    y += floor((wd-zSliceNo)/ mx )/my ;

    vColor = texture( S,  vec2(x,y) ) ;
    return vColor ;
}

/*========================================================================
 * floodLightCast
 *========================================================================
 */
vec4 floodLightIntensity( vec3 DFL, vec3 pp, sampler2D S ){
    vec4    tc ;
    float   tv ;
    float   aa ;
    float   a ;
    float   tr ;
    vec3 ld = DFL ;
    ld = ld/length(ld) ;

    vec3 dl = ld/200. ;
    vec3 lcp = pp + ld  ;
    aa = 0. ;
    for( int i=0; i < 100 ; i++){
        tc = Texture3D( S, lcp ) ;
        tv = dot( tc , channelMultiplier ) ;
        if (tv >threshold ){
            a = (tv-minValue)/
                (maxValue-minValue) ;
            aa += a * alphaCorrection  ;
        }
        lcp -= dl ;
        if ( aa >= 1.0 ){
            aa = 1.0 ;
            break ;
        }
    }
    return vec4(1.-aa) ;
}

/*========================================================================
 * pointLightIntensity
 *========================================================================
 */ 
vec4 pointLightIntensity( vec3 PTL, vec3 pp, sampler2D S){
    vec4    tc ;
    float   tv ;
    float   aa ;
    float   a ;
    float   tr ;
    vec3 ld = PTL-pp ;
    ld = ld/length(ld) ;

    vec3 dl = ld/120. ;
    vec3 lcp = pp ;
    aa = 0. ;
    tr = alphaCorrection ;
    for( int i=0; i < 120 ; i++){
        tc = Texture3D( S, lcp ) ;
        tv = dot( tc , channelMultiplier ) ;
        if ( tv > threshold ){
            a = (tv-minValue)/
                (maxValue-minValue) ;
        
            aa += a * tr ;
        }
        lcp += dl ;
        if ( aa >= 1.0 ){
            aa = 1.0 ;
            break ;
        }
    }
    return vec4(1.-aa) ;
}


/*========================================================================
 * floodLightCast
 *========================================================================
 */
vec4 floodLightIntensityBasedOnPhase( vec3 DFL, vec3 pp, sampler2D S ){
    vec4    tc ;
    float   tv ;
    float   aa ;
    float   a ;
    float   tr ;
    vec3 ld = DFL ;
    ld = ld/length(ld) ;

    vec3 dl = ld/20. ;
    vec3 lcp = pp + ld  ;
    aa = 0. ;
    for( int i=0; i < 100 ; i++){
        tv = Texture3D( S, lcp ).r ;
        if (tv > 0. ){
            aa += tv * alphaCorrection * structural_alpha ;
            lcp -= dl ;
        }
        if ( aa >= 1.0 ){
            aa = 1.0 ;
            break ;
        }
    }
    return vec4(1.-aa) ;
}

/*========================================================================
 * pointLightIntensityBasedOnPhase
 *========================================================================
 */ 
vec4 pointLightIntensityBasedOnPhase( vec3 PTL, vec3 pp, sampler2D S){
    vec4    tc ; 
    float   aa ;
    float   tr ;
    vec3 ld = PTL-pp ;
    ld = ld/length(ld) ;

    vec3 dl = ld/120. ;
    vec3 lcp = pp ;
    aa = 0. ;
    tr = alphaCorrection * structural_alpha ;
    for( int i=0; i < 120 ; i++){
        tc = Texture3D( S, lcp ) ;
        aa += tc.r * tr ;
        lcp += dl ;
        if ( aa >= 1.0 ){
            aa = 1.0 ;
            break ;
        }
    }
    return vec4(1.-aa) ;
}

/*========================================================================
 * main body
 *========================================================================
 */
void main(){
    light = vec4(0.) ;
    vec3 crd = texture( crdtTxt, pixPos ).rgb ;

    if ( usePhaseField){
        for (int i=0 ; i < noDfls; i++){
            light += floodLightIntensityBasedOnPhase
                ( dfls[i], crd, phaseTxt ) ;
        }
        for (int i=0 ; i < noPtls; i++){
            light += pointLightIntensityBasedOnPhase
                ( ptls[i], crd, phaseTxt ) ;
        }
    }else{
        for (int i=0 ; i < noDfls; i++){
            light += floodLightIntensity( dfls[i], crd, target ) ;
        }
        for (int i=0 ; i < noPtls; i++){
            light += pointLightIntensity
                ( ptls[i], crd, target ) ;
        }

    }

    light = light/float(noDfls + noPtls);

    light = (light+lightShift)/(1.+lightShift) ;
}` } ;



var vrcPCShader = { value : `#version 300 es
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
}` } ;



var wA2bShader = { value : `#version 300 es

/*========================================================================
 * wA2bShader   :  BUFFER SWAP FRAGMENT SHADER  
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:07:29 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
uniform sampler2D   map ;
in      vec2        pixPos ;
layout (location = 0 ) out     vec4        FragColor ;
/*=========================================================================
 * Main body of Buffer Swap Shader 
 *=========================================================================
 */
void main()
{
    FragColor = texture(map,pixPos) ;
}` } ;



