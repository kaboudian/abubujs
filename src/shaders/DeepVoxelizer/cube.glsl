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

