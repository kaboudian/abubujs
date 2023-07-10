#version 300 es
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
}
