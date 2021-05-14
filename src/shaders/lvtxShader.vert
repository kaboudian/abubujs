#version 300 es
/*========================================================================
 * lvtxShader   : Shader for Creating Triangulated Signal Plots
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
}
