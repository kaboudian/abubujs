/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * DefaultVertexShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vertShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * wA2bShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * lfgmShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var lfgmShader = { value : `#version 300 es
/*========================================================================
 * lfgmShader   :   Fragmet Shader for Creating Line/Curve Plots
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
uniform vec3        color ;
uniform float       visible ;
out     vec4        FragColor ;

/*=========================================================================
 * Main body
 *=========================================================================
 */
void main()
{
    FragColor = vec4(color,visible);
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * lpvtShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var lpvtShader = { value : `#version 300 es
/*========================================================================
 * lpvtShader   :   Vertex Shader for Creating Line/Curve Plots
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * lvtxShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var lvtxShader = { value : `#version 300 es
/*========================================================================
 * lvtxShader   :   Shader for Creating Triangulated Signal Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Tue 04 May 2021 21:08:42 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; 
precision highp int;

uniform sampler2D   map ;
uniform float       minValue ;
uniform float       maxValue ;
uniform vec2        linewidth ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
    /* calculating normal direction */
    vec2 n1 , n2 ;  /* normal direction at left and right side of 
                       the line segment */
    
    ivec2 size = textureSize(map, 0) ;

    int vertexID   = gl_VertexID % 4 ;
    int instanceID = gl_VertexID /4 ;

    vec2 p[4] ;
    vec4 t ;
    for( int i=0 ; i<4 ; i++){
        t = texelFetch( map, ivec2( instanceID-1+i, 0 ),0) ;
        p[i].x = t.a*2.-1.  ;
        p[i].y = 2.*(t.r-minValue)/(maxValue-minValue) -1. ;
    }
        
    n1 = vec2( 0.,1.) ;
    n2 = vec2( 0.,1.) ;

    if ( instanceID > 0 ){
        n1 = p[2]-p[0] ;
        n1 = vec2(-n1.y,n1.x) ;
        n2 = n1 ;
    }
    if ( instanceID < (size.x-2 ) ){
        n2 = p[3] - p[1] ;
        n2 = vec2(-n2.y,n2.x ) ;

        if( instanceID == 0 ){
            n1=n2 ;
        }
    }

    n1 = normalize(n1) ;
    n2 = normalize(n2) ;

    vec2 vertCrds[4] ;
    vertCrds[0] = p[1] + n1*linewidth ;
    vertCrds[1] = p[1] - n1*linewidth ;
    vertCrds[2] = p[2] + n2*linewidth ;
    vertCrds[3] = p[2] - n2*linewidth ;

    gl_Position = vec4(vertCrds[ vertexID ] , 0., 1.);
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * histShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * sctwShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * ipltShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * phaseInit
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * phaseUpdate
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * phaseDisplay
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * bgndShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * tiptInitShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * tiptShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * dispPhasShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * dispBackgroundPhasShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * dispShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * tvsxShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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
uniform vec4        defaultVal ;
uniform float       timeWindow ;
uniform float       yLevel ;
uniform bool        refresh ;

layout  (location = 0) out vec4 outTvsx ;

void main(){
    outTvsx = texture( inTvsx , pixPos ) ;
    float   t       = texture( ttex, vec2(0.5) ).r/timeWindow ;
    float   dt      = 1./vec2(textureSize( inTvsx, 0 )).x ;
    
    if (abs(t-pixPos.y)<= dt ){
        outTvsx = texture(inText, vec2(pixPos.x,yLevel)) ;
    }
    if (t<dt && refresh){
        outTvsx = defaultVal ;
    }
    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * tstpShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrc1FShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrc1VShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrc2FShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrc2VShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrcClickCrdShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrcClickVoxelCrdShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrcCrdShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrcFrmShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrcLgtShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vrcPCShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * filamentShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
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

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * compressedCoordinator
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var compressedCoordinator = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * compressedCoordinator : calculate the 3d coordinate on the compressed
 * structure.
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Sat 06 Mar 2021 18:15:05 (EST)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


/*------------------------------------------------------------------------
 * interface variables
 *------------------------------------------------------------------------
 */
in vec2 cc ;
uniform sampler2D   full3dCrdt ;
uniform usampler2D  fullTexelIndex ;

layout (location=0) out vec4 compressed3dCrdt ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main(){
    // calculate the current texels position
    ivec2 texelPos = ivec2(cc*vec2(textureSize( fullTexelIndex, 0 ))) ;

    // index of the current texel in the full domain
    ivec4 fullTexelIndex = ivec4(
        texelFetch( fullTexelIndex, texelPos, 0)
    ) ;

    if ( fullTexelIndex.a == 1){
        // extract the coorinate of the point from the full3dCrdt 
        compressed3dCrdt = texelFetch( full3dCrdt, fullTexelIndex.xy, 0 ) ;
        return ;
    }else{
        // value for extra-no domain points
        compressed3dCrdt = vec4(-1.) ;
        return ;
    }
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fullCoordinator
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fullCoordinator = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * crdtShader   :   calculates the coordinate of each point in 3d
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Mon 14 Aug 2017 10:35:08 AM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


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
layout (location = 0 ) out vec4  crdt ;

/*========================================================================
 * main body 
 *========================================================================
 */
void main(){
    crdt = vec4(1.0) ;

    crdt.x = (pixPos.x - floor(pixPos.x * mx)/mx ) * mx ;
    crdt.y = (pixPos.y - floor(pixPos.y * my)/my ) * my ;

    float sliceNo = floor(pixPos.x * mx) 
                +   ( ( my-1.0) - floor(pixPos.y * my) )*mx ;

    crdt.z = sliceNo/(mx*my) ;
    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * normals
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var normals = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * normals.frag : calculate the direction of outward normal to the full
 * structure
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Wed 31 Mar 2021 12:44:17 (EDT)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


in vec2 cc ;
uniform usampler2D fullTexelIndex, compressedTexelIndex ;
uniform int mx, my ;

layout (location = 0) out vec4 normals ;

/*========================================================================
 * getIJ: return the IJ index on the full 2d-matrix
 *========================================================================
 */
ivec2 getIJ(ivec3 idx, ivec3 size){
    int si = idx.z % mx ;
    int sj = idx.z / mx ;

    return ivec2(size.x*si + idx.x, (my-1-sj)*size.y + idx.y) ;
}

/*========================================================================
 * getIdx: get the 3d index from the IJ indices
 *========================================================================
 */
ivec3 getIdx( ivec2 IJ, ivec3 size ){
    int si = IJ.x / size.x ;
    int sj = (my - 1) - (IJ.y/size.y) ;

    return ivec3( IJ.x % size.x, IJ.y % size.y , mx*sj + si ) ;
}

/*========================================================================
 * macros 
 *========================================================================
 */
#define isInBounds( v )     (all(greaterThanEqual(v,ivec3(0))) && \
        all(lessThan(v,size)))

#define texelInDomain(I)  ( texelFetch(compressedTexelIndex,(I),\
            0).a==uint(1) )
#define inDomain( v )   (texelInDomain( getIJ(v, size) )) 
#define isNotGood(v)   (!( inDomain(v) && isInBounds( v ) ))

// the flipped direction of U ensures that the normal points out of the
// domain
#define getU(v)         (isNotGood(v) ? 1. : 0.) 

#define firstDerivative(C,D)   (getU((C)+(D))-getU((C)-(D)))  


/*========================================================================
 * main
 *========================================================================
 */
void main(){
    // get the sizes of the compressed and the full domain ...............
    ivec2 compSize = textureSize(fullTexelIndex,        0 ) ;
    ivec2 fullSize = textureSize(compressedTexelIndex,  0 ) ;

    // calculate the resolution of the full domain .......................
    ivec3 size = ivec3( fullSize.x/mx , fullSize.y/my, mx*my ) ;

    // get the textel position and full texel index ......................
    ivec2 texelPos = ivec2( cc*vec2(compSize) ) ; 
    ivec4 fullTexelIndex = 
        ivec4( texelFetch(  fullTexelIndex, texelPos, 0) ) ;

    // if the texel is extra, just leave .................................
    if ( fullTexelIndex.a != 1 ){
        normals = vec4(0.,0.,0.,-1.) ;
        return ;
    }

    // 3-dimentional index of the of texel ...............................
    ivec3 cidx = getIdx( fullTexelIndex.xy , size ) ;

    // directional vectors ...............................................
    ivec3 ii  = ivec3(1,0,0) ;
    ivec3 jj  = ivec3(0,1,0) ;
    ivec3 kk  = ivec3(0,0,1) ;

    // secondary directions ..............................................
    ivec3 sij = jj+kk ;     ivec3 sik = kk-jj ;
    ivec3 sji = ii+kk ;     ivec3 sjk = kk-ii ;
    ivec3 ski = ii+jj ;     ivec3 skj = jj-ii ;

    float dii = firstDerivative(cidx, ii  ) ;
    float djj = firstDerivative(cidx, jj  ) ;
    float dkk = firstDerivative(cidx, kk  ) ;
    float dij = firstDerivative(cidx, sij ) ;
    float dik = firstDerivative(cidx, sik ) ;
    float dji = firstDerivative(cidx, sji ) ;
    float djk = firstDerivative(cidx, sjk ) ;
    float dki = firstDerivative(cidx, ski ) ;
    float dkj = firstDerivative(cidx, skj ) ;

    float omega = 0.586 ;
    
    #define f(a)    vec3(a)

    vec3 normDir = (2.*omega+1.)*(f(ii)*dii + f(jj)*djj + f(kk)*dkk) 
        + (1.-omega)*(  f(sij)*dij + f(sik)*dik 
                    +   f(sji)*dji + f(sjk)*djk
                    +   f(ski)*dki + f(skj)*dkj )/sqrt(2.) ;
    

    normals  = vec4( normalize(normDir), 1.) ;
    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vsurfaceView
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var vsurfaceView = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vsurfaceView.vert : vertex shader used in the surface visualizer
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Fri 03 Sep 2021 17:33:09 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


/*------------------------------------------------------------------------
 * interface variables
 *------------------------------------------------------------------------
 */
in vec2             indices ;
uniform sampler2D   icolor ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform float       minValue ;
uniform float       maxValue ;
uniform vec4        channelMultiplier ;
uniform sampler2D   colormap ;
uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;
uniform usampler2D  compressedTexelIndex ;

uniform float       shininess;
uniform vec4        lightColor;
uniform float       lightAmbientTerm;
uniform float       lightSpecularTerm;
uniform vec3        lightDirection;

uniform float       materialAmbientTerm;
uniform float       materialSpecularTerm;

/*------------------------------------------------------------------------
 * macros 
 *------------------------------------------------------------------------
 */
#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*------------------------------------------------------------------------
 * outputs to the fragment shader 
 *------------------------------------------------------------------------
 */
out vec3 N ;
out vec3 E ;
out vec4 color ;
out vec3 position ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
    ivec2 uncompSize = textureSize( compressedTexelIndex, 0 ) ;
    ivec2 voxelIndex = 
        ivec2(texelFetch(compressedTexelIndex, ivec2(indices), 0).xy) ;
    
    position = texelFetch(compressed3dCrdt , voxelIndex, 0 ).xyz ;
    
    vec3 pos = (position - vec3(0.5))*2. ; 
    color = texelFetch(  icolor, voxelIndex, 0 ) ; 

/*------------------------------------------------------------------------
 * Lighting and coloring
 *------------------------------------------------------------------------
 */
    // normal direction ..................................................
    N = normalize( 
            vec3( normalMatrix*texelFetch( normals, voxelIndex, 0 )  )) ;
    
    // eye vector ........................................................
    E = normalize(-(viewMatrix*modelMatrix*vec4(pos,1.)).xyz) ;

    
    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fsurfaceView
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fsurfaceView = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * fsurfaceView.frag : fragment shader for surface visualization
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Fri 03 Sep 2021 17:37:47 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


/*------------------------------------------------------------------------
 * interfacial variables
 *------------------------------------------------------------------------
 */
uniform sampler2D icolor ;

uniform float       minValue ;
uniform float       maxValue ;
uniform vec4        channelMultiplier ;
uniform sampler2D   colormap ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;
uniform usampler2D  compressedTexelIndex ;

uniform float       shininess;
uniform vec4        lightColor;
uniform float       lightAmbientTerm;
uniform float       lightSpecularTerm;
uniform vec3        lightDirection;
uniform vec4        lightAmbientColor ;

uniform vec4        materialColor ;
uniform float       materialAmbientTerm;
uniform float       materialSpecularTerm;

/*------------------------------------------------------------------------
 * input from the vertex shader
 *------------------------------------------------------------------------
 */
in vec3 position ;
in vec4 color ;
in vec3 N ;
in vec3 E ;

/*------------------------------------------------------------------------
 * macros 
 *------------------------------------------------------------------------
 */
#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*------------------------------------------------------------------------
 * output of the shader
 *------------------------------------------------------------------------
 */
layout (location = 0 ) out vec4 projectedColors ;
layout (location = 1 ) out vec4 projectedCoordinates ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {

    float val =
        (dot(color,channelMultiplier)-minValue)/(maxValue-minValue) ;
   
    vec4 mcolor = val > 0. ? texture(colormap , vec2(val,0.5) ) :
        materialColor ;
   // vec4 materialColor = color.r < 0.1 ? 
   //     vec4(vec3(0.95),1.) : vec4(0.,color.r,0.1,1.) ;

    // light direction ...................................................
    vec3 L = normalize(lightDirection) ;

    // reflection direction ..............................................
    vec3 R = reflect(L,N) ;
    float lambertTerm = dot(N,-L) ;

    // AmbientTerm .......................................................
    vec4 Ia = v4(lightAmbientTerm) * v4(materialAmbientTerm);

    // Diffuse ...........................................................
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);

    // SpecularTerm ......................................................
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    // calculating final color ...........................................
    if (lambertTerm > 0.0) {
      Id = lightColor * mcolor * lambertTerm;
      float specular = pow( max(dot(R, E), 0.0), shininess);
      Is = v4(lightSpecularTerm) *v4(materialSpecularTerm) 
          * specular ;
    }

    // Final fargment color takes into account all light values that
    // were computed within the fragment shader
    projectedColors         = vec4( vec3(Ia + Id + Is), 1.0     ) ;

    // position of the projected voxel used in picking the click positions
    projectedCoordinates    = vec4( position ,          1.0     ) ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fsurfaceViewBlend
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fsurfaceViewBlend = { value : `#version 300 es

precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


in vec2 cc ;

uniform sampler2D  projectedColors ;

out vec4 color ;

void main(){
    color = texture( projectedColors , cc ) ;
    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fsurfaceViewCompressedClickPosition
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fsurfaceViewCompressedClickPosition = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * fsurfaceViewComrpessedClickPosition.frag:
 *      This shader is designed to determine the position of the click on 
 *      a compressed data structure. This is useful for picking signals
 *      from a particular point on the data structure.
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Fri 03 Sep 2021 19:59:37 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


/*------------------------------------------------------------------------
 * Interfacial Variables
 *------------------------------------------------------------------------
 */
uniform vec2        clickPosition ;
uniform sampler2D   projectedCoordinates ;
uniform usampler2D  compressedTexelIndex ;
uniform int         mx , my ;
uniform float       cwidth, cheight ;

/*------------------------------------------------------------------------
 * output colors
 *------------------------------------------------------------------------
 */
layout (location =0 ) out vec4 compressedClickPosition ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main(){
    // Read the coordinate of the click in the model 3D space ............
    vec3 crdt = texture( projectedCoordinates, clickPosition ).xyz ;

    // What is the size of the non-compressed texture ....................
    ivec2 fullSize = ivec2(textureSize( compressedTexelIndex, 0).xy) ;

    // resoltion of the 3D domain ........................................
    int  width = fullSize.x/mx ;
    int  height= fullSize.y/my ;
    int  depth = mx*my ;

    // figure out the index of the voxel that was picked in the three
    // dimensional space .................................................
    int i = int(floor(crdt.x*float(width  ))) ;
    int j = int(floor(crdt.y*float(height ))) ;
    int k = int(floor(crdt.z*float(depth  ))) ;

    // figure out the index of the corresponding pixel on the uncompressed
    // data structure ....................................................
    int si = k%mx ;
    int sj = k/mx ;

    int I = width*si+i ;
    int J = (my-1-sj)*height + j ;

    // determine the index of the voxel in the compressed data structure .
    uvec2 voxelCompressedIndex = texelFetch(compressedTexelIndex,
            ivec2(I,J) , 0 ).xy ;

    // determine the floating point pixel coordinate of the click point in
    // the compressed data structure .....................................
    compressedClickPosition = 
        vec4(voxelCompressedIndex.x,voxelCompressedIndex.y,0,0)/
        vec4(cwidth,cheight,cwidth,cheight) ;

    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * cvertex
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var cvertex = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * 
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Wed 31 Mar 2021 19:06:52 (EDT)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


uniform float       voxelSize ;
uniform int         noVoxels ;

uniform sampler2D   icolor ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;

uniform float       shininess;
uniform vec4        lightColor;
uniform float       lightAmbientTerm;
uniform float       lightSpecularTerm;
uniform vec3        lightDirection;

uniform float       materialAmbientTerm;
uniform float       materialSpecularTerm;

out vec4            ocolor ;

out float           shade ;

#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
    vec3 vertCrds[36] ;
int indx = 0 ;
vec3 vertCrds[36] ;

/* ~~~~~~~~~~~~~~~~ */
/* Front PLANE      */
/* ~~~~~~~~~~~~~~~~ */
// 1F
vertCrds[indx++] = vec3(0,0,1) ;  // 1
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,1,1) ;  // 4

// 2F
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,1,1) ;  // 3

/* ~~~~~~~~~~~~~~~~ */
/* RIGHT PLANE      */
/* ~~~~~~~~~~~~~~~~ */
// 3R
vertCrds[indx++] = vec3(1,1,1) ;  // 3
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,1,0) ;  // 7

// 4R
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,0,0) ;  // 5

/* ~~~~~~~~~~~~~~~~ */
/* BOTTOM PLANE     */
/* ~~~~~~~~~~~~~~~~ */
// 5B
vertCrds[indx++] = vec3(1,0,0) ;  // 5
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 6B
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,0,1) ;  // 1

/* ~~~~~~~~~~~~~~~~ */
/* LEFT PLANE       */
/* ~~~~~~~~~~~~~~~~ */
// 7L
vertCrds[indx++] = vec3(0,0,1) ;  // 1
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 8L
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(0,1,0) ;  // 8

/* ~~~~~~~~~~~~~~~~ */
/* TOP PLANE        */
/* ~~~~~~~~~~~~~~~~ */
// 9T
vertCrds[indx++] = vec3(0,1,0) ;  // 8
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(1,1,1) ;  // 3

// 10T
vertCrds[indx++] = vec3(1,1,1) ;  // 3
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(0,1,0) ;  // 8

/* ~~~~~~~~~~~~~~~~ */
/* BACK PLANE       */
/* ~~~~~~~~~~~~~~~~ */
// 11B
vertCrds[indx++] = vec3(0,1,0) ;  // 8
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 12B
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(1,0,0) ;  // 5 



    int  vertId  = gl_VertexID % 36  ; 
    int  voxelId = gl_VertexID / 36 ;

    //shade = 1.0 ;

    ivec2 isize = textureSize(compressed3dCrdt,        0 ) ;
    ivec2 voxelIndex = ivec2( voxelId % isize.x , voxelId / isize.x ) ;
    
    vec4 pos4 = texelFetch(compressed3dCrdt, voxelIndex, 0 ) ;

    shade =  (pos4.a > 0.5) ? 1. : 0. ;

    vec3 pos =  (pos4.xyz - vec3(0.5))*2. ; 
    pos += voxelSize*0.005*2.*(vertCrds[vertId]-vec3(0.5)) ; 

    vec4  color   = texelFetch(  icolor, voxelIndex, 0 ) ; 
   
    vec4 materialColor = color.r < 0.1 ? 
        vec4(vec3(0.8),1.) : vec4(0.,color.r,0.1,1.) ;

    materialColor = mix(vec4(0.,0.,1.0,1.),vec4(1.,1.,0.,1.), color.r) ;

    if (color.r < 0.1){
         shade = shade*0. ;
    }
/*------------------------------------------------------------------------
 * Lighting and coloring
 *------------------------------------------------------------------------
 */
    // normal direction ..................................................
    vec3 N = normalize( 
            vec3( normalMatrix*texelFetch( normals, voxelIndex, 0 )  )) ;
    
    // eye vector ........................................................
    vec3 E = normalize(-(viewMatrix*modelMatrix*vec4(pos,1.)).xyz) ;

    // light direction ...................................................
    vec3 L = normalize(lightDirection) ;

    // reflection direction ..............................................
    vec3 R = reflect(L,N) ;
    float lambertTerm = dot(N,-L) ;

    // AmbientTerm .......................................................
    vec4 Ia = v4(lightAmbientTerm) * v4(materialAmbientTerm);

    // Diffuse ...........................................................
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);

    // SpecularTerm ......................................................
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    // calculating final color ...........................................
    if (lambertTerm > 0.0) {
      Id = lightColor * materialColor * lambertTerm;
      float specular = pow( max(dot(R, E), 0.0), shininess);
      Is = v4(lightSpecularTerm) *v4(materialSpecularTerm) 
          * specular ;
    }

    // Final fargment color takes into account all light values that
    // were computed within the fragment shader
    ocolor = vec4(vec3(Ia + Id + Is), 1.0);

    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * cfrag
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var cfrag = { value : `#version 300 es
precision highp float;
precision highp int ;

in float red ;
out vec4 outColor;

in float shade ;
in vec4 ocolor ;
void main() {

    if (shade <0.5){
       discard ;
    }
    outColor = ocolor ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * wavefrontNormal
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var wavefrontNormal = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * wavefrontNormal.frag     :    calculate wave front normals
 * 
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Mon 13 Sep 2021 10:29:12 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


in vec2 cc ;

uniform sampler2D   icolor ;
uniform sampler2D   inormals ;
uniform usampler2D  fullTexelIndex, compressedTexelIndex ;
uniform int         mx, my ;

out vec4 onormals ;

/*========================================================================
 * getIJ: return the IJ index on the full 2d-matrix
 *========================================================================
 */
ivec2 getIJ(ivec3 idx, ivec3 size){
    int si = idx.z % mx ;
    int sj = idx.z / mx ;

    return ivec2(size.x*si + idx.x, (my-1-sj)*size.y + idx.y) ;
}

/*========================================================================
 * getIdx: get the 3d index from the IJ indices
 *========================================================================
 */
ivec3 getIdx( ivec2 IJ, ivec3 size ){
    int si = IJ.x / size.x ;
    int sj = (my - 1) - (IJ.y/size.y) ;

    return ivec3( IJ.x % size.x, IJ.y % size.y , mx*sj + si ) ;
}

bool isAbove( ivec3 idx, ivec3 size ){
    ivec2 IJ = getIJ( idx, size ) ;
    ivec2 ij = ivec2(texelFetch( compressedTexelIndex , IJ, 0 ).xy)  ;
    
    return (texelFetch(icolor, ij,0).r >= 0.1) ;
}


/*========================================================================
 * macros 
 *========================================================================
 */
#define isInBounds( v )     (all(greaterThanEqual(v,ivec3(0))) && \
        all(lessThan(v,size)))

#define texelInDomain(I)  ( texelFetch(compressedTexelIndex,(I),\
            0).a==uint(1) )
#define inDomain( v )   (texelInDomain( getIJ(v, size) )) 
#define isAboveThreshold(v)     isAbove( v , size )

#define isNotGood(v)  \
    (!(inDomain(v) && isInBounds( v ) && isAboveThreshold(v)))

//bool isNotGood( ivec3 v , ivec3 size){
//    bool notInDomainOrBound  = !( inDomain(v) && isInBounds( v ) ) ;
//    bool above = isAbove(v,size) ;
//    return !above ||  ;
//}

// the flipped direction of U ensures that the normal points out of the
// domain
#define getU(v)         (isNotGood(v) ? 1. : 0.) 

#define firstDerivative(C,D)   (getU((C)+(D))-getU((C)-(D)))  


/*========================================================================
 * main
 *========================================================================
 */
void main(){
    // get the sizes of the compressed and the full domain ...............
    ivec2 compSize = textureSize(fullTexelIndex,        0 ) ;
    ivec2 fullSize = textureSize(compressedTexelIndex,  0 ) ;

    // calculate the resolution of the full domain .......................
    ivec3 size = ivec3( fullSize.x/mx , fullSize.y/my, mx*my ) ;

    // get the textel position and full texel index ......................
    ivec2 texelPos = ivec2( cc*vec2(compSize) ) ; 
    ivec4 fullTexelIndex = 
        ivec4( texelFetch(  fullTexelIndex, texelPos, 0) ) ;

    // if the texel is extra, just leave .................................
    if ( fullTexelIndex.a != 1 ){
        onormals = vec4(0.,0.,0.,-1.) ;
        return ;
    }

    // 3-dimentional index of the of texel ...............................
    ivec3 cidx = getIdx( fullTexelIndex.xy , size ) ;

    // directional vectors ...............................................
    ivec3 ii  = ivec3(1,0,0) ;
    ivec3 jj  = ivec3(0,1,0) ;
    ivec3 kk  = ivec3(0,0,1) ;

    // secondary directions ..............................................
    ivec3 sij = jj+kk ;     ivec3 sik = kk-jj ;
    ivec3 sji = ii+kk ;     ivec3 sjk = kk-ii ;
    ivec3 ski = ii+jj ;     ivec3 skj = jj-ii ;

    float dii = firstDerivative(cidx, ii  ) ;
    float djj = firstDerivative(cidx, jj  ) ;
    float dkk = firstDerivative(cidx, kk  ) ;
    float dij = firstDerivative(cidx, sij ) ;
    float dik = firstDerivative(cidx, sik ) ;
    float dji = firstDerivative(cidx, sji ) ;
    float djk = firstDerivative(cidx, sjk ) ;
    float dki = firstDerivative(cidx, ski ) ;
    float dkj = firstDerivative(cidx, skj ) ;

    float omega = 0.586 ;
    
    #define f(a)    vec3(a)

    vec3 normDir = (2.*omega+1.)*(f(ii)*dii + f(jj)*djj + f(kk)*dkk) 
        + (1.-omega)*(  f(sij)*dij + f(sik)*dik 
                    +   f(sji)*dji + f(sjk)*djk
                    +   f(ski)*dki + f(skj)*dkj )/sqrt(2.) ;
    
    vec4   normal = texelFetch(inormals, texelPos , 0 ) ;
    onormals  = vec4( normalize(normal.xyz + normDir), 1.) ;
    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * clearTextureShader
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var clearTextureShader = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * clearTexture.frag    :    clear a texture -- this is used to address a
 * bug that was interfering with the normal calculations
 * 
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Mon 13 Sep 2021 12:45:10 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;

in vec2 cc ;
out vec4 ocolor ;
void main(){
    ocolor = vec4(0.) ;
    return ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vpeelingProjection
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var vpeelingProjection = { value : `#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * 
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Wed 31 Mar 2021 19:06:52 (EDT)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


uniform float       voxelSize ;
uniform int         noVoxels ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform float       cutX, cutY, cutZ, cutXDir, cutYDir, cutZDir ;

uniform sampler2D   compressed3dCrdt ;

out vec3            ocolor ;

out float           shade ;

#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
int indx = 0 ;
vec3 vertCrds[36] ;

/* ~~~~~~~~~~~~~~~~ */
/* Front PLANE      */
/* ~~~~~~~~~~~~~~~~ */
// 1F
vertCrds[indx++] = vec3(0,0,1) ;  // 1
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,1,1) ;  // 4

// 2F
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,1,1) ;  // 3

/* ~~~~~~~~~~~~~~~~ */
/* RIGHT PLANE      */
/* ~~~~~~~~~~~~~~~~ */
// 3R
vertCrds[indx++] = vec3(1,1,1) ;  // 3
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,1,0) ;  // 7

// 4R
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,0,0) ;  // 5

/* ~~~~~~~~~~~~~~~~ */
/* BOTTOM PLANE     */
/* ~~~~~~~~~~~~~~~~ */
// 5B
vertCrds[indx++] = vec3(1,0,0) ;  // 5
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 6B
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,0,1) ;  // 1

/* ~~~~~~~~~~~~~~~~ */
/* LEFT PLANE       */
/* ~~~~~~~~~~~~~~~~ */
// 7L
vertCrds[indx++] = vec3(0,0,1) ;  // 1
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 8L
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(0,1,0) ;  // 8

/* ~~~~~~~~~~~~~~~~ */
/* TOP PLANE        */
/* ~~~~~~~~~~~~~~~~ */
// 9T
vertCrds[indx++] = vec3(0,1,0) ;  // 8
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(1,1,1) ;  // 3

// 10T
vertCrds[indx++] = vec3(1,1,1) ;  // 3
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(0,1,0) ;  // 8

/* ~~~~~~~~~~~~~~~~ */
/* BACK PLANE       */
/* ~~~~~~~~~~~~~~~~ */
// 11B
vertCrds[indx++] = vec3(0,1,0) ;  // 8
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 12B
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(1,0,0) ;  // 5 



    int  vertId  = gl_VertexID % 36  ; 
    int  voxelId = gl_VertexID / 36 ;

    //shade = 1.0 ;

    ivec2 isize = textureSize(compressed3dCrdt,        0 ) ;
    ivec2 voxelIndex = ivec2( voxelId % isize.x , voxelId / isize.x ) ;
    
    vec4 pos4 = texelFetch(compressed3dCrdt, voxelIndex, 0 ) ;
    
    shade =  (pos4.a > 0.5) ? 1. : 0. ;

    vec3 pos =  (pos4.xyz - vec3(0.5))*2. ; 
    vec3 ppp = pos ;
    pos += voxelSize*0.005*2.*(vertCrds[vertId]-vec3(0.5)) ; 
    
    shade = shade* ( (ppp.x-cutX)*cutXDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.y-cutY)*cutYDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.z-cutZ)*cutZDir<0. ? 1. : 0. ) ;

    ocolor = pos4.xyz;

    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fpeelingProjection
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fpeelingProjection = { value : `#version 300 es

precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


layout (location=0) out vec4    outColor;

in float    shade ;
in vec3     ocolor ;
void main() {
    if (shade <0.5){
       discard ;
    }
    outColor = vec4(ocolor,1.) ;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vpeeling
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var vpeeling = { value : `#version 300 es
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


uniform float       voxelSize ;
uniform int         noVoxels;
uniform float       alpha ;

uniform sampler2D   icolor ;

uniform float       minValue ;
uniform float       maxValue ;
uniform vec4        channelMultiplier ;

uniform sampler2D   wnormals ;
uniform sampler2D   colormap ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;
uniform usampler2D  compressedTexelIndex ;

uniform float       shininess ;
uniform vec4        lightColor ;
uniform float       lightAmbientTerm ;
uniform float       lightSpecularTerm ;
uniform vec3        lightDirection ;
uniform vec4        lightAmbientColor ;

uniform vec4        materialColor ;
uniform float       materialAmbientTerm ;
uniform float       materialSpecularTerm ;

uniform float cutX, cutY, cutZ, cutXDir, cutYDir, cutZDir ;

#define         PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

out float shade ;

out vec4 color ;
void main() {
int indx = 0 ;
vec3 vertCrds[36] ;

/* ~~~~~~~~~~~~~~~~ */
/* Front PLANE      */
/* ~~~~~~~~~~~~~~~~ */
// 1F
vertCrds[indx++] = vec3(0,0,1) ;  // 1
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,1,1) ;  // 4

// 2F
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,1,1) ;  // 3

/* ~~~~~~~~~~~~~~~~ */
/* RIGHT PLANE      */
/* ~~~~~~~~~~~~~~~~ */
// 3R
vertCrds[indx++] = vec3(1,1,1) ;  // 3
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,1,0) ;  // 7

// 4R
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(1,0,0) ;  // 5

/* ~~~~~~~~~~~~~~~~ */
/* BOTTOM PLANE     */
/* ~~~~~~~~~~~~~~~~ */
// 5B
vertCrds[indx++] = vec3(1,0,0) ;  // 5
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 6B
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(1,0,1) ;  // 2
vertCrds[indx++] = vec3(0,0,1) ;  // 1

/* ~~~~~~~~~~~~~~~~ */
/* LEFT PLANE       */
/* ~~~~~~~~~~~~~~~~ */
// 7L
vertCrds[indx++] = vec3(0,0,1) ;  // 1
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 8L
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(0,1,0) ;  // 8

/* ~~~~~~~~~~~~~~~~ */
/* TOP PLANE        */
/* ~~~~~~~~~~~~~~~~ */
// 9T
vertCrds[indx++] = vec3(0,1,0) ;  // 8
vertCrds[indx++] = vec3(0,1,1) ;  // 4
vertCrds[indx++] = vec3(1,1,1) ;  // 3

// 10T
vertCrds[indx++] = vec3(1,1,1) ;  // 3
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(0,1,0) ;  // 8

/* ~~~~~~~~~~~~~~~~ */
/* BACK PLANE       */
/* ~~~~~~~~~~~~~~~~ */
// 11B
vertCrds[indx++] = vec3(0,1,0) ;  // 8
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(0,0,0) ;  // 6

// 12B
vertCrds[indx++] = vec3(0,0,0) ;  // 6
vertCrds[indx++] = vec3(1,1,0) ;  // 7
vertCrds[indx++] = vec3(1,0,0) ;  // 5 



    int  vertId  = gl_VertexID % 36  ; 
    int  voxelId = gl_VertexID / 36 ;

    shade = 1.0 ;

    ivec2 isize = textureSize(compressed3dCrdt,        0 ) ;
    ivec2 voxelIndex = ivec2( voxelId % isize.x , voxelId / isize.x ) ;
    
    vec4 pos4 = texelFetch(compressed3dCrdt, voxelIndex, 0 ) ;

    shade =  (pos4.a > 0.5) ? 1. : 0. ;

    vec3 pos =  (pos4.xyz - vec3(0.5))*2. ; 
    vec3 ppp = pos ;

    pos += voxelSize*0.005*2.*(vertCrds[vertId]-vec3(0.5)) ; 
    

    vec4  colorin   = texelFetch(  icolor, voxelIndex, 0 ) ; 
  
    float val = dot(colorin,channelMultiplier) ;
    vec4 mcolor = val < minValue ? 
        materialColor : texture( colormap,
            vec2((val-minValue)/(maxValue-minValue),0.5) ) ;

    float trasparency = 1.0 ;
    
    vec3    surfaceNormal = texelFetch( normals, voxelIndex , 0).xyz ;

/*------------------------------------------------------------------------
 * processing cut-planes
 *------------------------------------------------------------------------
 */
   // if ( (ppp.x-cutX)*cutXDir > 0. ){
   //   shade = 0. ;
   //   surfaceNormal = max(vec3(cutXDir,0.,0.),surfaceNormal) ;
   // }
    shade = shade* ( (ppp.x-cutX)*cutXDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.y-cutY)*cutYDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.z-cutZ)*cutZDir<0. ? 1. : 0. ) ;

/*------------------------------------------------------------------------
 * Lighting and coloring
 *------------------------------------------------------------------------
 */
    // normal direction ..................................................
    vec3 N = normalize( 
            vec3( normalMatrix*texelFetch( wnormals, voxelIndex, 0 )  )) ;

    #define dist    (voxelSize*0.015)


    if ( length(ppp.x - cutX)<(dist)) {
        surfaceNormal = vec3(1,0.,0.)*cutXDir ;
        N = surfaceNormal ;
    }
    if ( length(ppp.y - cutY)<(dist) ){
        surfaceNormal = vec3(0.,1.,0.)*cutYDir ;
        N = surfaceNormal ;
    }
    if ( length(ppp.z - cutZ)<(dist) ){
        surfaceNormal = vec3(0.,0.,1.)*cutZDir ;
        N = surfaceNormal ;
    }

    if (val < minValue){
        if ( length(surfaceNormal)<0.99 ){
            trasparency = 0. ;
            shade = 0. ;
        }else{
            trasparency = alpha ;
            mcolor = materialColor ;
        }
    }

    N = (modelMatrix*vec4(N,1.)).xyz ;

    // eye vector ........................................................
    vec3 E = normalize(-(viewMatrix*modelMatrix*vec4(pos,1.)).xyz) ;

    // light direction ...................................................
    vec3 L = normalize(lightDirection) ;

    // reflection direction ..............................................
    vec3 R = reflect(L,N) ;
    float lambertTerm = dot(N,-L) ;

    // AmbientTerm .......................................................
    vec4 Ia = v4(lightAmbientTerm) * v4(materialAmbientTerm);

    // Diffuse ...........................................................
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);

    // SpecularTerm ......................................................
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    // calculating final color ...........................................
    if (lambertTerm > 0.0) {
      Id = lightColor * mcolor * lambertTerm;
      float specular = pow( max(dot(R, E), 0.0), shininess);
      Is = v4(lightSpecularTerm) *v4(materialSpecularTerm) 
          * specular ;
    }

    // Final fargment color takes into account all light values that
    // were computed within the fragment shader
    color = vec4(vec3(Ia + Id + Is), trasparency);

    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fpeeling
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fpeeling = { value : `#version 300 es
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;

#define MAX_DEPTH 99999.0

uniform sampler2D uDepth;
uniform sampler2D uFrontColor;

in vec4 color ;
in float shade ;

// RG32F, R - negative front depth, G - back depth
layout(location=0) out vec2 depth;  
layout(location=1) out vec4 frontColor;
layout(location=2) out vec4 backColor;

void main() {

    if (shade<0.5){
        discard ;
    }
    // -------------------------
    // dual depth peeling
    // -------------------------
    float   fragDepth       = gl_FragCoord.z;   // 0 - 1

    ivec2   fragCoord       = ivec2(gl_FragCoord.xy);
    vec2    lastDepth       = texelFetch(uDepth, fragCoord, 0).rg;
    vec4    lastFrontColor  = texelFetch(uFrontColor, fragCoord, 0);

    // depth value always increases
    // so we can use MAX blend equation
    depth.rg = vec2(-MAX_DEPTH);

    // front color always increases
    // so we can use MAX blend equation
    frontColor = lastFrontColor;

    // back color is separately blend afterwards each pass
    backColor = vec4(0.0);

    float nearestDepth = - lastDepth.x;
    float furthestDepth = lastDepth.y;
    float alphaMultiplier = 1.0 - lastFrontColor.a;

    if (fragDepth < nearestDepth || fragDepth > furthestDepth) {
        // Skip this depth since it's been peeled.
        return;
    }

    if (fragDepth > nearestDepth && fragDepth < furthestDepth) {
        // This needs to be peeled.
        // The ones remaining after MAX blended for 
        // all need-to-peel will be peeled next pass.
        depth.rg = vec2(-fragDepth, fragDepth);
        return;
    }

    // -------------------------------------------------------------------
    // If it reaches here, it is the layer we need to render for this pass
    // -------------------------------------------------------------------
    if (fragDepth == nearestDepth) {
        frontColor.rgb += color.rgb * color.a * alphaMultiplier;
        frontColor.a = 1.0 - alphaMultiplier * (1.0 - color.a);
    } else {
        backColor += color;
    }
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * vquad
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var vquad = { value : `#version 300 es
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


layout(location=0) in vec4 aPosition;

void main() {
    gl_Position = aPosition;
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * fbackBlend
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var fbackBlend = { value : `#version 300 es
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


uniform sampler2D uBackColor;

out vec4 fragColor;
void main() {
    fragColor = texelFetch(uBackColor, ivec2(gl_FragCoord.xy), 0);
    if (fragColor.a == 0.0) { 
        discard;
    }
}` } ;

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * ffinal
 *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */
var ffinal = { value : `#version 300 es
precision highp float;
precision highp int ;
precision highp isampler2D ;
precision highp usampler2D ;


uniform sampler2D uFrontColor;
uniform sampler2D uBackColor;

out vec4 fragColor;
void main() {
    ivec2   fragCoord   = ivec2(gl_FragCoord.xy);
    vec4    frontColor  = texelFetch(uFrontColor, fragCoord, 0);
    vec4    backColor   = texelFetch(uBackColor, fragCoord, 0);
    float   alphaMultiplier = 1.0 - frontColor.a;

    fragColor = vec4(
            frontColor.rgb + alphaMultiplier * backColor.rgb,
            frontColor.a + backColor.a
    ) ;
}` } ;

