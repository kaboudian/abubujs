/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * Abubu.js     :   library for computational work
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Sun 06 Sep 2020 21:23:28 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

/*========================================================================
 * version and update info
 *========================================================================
 */
var infoLine =''; for(var i=0;i<35;i++) infoLine+='*' ;

var version = 'V6.4.02' ;
var glsl_version = '300 es' ;
var updateTime = 'Sun 06 Sep 2020 21:23:28 (EDT)' ;

var log         = console.log ;
var warn        = console.warn ;

/*========================================================================
 * glMatrix variable import
 *========================================================================
 */
this.glMatrix    = glMatrix ;
this.mat2        = mat2 ;
this.mat2d       = mat2d ;
this.mat3        = mat3 ;
this.mat4        = mat4 ;
this.quat        = quat ;
this.vec2        = vec2 ;
this.vec3        = vec3 ;
this.vec4        = vec4 ;

/*========================================================================
 * readOption
 *========================================================================
 */
function readOption(option, defaultValue, warning){
    if (option != undefined){
        return option ;
    }else{
        if (warning != undefined ){
            warn(warning) ;
            log('Warning was issued by "'+
                arguments.callee.caller.name+'"') ;
        }
        return defaultValue ;
    }
}

var readOptions = readOption ;

/*========================================================================
 * toUpperCase
 *========================================================================
 */
function toUpperCase(str){
    if ( str != undefined ){
        return str.toUpperCase() ;
    }else{
        return undefined ;
    }
}

/*========================================================================
 * readGlOption
 *========================================================================
 */
function readGlOption(str, defaultValue, warning ){
    if (str != undefined ){
        return gl[str.toUpperCase()] ;
    }else{
        if (warning != undefined ){
            warn(warning) ;
            log('Warning was issued by "'+
                arguments.callee.caller.name+'"') ;
        }
        return defaultValue ;
    }
}

/*========================================================================
 * get a string and return the appropriate gl option
 *========================================================================
 */ 
function GL(str){
    if (str == undefined){
        warn( 'No gl string was provided' ) ;
        log('Warning was issued by "'+
                arguments.callee.caller.name+'"') ;
        return null ;
    }else{
        return gl[str.toUpperCase()] ;
    }
}

var floatToHex = function (f) { 
    var ff = Math.min(Math.floor(f*255),255) ;
    var ff = Math.max(ff,0) ;

  var hex = Number(ff).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var fullColorHex = function(c) {   
  var red = floatToHex(c[0]);
  var green = floatToHex(c[1]);
  var blue = floatToHex(c[2]);
  return red+green+blue;
};


/*========================================================================
 * OrbitalCameraControl
 *========================================================================
 */
function OrbitalCameraControl ( mViewMatrix,
                                mRadius = 5,
                                mListenerTarget = window,
                                opts={}) {
    const ANGLE_LIMIT = (Math.PI/2 - 0.01);
    const getCursorPos = function (e) {
        if(e.touches) {
            return {
                x:e.touches[0].pageX,
                y:e.touches[0].pageY
            };
        } else {
            return {
                x:e.clientX,
                y:e.clientY
            };
        }
    };

    this.up = vec3.fromValues(0,1,0) ;

    this._mtxTarget = mViewMatrix;
    this._radius = mRadius;
    this._targetRadius = mRadius;
    this._listenerTarget = mListenerTarget;
    this._isDown = false;
    this._rotation = mat4.create();
    this.center = vec3.create();

    this.easing = .5;
    this.senstivity = 1.0;
    this.senstivityRotation = .5;

    this._isLocked = false;
    this._isZoomLocked = false;
    this._rx = 0.0;
    this._trx = 0;
    this._ry = 0.0;
    this._try = 0;

    this._prevx = readOption( opts.prevx, 0 ) ;
    this._prevy = readOption( opts.prevy, 0 ) ;
    this.up     = readOption( opts.up, vec3.fromValues(0,1,0)) ;

    this._quat = quat.create();
    this._vec = vec3.create();
    this._mtx = mat4.create();


    this._mouseDown = {
        x:0,
        y:0
    };

    this._mouse = {
	x:0,
	y:0
    };



    this._init = function() {
        this._listenerTarget.addEventListener('mousedown',
                (e) => this._onDown(e));
        this._listenerTarget.addEventListener('mouseup',
                () => this._onUp());
        this._listenerTarget.addEventListener('mousemove',
                (e) => this._onMove(e));

        this._listenerTarget.addEventListener('touchstart',
                (e) => this._onDown(e));
        this._listenerTarget.addEventListener('touchend',
                () => this._onUp());
        this._listenerTarget.addEventListener('touchmove',
                (e) => this._onMove(e));

        this._listenerTarget.addEventListener('mousewheel',
                (e) => this._onWheel(e));
        this._listenerTarget.addEventListener('DOMMouseScroll',
                (e) => this._onWheel(e));
    }

    this._init();

    this.lock = function(mValue) {
        this._isLocked = mValue;
    }


    this.lockZoom = function(mValue) {
        this._isZoomLocked = mValue;
    }


    this._onWheel = function(e) {
        if ( e.ctrlKey || e.shiftKey || e.metaKey || (e.which ==3)){
            return ;
        }
        if(this._isZoomLocked) {
            return;
        }

        const w = e.wheelDelta;
        const d = e.detail;
        let value = 0;
        if (d) {
            if (w) {
                value = w / d / 40 * d > 0 ? 1 : -1;
            } else {
                value = -d / 3;
            }
        } else {
            value = w / 120;
        }

        this._targetRadius += (-value * 2 * this.senstivity);
        if(this._targetRadius < 0.01) {
            this._targetRadius = 0.01;
        }
    }

    this._onDown = function(e) {
        if ( e.ctrlKey || e.shiftKey || e.metaKey || (e.which ==3)){
            return ;
        }
        if(this._isLocked) {	return;	}
        this._isDown = true;

        this._mouseDown = getCursorPos(e);
        this._mouse = getCursorPos(e);

        this._prevx = this._trx = this._rx;
        this._prevy = this._try = this._ry;
    }

    this._onMove = function(e) {
        if (  e.ctrlKey || e.shiftKey || e.metaKey || (e.which ==3) ){
            return ;
        }
        if(this._isLocked) {	return;	}
        if(!this._isDown)	{	return;	}
        this._mouse = getCursorPos(e);
    }

    this._onUp = function() {
        if(this._isLocked) {	return;	}
        this._isDown = false;
    }

/*-------------------------------------------------------------------------
 * update the mViewMatrix
 *-------------------------------------------------------------------------
 */
    this.update = function() {
        const dx = this._mouse.x - this._mouseDown.x;
        const dy = this._mouse.y - this._mouseDown.y;

        const senstivity = 0.02 * this.senstivityRotation;
        this._try = this._prevy - dx * senstivity;
        this._trx = this._prevx - dy * senstivity;

        this._trx = Math.max(this._trx,-ANGLE_LIMIT) ;
        this._trx = Math.min(this._trx, ANGLE_LIMIT) ;

        this._rx += (this._trx - this._rx) * this.easing ;
        this._ry += (this._try - this._ry) * this.easing ;
        this._radius += (this._targetRadius - this._radius) * this.easing;

        quat.identity(this._quat);
        quat.rotateY(this._quat, this._quat, this._ry);
        quat.rotateX(this._quat, this._quat, this._rx);

        vec3.set(this._vec, 0, 0, this._radius);
        vec3.transformQuat(this._vec, this._vec, this._quat);

        mat4.identity(this._mtx);
        mat4.lookAt(this._mtx, this._vec, this.center, this.up);

        if(this._mtxTarget) {
            mat4.copy(this._mtxTarget, this._mtx);
        }
    }
}

/*========================================================================
 * sourceDisp   :   used for displaying source with line numbers for
 *                  debugging purposes
 *========================================================================
 */
function sourceDisp(source){
    var lines = source.split('\n') ;

    for(var i=0; i<lines.length; i++){
        var j=  i+1 ;
        console.log(j.toString()+'\t',lines[i]);
    }
}

/*========================================================================
 * defined
 *========================================================================
 */
function defined(v){
    if (v != undefined ){
        return true ;
    }else{
        return false ;
    }
}

/*========================================================================
 * Create a computeGl context
 *========================================================================
 */
class ComputeGL{
    constructor(options={}){
        log(infoLine) ;
        log('Abubu ', version );
        log('Updated on',updateTime) ;
        log('Developed by Abouzar Kaboudian!') ;
        log('For support email: abouzar.kaboudian@physics.gatech.edu');
        log(infoLine) ;
        this.canvas = document.createElement('canvas') ;
        this.width = 512 ;
        this.height = 512 ;
        this.extensions = {} ;
        this.dispCanvas = undefined ;

        this.width  = readOption(options.width, 512 ) ;
        this.height = readOption(options.height, 512 ) ;
        this.dispCanvas = readOption(options.canvas, this.canvas ) ;

        this.canvas.width = this.width ;
        this.canvas.height = this.height ;

        this.gl = this.canvas.getContext("webgl2") ;
        if (!this.gl){
            return null;
        }
        var gl = this.gl ;

        this.supportedExtensions = this.gl.getSupportedExtensions() ;
        gl.getExtension('EXT_color_buffer_float') ;
        gl.getExtension('OES_texture_float_linear') ;
        for(var i=0 ; i < this.supportedExtensions.length; i++ ){
                var ext = this.supportedExtensions[i] ;
                this.extensions[ext] = this.gl.getExtension(ext) ;
        }
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
}

var cgl = new ComputeGL();
if (cgl.gl){
    console.log("WebGL 2.0 context successfully initialized!") ;
}else{
    window.alert("Your browser does not support WebGL 2.0 :-(\n"+
            "Please, open the page in a supported browser such as Google "
            + "Chrome or Mozilla FireFox" ) ;
}
var gl  = cgl.gl ;
gl.lastClickTime = -1e10 ;

/*========================================================================
 * Shader class 
 *========================================================================
 */ 
class Shader{
    constructor(inType, inSource){
        this._type  = inType ;
        this._source= inSource ;
        this._shader= gl.createShader(this.type) ;
        this.oldSuccess = false ;
        this.compile() ;
    }
/*------------------------------------------------------------------------
 * end of constructor
 *------------------------------------------------------------------------
 */

    set type(nt){
        this._type = nt ;
        this._shader= gl.createShader(this.type) ;
        this.compile() ;
    }

    get type(){
        if (this._type == 'vertexShader'){
                return gl.VERTEX_SHADER ;
        }else{
                return gl.FRAGMENT_SHADER ;
        }
    }

    get source(){
        var src ;
        if ( typeof(this._source) == 'string' ){
            src = this._source ;
        }else if ( typeof(this._source) == 'object') {
            src = this._source.value ;
        }

        if ((this._source == undefined || this._source == null)  
                && this.type == gl.VERTEX_SHADER){
            src = DefaultVertexShader.value ;
        }
        /* Add version to the shader source if 
           there is no version determined in the shader source  */ 
        if ( src.split('\n')[0].split(' ')[0] != '#version' ){
            src = '#version '+ glsl_version + '\n' + source ;
        }
        return src ;
    }   

    set source(ns){
        this.oldSource = this.source ;
        this._source = ns ;
        this.compile() ;
    }

    get shader(){
        return this._shader ;
    }

    get pointer(){
        return this.shader ;
    }

    get glPointer(){
        return this.program ;
    }

    compile(){
        try{
            // = gl.createShader(this.type) ; 
             
            gl.shaderSource(this.shader, this.source) ;
            gl.compileShader(this.shader) ;
        

            this.success = 
                gl.getShaderParameter(this.shader, gl.COMPILE_STATUS);
            this.shaderInfoLog = gl.getShaderInfoLog(this.shader) ;
            if (this.shaderInfoLog.length > 0. ){
                sourceDisp(this.source) ;
                log(this.shaderInfoLog);  // eslint-disable-line
            }
            if (this.success) {
                this.oldSuccess = true ;
                return this ;
            }else{
                throw 'Shader failed to compile! '+
                    'Trying last available compilable source!' ;
            }
        
        }catch(e){
            console.log(e) ;
            if (this.oldSuccess){
                console.log('Successful compilation available...') ;
                this.source = this.oldSource ;
            }else{
                console.error('No successful compilation is available') ;
            }
        }

        gl.deleteShader(this.shader);
        return undefined;
    }

    deleteMe(){
        gl.deleteShader(this.shader) ;
    }
}

/*========================================================================
 * Program class 
 *========================================================================
 */
class Program{
    constructor( vertexShader, fragmentShader ){
        this._program       = gl.createProgram() ;
        this._vertexShader  = vertexShader ; 
        this._fragmentShader= fragmentShader ;
        this.success = false ;

        this.attach() ;
        this.link() ;
        return this ;
    }
/*------------------------------------------------------------------------
 * end of constructor
 *------------------------------------------------------------------------
 */
    get program(){
        return this._program ;
    }

    get pointer(){
        return this.program ;
    }

    get glPointer(){
        return this.program ;
    }

    get vertexShader(){
        return this._vertexShader  ;
    }

    get fragmentShader(){
        return this._fragmentShader ;
    }
    
    attach(){
        gl.attachShader(this.program, this.vertexShader.shader) ;
        gl.attachShader(this.program, this.fragmentShader.shader) ;
    }

    link(){
        gl.linkProgram(this.program) ;
        this.success 
            = gl.getProgramParameter(this.program, gl.LINK_STATUS); 
        if (this.success){
            return ;
        }else{
            log(gl.getProgramInfoLog(this.program)) ;
            return ;
        }
    }

    deleteMe(){
        gl.deleteProgram(this._program) ;
    }
}

/*========================================================================
 * createShader
 *========================================================================
 */
function createShader(type, source) {
    var shader  = gl.createShader(type);
    var src     = source ;

    /* Add version to the shader source if 
       there is no version determined in the shader source  */ 
    if ( src.split('\n')[0].split(' ')[0] != '#version' ){
        src = '#version '+ glsl_version + '\n' + source ;
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    var shaderInfoLog = gl.getShaderInfoLog(shader) ;
    if (shaderInfoLog.length > 0. ){
        sourceDisp(source) ;
        log(shaderInfoLog);  // eslint-disable-line
    }
    if (success) {
        return shader;
    }

    gl.deleteShader(shader);
    return undefined;
}

/*========================================================================
 * createProgram
 *========================================================================
 */
function createProgram(vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
}


/*========================================================================
 *  Texture     :   
 *  w           :   width of render target
 *  h           :   height of render target 
 *  options :
 *      - internalFormat
 *      - format
 *      - type
 * 
 *      - data
 *      - wrapS 
 *      - wrapT
 *      - minFilter
 *      - magFilter
 *========================================================================
 */
class Texture{
    constructor( w, h, iformat, format, type, options={} ){

        this.gl         = cgl.gl ;
        this.texture    = gl.createTexture() ;
        this._width      = w ;
        this._height     = h ;

        this._internalFormat = readOption( iformat, 'rgba32f' ,
                'No internal format provided, assuming RBGA32F' ) ;
        this._format = readOption( format , 'rgba',
            'No format was provided, assuming "rgba"' ) ;
        this._type   = readOption( type, 'float',
            'No type was provided, assuming "float"') ;

        this._wrapS    = readOption( options.wrapS, 'clamp_to_edge') ;
        this._wrapT    = readOption( options.wrapT, 'clamp_to_edge') ;

        this._minFilter = readOption( options.minFilter , 'nearest' ) ;
        this._magFilter = readOption( options.magFilter , 'nearest' ) ;
        this._data      = readOption(   options.data ,
                                        null                ) ;

/*------------------------------------------------------------------------
 * bind and set texture
 *------------------------------------------------------------------------
 */

        this.initialize() ;

        this._pairable = readOption( options.pair, false ) ;
        this._pairable = readOption( options.pairable , this._pairable ) ;
        this._reader = null ;

        if (this.pairable){
            this._reader = new TextureReader(this) ;
        }
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * initialize the texture 
 *------------------------------------------------------------------------
 */

    initialize(){
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_S,
                            GL(this.wrapS)                  ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_T,
                            GL(this.wrapT)                  ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MIN_FILTER,
                            GL(this.minFilter)              ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MAG_FILTER,
                            GL(this.magFilter)              ) ;

        gl.texImage2D(      gl.TEXTURE_2D, 0 ,
                            GL(this.internalFormat),
                            this.width, this.height, 0,
                            GL(this.format),
                            GL(this.type),
                            this.data                       ) ;

        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;

        return ;
    }
/*------------------------------------------------------------------------
 * getters and setters 
 *------------------------------------------------------------------------
 */

// width and height ......................................................
    resize(width,height){
        this._width = readOption(width,this.width) ;
        this._height = readOption(height,this.height) ;
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , 
                        GL(this.internalFormat),
                        this.width, this.height, 0, 
                        GL(this.format), GL(this.type), null ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
    }

    get width(){
        return this._width ;
    }
    set width(w){
        this.resize(w,this.height) ;
    }

    get height(){
        return this._height ;
    }

    set height(h){
        this.resize(this.width,h) ;
    }

// internalFormat ........................................................
    get internalFormat(){
        return this._internalFormat ;
    }
    set internalFormat(nif){
        this._internalFormat = readOption(nif, this.internalFormat ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , 
                        GL(this.internalFormat),
                        this.width, this.height, 0, 
                        GL(this.format), GL(this.type), null ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
        return ;
    }

// format ................................................................
    get format(){
        return this._format ;
    }
    set format(nf){
        this._format = nf ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , 
                        GL(this.internalFormat),
                        this.width, this.height, 0, 
                        GL(this.format), GL(this.type), null ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
        return ;
    }

// type ..................................................................
    get type(){
        return this._type ;
    }
    set type(nt){
        this._type = readOption(nt, this.type) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , 
                        GL(this.internalFormat),
                        this.width, this.height, 0, 
                        GL(this.format), GL(this.type), null ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
        return ;
    }

// wrapS .................................................................
    get wrapS(){
        return this._wrapS ;
    }
    set wrapS(ws){
        this._wrapS = readOption( ws, this.wrapS ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_S,
                            GL(this.wrapS)                  ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
        return ;
    }
    setWrapS(ws){
        this.wrapS = ws ;
        return ;
    }

// wrapT .................................................................
    get wrapT(){
        return this._wrapT ;
    }
    set wrapT(wt){
        this._wrapT = readOption(wt, this.wrapT) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_T,
                            GL(this.wrapT)                  ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
        return ;
    }

    setWrapT(wt){
        this.wrapT = wt ;
        return ;
    }

// minFilter .............................................................
    get minFilter(){
        return this._minFilter ;
    }
    set minFilter(nf){
        this._minFilter = readOption(nf , this.minFilter ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MIN_FILTER,
                            GL(this.minFilter)              ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
    }
    setMinFilter(minFilter){
        this.minFilter = readOption(minFilter, this.minFilter ) ;
        return this.minFilter ;
    }

// magFilter .............................................................
    get magFilter(){
        return this._magFilter ;
    }
    
    set magFilter(nf){
        this._magFilter = readOption(nf, this.magFilter ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture     ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MAG_FILTER,
                            GL(this.magFilter)              ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null             ) ;
    }

    setMagFilter(magFilter){
        this.magFilter = readOption(magFilter, this.magFilter ) ;
        return this.magFilter ; 
    }

// data ..................................................................
    get data(){
        return this._data ;
    }

    set data(new_data){
        this._data = new_data ;
        this.updateData(new_data) ;
    }

    updateData( newData ){
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;

        this._data = readOption( newData, this.data ) ;
        gl.texImage2D( gl.TEXTURE_2D, 0 , GL(this.internalFormat),
                    this.width, this.height, 0, 
                    GL(this.format), GL(this.type) ,
                    this.data    ) ;
        gl.bindTexture(gl.TEXTURE_2D, null) ;
    }


// pairability ...........................................................
    get pairable(){
        return this._pairable ;
    }

    set pairable(p){
        if ((!this.pairable) && p ){
            this.reader = new TextureReader(this) ;
        }
        this._pairable = p ;
    }
    
            
    get reader(){
        return this._reader ;
    }

    set reader(nr){
        this._reader = nr ;
    }

    get value(){
        if (this.pairable){
            return this.reader.value ;
        }else{
            return null ;
        }
    }

    read(){
        return this.value ;
    }
}

/*========================================================================
 * Uint32Texture    : 32 bit unsigned integer texture
 *========================================================================
 */ 
class Uint32Texture extends Texture{
    constructor(w,h,options={}){
        super( w,h, 'rgba32ui','rgba_integer', 'unsigned_int' , options) ;
    }
}

/*========================================================================
 * IntegerTexture   : 32 bit integer texture
 *========================================================================
 */
class Int32Texture extends Texture{
    constructor(w,h, options={}){
        super(w,h,'rgba32i','rgba_integer','int',options) ;
    }
}
/*========================================================================
 * Float32RTexture 
 *========================================================================
 */
class Float32RTexture extends Texture{
    constructor(w,h,options={}){
        super(w,h,'r32f','red','float',options) ;

    }
}

/*========================================================================
 * FloatTexture     : 32 bit float texture
 *========================================================================
 */
class Float32Texture extends Texture{
    constructor(w,h,options={}){
        super(w,h,'rgba32f','rgba','float',options) ;
    }
   
    resize( width, height ){
        var target = {} ;
        target.texture = this.texture ;
        target.width   = this.width ;
        target.height  = this.height ;
        this.temp = new Float32Texture( this.width, this.height) ;
        copyTexture(target, this.temp ) ;

        this.width = width ;
        this.height = height ;
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , gl.RGBA32F,
                        this.width,
                        this.height, 0, gl.RGBA, gl.FLOAT, null ) ;
        copyTexture(this.temp, target ) ;
    }
}

var FloatRenderTarget = Float32Texture ;

/*========================================================================
 * ImageTexture
 *========================================================================
 */
class ImageTexture extends Float32Texture{
    constructor(Img, options={}){
        if ( Img.used ){
            log( 'Image is used once and cannot be re-used in '
                +'the library. '
                +'Consider using the data from previous import, or '
                +'re-importing the image as a different resource!'  ) ;
            return null ;
        }

        Img.used = true ;
        options.data = Img ;
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true) ;
        super(Img.width, Img.height, options) ; 
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

    set width(w){
        console.log("Cannot change size!") ;
    }
    get width(){
        return this._width ;
    }
    set height(h){
        console.log("Cannot change height") ;
    }
    get height(){
        return this._height ;
    }
}
/*========================================================================
 * CanvasTexture( canvas )
 *========================================================================
 */
class oldCanvasTexture extends Float32Texture{
    constructor(canvas, options={}){
        options.data = canvas ;
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true) ;
        super(canvas.width, canvas.height, options) ; 
        this.canvas = canvas ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    update(){
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , gl.RGBA32F,
                        this.width, this.height, 0, gl.RGBA, gl.FLOAT,
                        this.canvas ) ;
        gl.bindTexture(gl.TEXTURE_2D, null) ;
    }

    get width(){
        return this.canvas.width ;
    }
    get height(){
        return this.canvas.height ;
    }

    set width(w){
        this.canvas.width = w ;
    }
    set height(h){
        this.canvas.height = h ;
    }
    resize(w,h){
        this.width = w ;
        this.height = h ;
        this.update() ;
    }
}
        

/*========================================================================
 * CanvasTexture( canvas )
 *========================================================================
 */
class LegacyCanvasTexture{
    constructor(canvas){
        this.canvas = canvas ;
        this.cgl    = cgl ;
        this.width  = canvas.width ;
        this.height = canvas.height ;

        this.texture = gl.createTexture() ;
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;
        gl.texParameteri(gl.TEXTURE_2D, 
                gl.TEXTURE_WRAP_S, 
                gl.CLAMP_TO_EDGE );
        gl.texParameteri(gl.TEXTURE_2D, 
                gl.TEXTURE_WRAP_T, 
                gl.CLAMP_TO_EDGE );
        gl.texParameteri(gl.TEXTURE_2D, 
                gl.TEXTURE_MIN_FILTER, 
                gl.NEAREST   );
        gl.texParameteri(gl.TEXTURE_2D, 
                gl.TEXTURE_MAG_FILTER, 
                gl.NEAREST   );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true) ;
        gl.texImage2D( gl.TEXTURE_2D, 0 , gl.RGBA32F,
                        this.width, this.height, 0, gl.RGBA, gl.FLOAT,
                        this.canvas ) ;

        gl.bindTexture(gl.TEXTURE_2D, null) ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * update
 *------------------------------------------------------------------------
 */
    update(){
        this.width = this.canvas.width ;
        this.height = this.canvas.height ;
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true) ;
        gl.texImage2D(  gl.TEXTURE_2D, 0 , gl.RGBA32F,
                        this.width, this.height, 0, gl.RGBA, gl.FLOAT,
                        this.canvas ) ;
        gl.bindTexture(gl.TEXTURE_2D, null) ;
    }
}



/*========================================================================
 * TableTexture
 *========================================================================
 */
class TableTexture{
    constructor( t, w, h=1, options ={} ){
        this.cgl = cgl ;
        this.width = w ;
        this.height = h ;
        this.size = this.width*this.height ;
        this.originalTable = t ;
        this.table = new Float32Array(t) ;

        this.minFilter  = readGlOption(options.minFilter, 
                gl.LINEAR         ) ;
        this.magFilter  = readGlOption(options.magFilter, 
                gl.LINEAR         ) ;
        this.wrapS      = readGlOption(options.wrapS    , 
                gl.CLAMP_TO_EDGE  ) ;
        this.wrapT      = readGlOption(options.wrapT    , 
                gl.CLAMP_TO_EDGE  ) ;

/*------------------------------------------------------------------------
 * Creating the texture
 *------------------------------------------------------------------------
 */
        this.texture = gl.createTexture() ;

        gl.bindTexture(     gl.TEXTURE_2D,
                            this.texture            ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_S,
                            this.wrapS              ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_T,
                            this.wrapT              ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MIN_FILTER,
                            this.minFilter          ) ;

        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MAG_FILTER,
                            this.magFilter          );

        gl.texImage2D(      gl.TEXTURE_2D,
                            0 ,
                            gl.RGBA32F,
                            this.width,
                            this.height,
                            0,
                            gl.RGBA,
                            gl.FLOAT,
                            this.table              ) ;

        gl.bindTexture(     gl.TEXTURE_2D,
                            null                    ) ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * setWrapS
 *------------------------------------------------------------------------
 */
    setWrapS(wrapS){
        this.wrapS = readGlOption(wrapS, this.wrapS ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_S,
                            this.wrapS                  ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null         ) ;
    }

/*------------------------------------------------------------------------
 * setWrapT
 *------------------------------------------------------------------------
 */
    setWrapT(wrapT){
        this.wrapT = readGlOption(wrapT, this.wrapT ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_WRAP_T,
                            this.wrapT                  ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null         ) ;
        return ;
    }

/*------------------------------------------------------------------------
 * setMinFilter
 *------------------------------------------------------------------------
 */
    setMinFilter(minFilter){
        this.minFilter = readOption(minFilter, this.minFilter ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MIN_FILTER,
                            this.minFilter              ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null         ) ;

    }

/*------------------------------------------------------------------------
 * setMagFilter
 *------------------------------------------------------------------------
 */
    setMagFilter(magFilter){
        this.magFilter = readOption(magFilter, this.magFilter ) ;
        gl.bindTexture(     gl.TEXTURE_2D, this.texture ) ;
        gl.texParameteri(   gl.TEXTURE_2D,
                            gl.TEXTURE_MAG_FILTER,
                            this.magFilter              ) ;
        gl.bindTexture(     gl.TEXTURE_2D, null         ) ;

    }

/*------------------------------------------------------------------------
 * updating the table
 *------------------------------------------------------------------------
 */
    update(utab){
        if (utab != undefined){
            this.originalTable = utab ;
            this.table = new Float32Array(utab) ;
        }else{
            this.table = new Float32Array(this.originalTable) ;
        }
        gl.bindTexture(gl.TEXTURE_2D, this.texture) ;

        gl.texImage2D( gl.TEXTURE_2D, 0 , gl.RGBA32F,
        this.width, this.height, 0, gl.RGBA, gl.FLOAT, this.table ) ;
        gl.bindTexture(gl.TEXTURE_2D, null) ;
    }
}

/*========================================================================
 * Copy
 *========================================================================
 */
function Copy(srcTarget, destTarget){
    return new Solver( {
            vertexShader : DefaultVertexShader.value ,
            fragmentShader: wA2bShader.value ,
            uniforms : {
                map : {
                    type        : 's' ,
                    value       : srcTarget ,
                    minFilter   : 'linear',
                    magFilter   : 'linear' ,
                } ,
            } ,
            renderTargets : {
                FragColor : {
                    location    : 0 ,
                    target      : destTarget
                } ,
            }
    } ) ;
}

/*========================================================================
 * CompressedData
 *========================================================================
 */ 
class RgbaCompressedData{
    constructor( data, options={}){

        if (data == undefined){
            log( 'You need to provide data source for compression!') ;
            return null ;
        }

        this.data       = new Float32Array(data) ;
        this.width      = readOption( options.width,    data.length/4   ) ;
        this.height     = readOption( options.height,   1               ) ;
        if ( (this.width == (data.length/4)) && height != 1 ){
            this.width = (data.length/this.height)/4 ;
        }

        this.threshold  = readOption(   options.threshold, 0            ) ;
        this.threshold  = readOption(   options.compressionThreshold,
                                        this.threshold                  ) ;
        
        this.compressionThresholdChannel
                        = readOption(   options.channel,    'r'         ) ;

        switch (this.compressionThresholdChannel){
            case 'r' :
                this.channel = 0 ;
                break ;
            case 'g' :
                this.channel = 1 ;
                break ;
            case 'b' :
                this.channel = 2 ;
                break ;
            case 'a' :
                this.channel = 3 ;
                break ;
            default :
                this.channel = 0 ;
                break ;
        }

        this.compThresholdData = new Float32Array(this.width*this.height) ;

/*------------------------------------------------------------------------
 * count number of pixels above the compression threshold
 *------------------------------------------------------------------------
 */
        this.noAboveThreshold = 0 ;
        for(var j=0 ; j<this.height ; j++){
            for (var i=0 ; i <this.width; i++){
                var indx    = i + j*this.width ;
                this.compThresholdData[indx]
                        = this.data[indx*4 + this.channel] ;
                if (this.compThresholdData[indx]>this.threshold){
                        this.noAboveThreshold++ ;
                }
            }
        }

/*------------------------------------------------------------------------
 * allocating memory to data
 *------------------------------------------------------------------------
 */
        this.compressedSize    =
            Math.ceil( Math.sqrt( this.noAboveThreshold )) ;

        this.compressedTable =
            new Float32Array(this.compressedSize*this.compressedSize*4  ) ;
        this.decompressionMapTable =
            new Float32Array(this.compressedSize*this.compressedSize*4  ) ;
        this.compressionMapTable =
            new Float32Array(this.width*this.height * 4 ) ;

/*------------------------------------------------------------------------
 * compress data
 *------------------------------------------------------------------------
 */
        var num = 0 ;
        for(var j=0 ; j<this.height ; j++){
            for (var i=0 ; i <this.width; i++){
                var indx    = i + j*this.width ;
                if (this.compThresholdData[indx]>this.threshold){
                    var jj  = Math.floor( num/this.compressedSize) ;
                    var ii  = num - jj*this.compressedSize ;

                    var x   = ii/this.compressedSize
                            + 0.5/this.compressedSize ;
                    var y   = jj/this.compressedSize
                            + 0.5/this.compressedSize ;

                    var nindx = ii + jj*this.compressedSize ;

                    this.compressionMapTable[indx*4     ]   = x ;
                    this.compressionMapTable[indx*4 + 1 ]   = y ;
                    this.decompressionMapTable[nindx*4  ]   =
                        i/this.width + 0.5/this.width ;
                    this.decompressionMapTable[nindx*4+1]   =
                        j/this.height+ 0.5/this.height ;

                    for (var k = 0 ; k<4 ; k++){
                        this.compressedTable[nindx*4+k]
                            = this.data[indx*4+k] ;
                    }
                    num++ ;
                }else{
                    this.compressionMapTable[indx*4     ]
                        = 1.-0.5/this.compressedSize ;
                    this.compressionMapTable[indx*4 + 1 ]
                        = 1.-0.5/this.compressedSize ;
                }

            }
        }
        var ii = this.compressedSize -1 ;
        var jj = this.compressedSize -1 ;
        var nindx = ii + jj*this.compressedSize ;
        for (var k = 0 ; k<4 ; k++){
            this.compressedTable[nindx*4+k] = 0. ;
        }

/*------------------------------------------------------------------------
 * setting compressedData, compressionMap, decompressionMap textures
 *------------------------------------------------------------------------
 */
        this.full   = new TableTexture(
            this.data,
            this.width,
            this.height,
            {
                minFilter : 'nearest' ,
                magFilter : 'nearest'
            }
        ) ;

        this.sparse = new TableTexture(
            this.compressedTable,
            this.compressedSize ,
            this.compressedSize ,
            {
                minFilter : 'nearest' ,
                magFilter : 'nearest'
            }
        ) ;

        this.compressionMap     = new TableTexture(
            this.compressionMapTable,
            this.width,
            this.height ,
            {
                minFilter : 'nearest' ,
                magFilter : 'nearest'
            }
        ) ;

        this.decompressionMap   = new TableTexture(
            this.decompressionMapTable ,
            this.compressedSize ,
            this.compressedSize ,
            {
                minFilter : 'nearest' ,
                magFilter : 'nearest'
            }
        ) ;
    }   
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    
/*------------------------------------------------------------------------
 * getCompressionRatio
 *------------------------------------------------------------------------
 */
    getCompressionRatio(){
        return (    this.compressedSize*this.compressedSize/
                    (this.width*this.height)                ) ;
    }

/*------------------------------------------------------------------------
 * getCompressionEfficiency
 *------------------------------------------------------------------------
 */
    getCompressionEfficiency(){
        return (    this.noAboveThreshold /
                    (this.compressedSize*this.compressedSize)   ) ;
    }
}

/*========================================================================
 * RgbaCompressedDataFromImage
 *========================================================================
 */ 
class RgbaCompressedDataFromImage extends RgbaCompressedData{
    constructor(image, options){
        if (image == undefined){
            log( 'You need to provide image source for compression!') ;
            return null ;
        }

        if ( image.used ){
            log( 'Image is used once and cannot be re-used in '
                +'the library. '
                +'Consider using the data from previous import, or '
                +'re-importing the image as a different resource!'  ) ;
            return null ;
        }

        image.used = true ;
        
        var op      = options ;
        var width   = image.width ;
        var height  = image.height ;
        op.width    = width ;
        op.height   = height ;
        op.threshold = readOption(op.threshod, 0 ) ;
        op.threshold = readOption(op.compressionThreshold, op.threshold) ;
        

        var canvas      = document.createElement('canvas') ;
        canvas.width    = width ;
        canvas.height   = height ;
        var context     = canvas.getContext('2d') ;

        context.drawImage(  image,
                            0,0,
                            width, height         ) ;

        var odt     =
            context.getImageData(   0,0,
                                    width,height  ).data ;

        var dat     = new Float32Array(width*height*4) ;
        var data    = new Float32Array(width*height*4) ;


/*------------------------------------------------------------------------
 * converting data to float
 *------------------------------------------------------------------------
 */
        for(var i=0 ; i< (width*height*4) ; i++){
            dat[i] = odt[i]/255.0 ;
        }

/*------------------------------------------------------------------------
 * flip-y   :   imported images have their data along y-flliped
 *------------------------------------------------------------------------
 */
        for(var j=0 ; j<height ; j++){
            for (var i=0 ; i <width; i++){
                var indx    = i + j*width ;
                var nindx   = i + width*( height-1-j) ;
                for (var k=0 ; k<4 ; k++){
                    data[nindx*4+k] = dat[indx*4+k] ;
                }
            }
        }

        super(data, op ) ;
        this.image = image ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
}

/*========================================================================
 * RgbaCompressedDataFromTexture
 *========================================================================
 */ 
class RgbaCompressedDataFromTexture extends RgbaCompressedData{
    constructor( options={} ){
        if ( options.target == undefined && 
             options.texture == undefined ) return null ;

        var texture ;
        texture = readOption(options.target, null ) ;
        texture = readOption(options.texture, options.target ) ;

        var ttbond = new Float32TextureTableBond({ target : texture } ) ;
        ttbond.tex2tab() ;
        var table       = ttbond.table ;
        var width       = ttbond.width ;
        var height      = ttbond.height ;
        var op          = options ;
        op.width        = width ;
        op.height       = height ;

        super( table, op ) ;
        this.ttbond     = ttbond ;
        this.texture    = texture ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

    get texture(){
        return this._texture ;
    }
    set texture(val){
        this._texture = val ;
    }
}

/*========================================================================
 * copyTexture
 *========================================================================
 */
function copyTexture(srcTarget, destTarget){
    var copy = new Copy( srcTarget, destTarget ) ;
    copy.render() ;
    copy.deleteMe() ;
    return ;
}
/*========================================================================
 * Uniform: the class is used in defining solvers for defining uniforms
 * that need to be sent to the solver
 *========================================================================
 */ 
class Uniform{
    constructor(opts={}){
        /* Values extracted directly from opts */
        this._type      = readOption( opts.type,   'f'              ) ;
        this._value     = readOption( opts.value,  0.0              ) ;
        this._name      = readOption( opts.name,   'var'            ) ;
        this._solver    = readOption( opts.solver, null             ) ;

        this._wrapS     = readOption( opts.wrapS, 'clamp_to_edge'   ) ;
        this._wrapT     = readOption( opts.wrapT, 'clamp_to_edge'   ) ;
        this._minFilter = readOption( opts.minFilter, 'nearest'     ) ;
        this._magFilter = readOption( opts.magFilter, 'nearest'     ) ;

        /* Derived values and initialization */
        this._location = 
            gl.getUniformLocation(  this.program, this.name ) ;
        
        this.initValue() ;
        this.setValue() ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * Getter and Setter functions
 *------------------------------------------------------------------------
 */

    /*--------------*/
    /* name         */
    /*--------------*/
    get name(){
        return this._name ;
    }
    set name(nn){
        this._name = nn ;
        this._location = gl.getUniformLocation(
                this._program, 
                this._name ) ;
        this.value = this._value ;
    }

    /*--------------*/
    /* type         */
    /*--------------*/
    get type(){
        return this._type ;
    }
    set type(nt){
        this._type = nt ;
        this.value = this._value ;
    }

    /*--------------*/
    /* location     */
    /*--------------*/
    get location(){
        return gl.getUniformLocation(  this.program, this.name ) ;
    }

    /*--------------*/
    /* program      */
    /*--------------*/
    get program(){
        return this.solver.program ;
    }

    /*--------------*/
    /* solver       */
    /*--------------*/
    get solver(){
        return this._solver ;
    }

    /*--------------*/
    /* activeNumber */
    /*--------------*/
    get activeNumber(){
        return this._activeNumber ;
    }
    set activeNumber(an){
        this._activeNumber = an ;
    }
 
    /*--------------*/
    /* minFilter    */
    /*--------------*/
    get minFilter(){
        return this._minFilter ;
    }
    set minFilter(nf){
        this._minFilter = readOption(nf, this._minFilter ) ;
        this.setValue() ;
    }
    get glMinFilter(){
        return readGlOption( this.minFilter ) ;
    }
    
    /*--------------*/
    /* magFilter    */
    /*--------------*/
    get magFilter(){
        return this._magFilter ;
    }
    set magFilter(nf){
        this._magFilter = readOption(nf, this._magFilter ) ;
        this.setValue() ;
    }
    get glMagFilter(){
        return readGlOption( this.magFilter ) ;
    }
    
    /*--------------*/
    /* wrapS        */
    /*--------------*/
    get wrapS(){
        return this._wrapS ;
    }
    set wrapS(nw){
        this._wrapS = readOption( nw, this._wrapS ) ;
        this.setValue() ;
    }
    get glWrapS(){
        return readGlOption( this.wrapS ) ;
    }

    /*--------------*/
    /* wrapT        */
    /*--------------*/
    get wrapT(){
        return this._wrapT ;
    }
    set wrapT(nw){
        this._wrapT = readOption( nw, this._wrapT ) ;
        this.setValue() ;
    }
    get glWrapT(){
        return readGlOption( this.wrapT ) ;
    }
  
/*------------------------------------------------------------------------
 * initValue : set active number and advance the number of textures in 
 * parent solver for textures and samplers
 *------------------------------------------------------------------------
 */
    initValue(){
        this.solver.useProgram() ;

        var location    = this.location ;
        var type        = this.type ;
        
        switch(this.type){
            case 't' :  /* texture */
                var activeNumber =  this.solver.noTextureUniforms ;
                this.activeNumber = activeNumber ;
                if (this.solver != null ){
                    this.solver.noTextureUniforms += 1 ;
                    this.solver.textureUniforms[this.name] = this ;
                }
                break ;
            case 's' :
                var activeNumber =  this.solver.noTextureUniforms ;
                this.activeNumber = activeNumber ;
                this.sampler = gl.createSampler() ;

                if ( this.solver != null){
                    this.solver.noTextureUniforms += 1 ;
                    this.solver.textureUniforms[this.name] = this ;
                }
                break ;

        }
    }   /* end of initValue */

/*------------------------------------------------------------------------
 * setting the value of the uniform
 *------------------------------------------------------------------------
 */
    get value(){
        return this._value ;
    }

    set value(nv){
        this.solver.useProgram() ;
        this._value     = readOption(nv, this._value) ;
        var value       = this._value ;
        var location    = this.location ;
        var type        = this.type ;
        switch (this.type){
            case 't' :  /* texture */
                var activeNumber =  this.activeNumber ;
                gl.uniform1i(
                        this.location ,
                        activeNumber
                        ) ;
                gl.activeTexture(
                        gl.TEXTURE0+activeNumber
                        ) ;
                gl.bindTexture(
                        gl.TEXTURE_2D,
                        this.value.texture
                        ) ;
                break ;
            case 's' :
                var activeNumber =  this.activeNumber ;

                var sampler = this.sampler ;

                gl.samplerParameteri(
                        sampler,
                        gl.TEXTURE_MIN_FILTER,
                        this.glMinFilter
                        ) ;

                gl.samplerParameteri(
                        sampler, gl.TEXTURE_MAG_FILTER,
                        this.glMagFilter
                        ) ;

                gl.samplerParameteri(
                        sampler,
                        gl.TEXTURE_WRAP_S,
                        this.glWrapS
                        ) ;

                gl.samplerParameteri(
                        sampler,
                        gl.TEXTURE_WRAP_T,
                        this.glWrapT
                        ) ;

                gl.uniform1i(
                        this.location ,
                        activeNumber
                        ) ;
                gl.activeTexture(
                        gl.TEXTURE0+activeNumber
                        ) ;
                gl.bindTexture(
                        gl.TEXTURE_2D,
                        this.value.texture
                        ) ;
                gl.bindSampler(
                        activeNumber,
                        sampler
                        ) ;

                break ;
            case 'b' :  /* boolean */
                gl.uniform1i(
                        location ,
                        value
                        ) ;
                break ;
            case 'i' :  /* integer */
                gl.uniform1i(
                        location ,
                        value
                        ) ;
                break ;

            case 'iv' : /* 1-dimensional integer array  */
                gl.uniform1iv(
                        location ,
                        value
                        ) ;
                break ;

            case 'i2' : /* 2-dimensional integer vector */
                gl.uniform2i(
                        location ,
                        value[0],
                        value[1]
                        ) ;
                break ;

            case 'i2v': /* 2-dimensional integer array  */
                gl.uniform2iv(
                        location ,
                        value
                        ) ;
                break ;

            case 'i3' : /* 3-dimensional integer vector */
                gl.uniform3i(
                        location ,
                        value[0],
                        value[1],
                        value[2]
                        ) ;
                break ;

            case 'i3v': /* 3-dimensional integer array  */
                gl.uniform3iv(
                        location ,
                        value
                        ) ;
                break ;

            case 'i4' :  /* 4-dimensional integer vector */
                gl.uniform4i(
                        location ,
                        value[0],
                        value[1],
                        value[2],
                        value[3]
                        ) ;
                break ;

            case 'i4v' : /* 4-dimensional integer array  */
                gl.uniform4iv(
                        location ,
                        value
                        ) ;
                break ;

            case 'f' :  /* float */
                gl.uniform1f(
                        location ,
                        value
                        ) ;
                break ;

            case 'fv' : /* 1-dimensional float array    */
                gl.uniform1fv(
                        location,
                        value
                        ) ;
                break ;

            case 'v2' : /* 2-dimensional float vector   */
                gl.uniform2f(
                        location,
                        value[0],
                        value[1]
                        ) ;
                break ;

            case 'f2' : /* 2-dimensional float vector   */
                gl.uniform2f(
                        location,
                        value[0],
                        value[1]
                        ) ;
                break ;

            case 'v2v' : /* 2-dimensional float array   */
                gl.uniform2fv(
                        location ,
                        value
                        ) ;
                break ;
            case 'f2v' : /* 2-dimensional float array   */
                gl.uniform2fv(
                        location ,
                        value
                        ) ;
                break ;

            case 'v3' : /* 3-dimensional float vector   */
                gl.uniform3f(
                        location,
                        value[0],
                        value[1],
                        value[2]
                        ) ;
                break ;

            case 'f3' : /* 3-dimensional float vector   */
                gl.uniform3f(
                        location,
                        value[0],
                        value[1],
                        value[2]
                        ) ;
                break ;

            case 'v3v': /* 3-dimensional float array    */
                gl.uniform3fv(  location,   value               ) ;
                break ;

            case 'f3v': /* 3-dimensional float array    */
                gl.uniform3fv(  location,   value               ) ;
                break ;

            case 'v4' : /* 4-dimensional float vector   */
                gl.uniform4f(
                        location,
                        value[0],
                        value[1],
                        value[2],
                        value[3]
                        ) ;
                break ;

            case 'f4' : /* 4-dimensional float vector   */
                gl.uniform4f(
                        location,
                        value[0],
                        value[1],
                        value[2],
                        value[3]
                        ) ;
                break ;

            case 'v4v': /* 4-dimensional float array    */
                gl.uniform4fv(
                        location,
                        value
                        ) ;
                break ;
            case 'f4v': /* 4-dimensional float array    */
                gl.uniform4fv(
                        location,
                        value
                        ) ;
                break ;

            case 'mat2': /* 2x2 floating point matrix   */
                gl.uniformMatrix2fv(
                        location,
                        gl.FLASE,
                        value
                        ) ;
                break ;

            case 'mat3': /* 3x3 floating point matrix   */
                gl.uniformMatrix3fv(
                        location,
                        gl.FLASE,
                        value
                        ) ;
                break ;

            case 'mat4': /* 4x4 floating point matrix   */
                gl.uniformMatrix4fv(
                        location,
                        gl.FLASE,
                        value
                        ) ;
                break ;
         }
    } /* End of set value */

    setValue(nv){
        this.value = readOption(nv, this.value) ;
    }

    resend(){
        this.solver.useProgram() ;
        this.value = this.value ;
    }

}/* End of class Uniform */

/*========================================================================
 * Solver
 *========================================================================
 */
class Solver{ 
    constructor( options={} ){ 
        this.cgl = cgl ;
        this.gl = cgl.gl ;
        this.noRenderTargets = 0 ;
        this.noUniforms = 0 ;
        this.noTextureUniforms = 0 ;
        this.textureUniforms = {} ;
        this.uniforms = {} ;
        this.canvasTarget = false ;
        this.canvas = gl.canvas ;

        this.renderTargets = {} ;
        this.renderTargetNames = [] ;
        this.drawBuffers = [] ;
        this.framebuffer = null ;

        if (options == undefined ){
            delete this ;
            return ;
        }

/*------------------------------------------------------------------------
 * clear
 *------------------------------------------------------------------------
 */
        this.clear      = readOption(options.clear,         true        ) ;
        this.clearColor = readOption(options.clearColor,    [0,0,0,0]   ) ;

/*------------------------------------------------------------------------
 * vertexShader
 *------------------------------------------------------------------------
 */
        this._vertexShader = new Shader('vertexShader', 
                options.vertexShader);
/*------------------------------------------------------------------------
 * fragmentShader
 *------------------------------------------------------------------------
 */

        if ( options.fragmentShader != undefined ){
            this.fragmentShaderSrc = options.fragmentShader ;
            this._fragmentShader = new Shader('fragmentShader', 
                    this.fragmentShaderSrc ) ;
        }else{
            console.error('No fragment shader was provided! Aborting!') ;
            delete this ;
            return ;
        }
/*------------------------------------------------------------------------
 * depth and cullFacing
 *------------------------------------------------------------------------
 */
        this.cullFacing = readOption( options.cullFacing, false ) ;
        this.cullFace   = readGlOption( options.cullFace, gl.BACK ) ;
        this.depthTest  = readOption( options.depthTest, false ) ;

/*------------------------------------------------------------------------
 * Program
 *------------------------------------------------------------------------
 */
        this.program = new Program( 
                this.vertexShader, 
                this.fragmentShader) ;
        this.useProgram() ;

/*------------------------------------------------------------------------
 * geometry
 *------------------------------------------------------------------------
 */
        this.geometry = {} ;
        this.geometry.vertices =  [
            1.,1.,0.,
            0.,1.,0.,
            1.,0.,0.,
            0.,0.,0.,
        ] ;
        this.geometry.noVertices= 4 ;
        this.geometry.noCoords  = 3 ;
        this.geometry.type      = gl.FLOAT ;
        this.geometry.normalize = false ;
        this.geometry.stride    = 0 ;
        this.geometry.offset    = 0 ;
        this.geometry.premitive = gl.TRIANGLE_STRIP ;
        this.geometry.width = 1 ;

        if ( options.geometry != undefined ){
            this.geometry.vertices =
                readOption( options.geometry.vertices, null ) ;
            if (this.geometry.vertices == null ){
                warn(       'Error: The passed geometry has no vertices! '
                        +   'No solver can be defined!'                 ) ;
                delete this ;
                return null ;
            }
            this.geometry.noCoords = readOptions(
                options.geometry.noCoords ,  3
            ) ;

            this.geometry.noVertices = readOptions(
                options.geometry.noVertices ,
                this.geometry.vertices.length
                        /this.geometry.noCoords
            ) ;
            this.geometry.normalize = readOption(
                options.geometry.normalize ,
                false
            ) ;
            this.geometry.premitive = readGlOption(
                options.geometry.premitive ,
                gl.TRIANGLE_STRIP
            ) ;
            this.geometry.width = readOption(
                options.geometry.width,
                1
            ) ;
        }

/*------------------------------------------------------------------------
 * Creating the position vector
 *------------------------------------------------------------------------
 */
        this.positionLoc = gl.getAttribLocation(this.prog, "position") ;
        this.positionBuffer = gl.createBuffer() ;
        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.positionBuffer
        ) ;
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.geometry.vertices),
            gl.STATIC_DRAW
        );
        this.vao = gl.createVertexArray() ;
        gl.bindVertexArray(this.vao) ;
        gl.enableVertexAttribArray(this.positionLoc) ;

        gl.vertexAttribPointer(
            this.positionLoc ,
            this.geometry.noCoords ,
            this.geometry.type ,
            this.geometry.normalize ,
            this.geometry.stride ,
            this.geometry.offset
        ) ;

        gl.bindBuffer(gl.ARRAY_BUFFER, null) ;
        gl.bindVertexArray(null) ;

/*------------------------------------------------------------------------
 * framebuffer
 *------------------------------------------------------------------------
 */
        /* creating framebuffers for renderTargetOutput */
        if ( options.targets != undefined ){
            options.renderTargets = options.targets  ;
        }

        if ( options.renderTargets != undefined ){
            this.framebuffer = gl.createFramebuffer() ;
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.framebuffer) ;
            for (var tName in options.renderTargets){
                this.noRenderTargets++ ;
                var rTarget = options.renderTargets[tName] ;
                this.renderTargetNames.push(tName) ;
                this.renderTargets[tName] = rTarget ;
                var loc = rTarget.location ;
                var tgt = rTarget.target ;

                this.drawBuffers.push(gl.COLOR_ATTACHMENT0+loc) ;

                gl.framebufferTexture2D(
                    gl.DRAW_FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0+loc,
                    gl.TEXTURE_2D,
                    tgt.texture,
                    0
                ) ;

            }
            gl.drawBuffers(this.drawBuffers) ;

            var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER) ;
            if (status != gl.FRAMEBUFFER_COMPLETE) {
                console.log('fb status: ' + status);
            }
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null) ;
        }

/*------------------------------------------------------------------------
 * Setting up uniforms
 *------------------------------------------------------------------------
 */
        if (options.uniforms != undefined ){
            for(var uname in options.uniforms ){
                var uopts = options.uniforms[uname] ; /* uniform options */
                uopts.solver = this ;
                uopts.name = uname ;
                this.noUniforms += 1 ;
                this.uniforms[uname] = new Uniform(uopts) ;
             }
        }
    
/*------------------------------------------------------------------------
 * canvas
 *------------------------------------------------------------------------
 */
        if (options.canvas != undefined ){
            this.canvas = options.canvas ;
            this.canvasTarget = true ;
            this.context = this.canvas.getContext('2d') ;
        }

        if ((this.canvasTarget == false)&&(this.framebuffer == null)){
            if (this.canvas != undefined ){
                this.context = this.canvas.getContext('2d') ;
            }
        }

    } 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    set program(np){
        this._program = np ;
    }

    get program(){
        return this._program.pointer ;
    }

    get prog(){
        return this.program ;
    }

    useProgram(){
        gl.useProgram(this.program) ;
        return ;
    }

    get fragmentShader(){
        return this._fragmentShader ;
    }

    set fragmentShader(nfsrc){
        this.fragmentShader.source = nfsrc ;
        this._program.link() ;
        this.resendUniforms() ;
    }

    get vertexShader(){
        return this._vertexShader ;
    }

    set vertexShader(nvsrc){
        this.vertexShader.source = nvsrc ;
        this._program.link() ;
        this.resendUniforms() ;
    }
/*------------------------------------------------------------------------
 * setUniform
 *------------------------------------------------------------------------
 */
    setUniform (uniformName, newValue ){
        this.uniforms[uniformName].value = newValue ;
    }

/*------------------------------------------------------------------------
 * resendUniforms
 *------------------------------------------------------------------------
 */
    resendUniforms(){
        for (var uname in this.uniforms){
            this.uniforms[uname].resend() ;
        }
    }

/*------------------------------------------------------------------------
 * setSamplerMinFilter
 *------------------------------------------------------------------------
 */
    setSamplerMinFilter( uname, minFilter ){
        var uniform = this.uniforms[uname] ;
        if (uniform == undefined) return ;
        uniform.minFilter = readGlOption( minFilter, gl.NEAREST ) ;

        this.setUniform(uname) ;
    }

/*------------------------------------------------------------------------
 * setSamplerMagFilter
 *------------------------------------------------------------------------
 */
    setSamplerMagFilter( uname, magFilter ){
        var uniform = this.uniforms[uname] ;
        if (uniform == undefined) return ;
        uniform.magFilter = readGlOption( magFilter, gl.NEAREST ) ;
        this.setUniform(uname) ;
    }

/*------------------------------------------------------------------------
 * setSamplerWrapS
 *------------------------------------------------------------------------
 */
    setSamplerWrapS( uname, wrapS ){
        var uniform = this.uniforms[uname] ;
        if (uniform == undefined ) return ;
        uniform.wrapS = readGlOption( wrapS, gl.CLAMP_TO_EDGE ) ;
        this.setUniform(uname) ;
    }

/*------------------------------------------------------------------------
 * setSamplerWrapT
 *------------------------------------------------------------------------
 */
    setSamplerWrapT( uname, wrapT ){
        var uniform = this.uniforms[uname] ;
        if (uniform == undefined ) return ;
        uniform.wrapT = readGlOption( wrapT, gl.CLAMP_TO_EDGE ) ;
        this.setUniform(uname) ;

        this.setUniform(uname) ;
    }

/*------------------------------------------------------------------------
 * setRenderTarget
 *------------------------------------------------------------------------
 */
    setRenderTarget(tName, target){
        this.renderTargets[tName].target = target ;
        var loc = this.renderTargets[tName].location ;
        gl.bindFramebuffer(
            gl.DRAW_FRAMEBUFFER,
            this.framebuffer
        ) ;
        gl.framebufferTexture2D(
            gl.DRAW_FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0+loc,
            gl.TEXTURE_2D,
            this.renderTargets[tName].target.texture,
            0
        ) ;

        gl.bindFramebuffer(
            gl.DRAW_FRAMEBUFFER,
            null
        ) ;
    }

/*------------------------------------------------------------------------
 * render
 *------------------------------------------------------------------------
 */
    render(renderOptions){
        this.useProgram() ;
        if ( this.depthTest ){
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.DEPTH_BUFFER_BIT);
        }else{
            gl.disable(gl.DEPTH_TEST) ;
        }

        if ( this.cullFacing ){
            gl.enable(gl.CULL_FACE);
            gl.cullFace(this.cullFace);
        }else{
            gl.disable(gl.CULL_FACE) ;
        }
        if ( this.noTextureUniform < 1){
            gl.activeTexture( gl.TEXTURE0 ) ;
            gl.bindTexture( gl.TEXTURE_2D, null ) ;
        }else{
           // gl.enable( gl.TEXTURE_2D ) ;
        }

        /* binding textures and color attachments */
        for ( var tName in this.textureUniforms ){
            var activeNumber = this.textureUniforms[tName].activeNumber ;
            gl.activeTexture(
                gl.TEXTURE0+activeNumber
            ) ;
            gl.bindTexture(
                gl.TEXTURE_2D,
                this.textureUniforms[tName].value.texture
            );
            if (this.textureUniforms[tName].sampler){
                gl.bindSampler(
                    this.textureUniforms[tName].activeNumber,
                    this.textureUniforms[tName].sampler
                ) ;
            }
        }

        if ( this.noRenderTargets < 1 ){
            if ((this.canvas.width != gl.canvas.width)||
                (this.canvas.height != gl.canvas.height)){
                gl.canvas.width  = this.canvas.width ;
                gl.canvas.height = this.canvas.height ;
            }
            gl.viewport(0,0,this.canvas.width, this.canvas.height) ;
        }else{
            var tName = this.renderTargetNames[0] ;
            var target = this.renderTargets[tName].target ;
           //  if ( gl.canvas.width != target.width ||
           //      gl.canvas.height!= target.height )
                gl.viewport(0,0,target.width,target.height) ;
        }
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        if (this.clear){
            gl.clearColor(
                this.clearColor[0],
                this.clearColor[1],
                this.clearColor[2],
                this.clearColor[3]
            );
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        if (this.noRenderTargets < 1){
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

            if (this.clear){
                gl.clearColor(
                    this.clearColor[0],
                    this.clearColor[1],
                    this.clearColor[2],
                    this.clearColor[3]
                );
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        }else{
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer ) ;
            for ( var tName in this.renderTargets ){
                var rTarget = this.renderTargets[tName] ;
                var loc = rTarget.location ;
                var tgt = rTarget.target ;
                gl.framebufferTexture2D(
                        gl.DRAW_FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0+loc,
                        gl.TEXTURE_2D,
                        tgt.texture, 0              ) ;
            }
            gl.drawBuffers(this.drawBuffers) ;
        }
        gl.bindVertexArray(this.vao) ;
        gl.lineWidth(this.geometry.width) ;
        gl.drawArrays(  this.geometry.premitive ,
                        this.geometry.offset ,
                        this.geometry.noVertices    );

        if ( this.canvasTarget ){
            if (this.clear){
                this.context.clearRect(
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                ) ;
            }
            this.context.drawImage(
                gl.canvas,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            ) ;
        }
    }

/*------------------------------------------------------------------------
 * delete
 *------------------------------------------------------------------------
 */
    deleteMe(){
        this._program.deleteMe() ;
        this._vertexShader.deleteMe() ;
        this._fragmentShader.deleteMe() ;
        gl.deleteBuffer(this.positionBuffer) ;
        gl.deleteFramebuffer(this.framebuffer) ;
        delete this ;
        return ;
    }
}

/*========================================================================
 * LineGeometry
 *========================================================================
 */
class LineGeometry{
    constructor(noPltPoints){
        this.vertices = [] ;
        for (var i=0; i<noPltPoints ; i++ ){
            this.vertices.push( 0.5/noPltPoints+i/noPltPoints,0.5,0) ;
        }
        this.premitive = 'line_strip' ;
        this.noCoords = 3 ;
        this.width = 1 ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
}

/*========================================================================
 * UnitCubeFrameGeometry
 *========================================================================
 */
class UnitCubeFrameGeometry{
    constructor(){
        this.vertices = [
            0,0,0,
            0,0,1,

            0,0,0,
            1,0,0,

            1,0,0,
            1,0,1,

            1,0,0,
            1,1,0,

            1,1,0,
            1,1,1,

            1,1,0,
            0,1,0,

            0,1,0,
            0,0,0,

            0,1,0,
            0,1,1,

            0,0,1,
            1,0,1,

            1,0,1,
            1,1,1,

            1,1,1,
            0,1,1,

            0,1,1,
            0,0,1,

            ] ;
        this.noCoords = 3 ;
        this.premitive = 'lines' ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
}

/*========================================================================
 * UnitCubeGeometry     :   Constructor for a unit cube geometry
 *                          where x, y, and z line in [0,1]
 *========================================================================
 */
class UnitCubeGeometry{
    constructor(){
        this.vertices = [
            /* ~~~~~~~~~~~~~~~~ */
            /* Front PLANE      */
            /* ~~~~~~~~~~~~~~~~ */
            // 1F
            0,0,1,  // 1
            1,0,1,  // 2
            0,1,1,  // 4

            // 2F
            0,1,1,  // 4
            1,0,1,  // 2
            1,1,1,  // 3

            /* ~~~~~~~~~~~~~~~~ */
            /* RIGHT PLANE      */
            /* ~~~~~~~~~~~~~~~~ */
            // 3R
            1,1,1,  // 3
            1,0,1,  // 2
            1,1,0,  // 7

            // 4R
            1,1,0,  // 7
            1,0,1,  // 2
            1,0,0,  // 5

            /* ~~~~~~~~~~~~~~~~ */
            /* BOTTOM PLANE     */
            /* ~~~~~~~~~~~~~~~~ */
            // 5B
            1,0,0,  // 5
            1,0,1,  // 2
            0,0,0,  // 6

            // 6B
            0,0,0,  // 6
            1,0,1,  // 2
            0,0,1,  // 1

            /* ~~~~~~~~~~~~~~~~ */
            /* LEFT PLANE       */
            /* ~~~~~~~~~~~~~~~~ */
            // 7L
            0,0,1,  // 1
            0,1,1,  // 4
            0,0,0,  // 6

            // 8L
            0,0,0,  // 6
            0,1,1,  // 4
            0,1,0,  // 8

            /* ~~~~~~~~~~~~~~~~ */
            /* TOP PLANE        */
            /* ~~~~~~~~~~~~~~~~ */
            // 9T
            0,1,0,  // 8
            0,1,1,  // 4
            1,1,1,  // 3

            // 10T
            1,1,1,  // 3
            1,1,0,  // 7
            0,1,0,  // 8

            /* ~~~~~~~~~~~~~~~~ */
            /* BACK PLANE       */
            /* ~~~~~~~~~~~~~~~~ */
            // 11B
            0,1,0,  // 8
            1,1,0,  // 7
            0,0,0,  // 6

            // 12B
            0,0,0,  // 6
            1,1,0,  // 7
            1,0,0,  // 5
        ] ;

        this.noCoords = 3 ;
        this.premitive = 'triangles' ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
}


/*========================================================================
 * Get Channel Multiplier
 *========================================================================
 */
function getChannelMultiplier(cnl){
    var mltplier = [0,0,0,0] ;
    switch (cnl){
        case 'r':
            mltplier[0]=1 ;
            break ;
        case 'g':
            mltplier[1]=1 ;
            break ;
        case 'b':
            mltplier[2]=1 ;
            break ;
        case 'a':
            mltplier[3]=1 ;
            break ;
        default:
            mltplier[0]=1 ;
            break ;
    }
    return mltplier  ;
}

/*========================================================================
 * Signal       : signal structure
 * renderer     : renderer to be used to render the signal
 * camera       : computational camera to be used
 * SampleTarget : target to be sampled
 * noPltPoints  : number of the points on the signal curve
 *
 * options      :
 *      -   channel         : r,g,b,a
 *      -   probePosition   : position of the probe
 *      -   timeWindow      : timeWindow to be plotted
 *      -   minValue        : minimum value on the vertical axis
 *      -   maxValue        : maximum value on the vertical axis
 *      -   restValue       : rest value of the signal
 *      -   color           : color of the curve to be plotted
 *      -   visiblity       : "true" or "false"
 *      -   linewidth       : linewidth of the signal
 *      -   callback        : callback function
 *========================================================================
 */
class Signal{
    constructor(SampleTarget,noPltPoints=512,options={}){

/*------------------------------------------------------------------------
 * Initial values
 *------------------------------------------------------------------------
 */
        this.cgl        = cgl ;
        this.sample     = SampleTarget ;
        this.noPltPoints= noPltPoints ;
        this.pltTime    = 0. ;
        this.lineGeom   = new LineGeometry(this.noPltPoints) ;

        /* reading options */
        this.minValue   = readOption(options.minValue,  0               ) ;
        this.maxValue   = readOption(options.maxValue,  1               ) ;
        this.restValue  = readOption(options.restValue, 0               ) ;
        this.timeWindow = readOption(options.timeWindow,1000            ) ;
        this.linewidth  = readOption(options.linewidth, 1               ) ;
        this.probePosition = readOption( options.probePosition,[0.5,0.5]) ;
        this.color      = readOption(options.color,     [0,0,0]         ) ;
        this.channel    = readOption(options.channel,   'r'             ) ;
        this.visible    = readOption(options.visible,   true            ) ;
        this.callback   = readOption(options.callback, function(){}     ) ;
        this.name       = readOption(options.name   , 'val'             ) ;

        this.lineGeom.width = this.linewidth ;
        this.channelMultiplier = getChannelMultiplier(this.channel) ;

/*------------------------------------------------------------------------
 * renderTargets
 *------------------------------------------------------------------------
 */
        this.ccrr = new Float32Texture( this.noPltPoints, 1 ) ;
        this.cprv = new Float32Texture( this.noPltPoints, 1 ) ;

/*------------------------------------------------------------------------
 * hist
 *------------------------------------------------------------------------
 */
        this.hist = new Solver(     {
            uniforms: {
                probePosition : { type: "v2", value: this.probePosition } ,
                surf    : { type: 't',  value: this.sample              } ,
                curv    : { type: 't',  value: this.ccrr                } ,
                shift   : { type: "f",  value: 0.025                    } ,
                channel : { type: "v4", value: this.channelMultiplier   } ,
            } ,
            vertexShader:   DefaultVertexShader.value,
            fragmentShader: histShader.value,
            renderTargets:
                {
                    ourColor : { location : 0 , target : this.cprv   } ,
                }
        } ) ;

/*------------------------------------------------------------------------
 * scaleTimeWindow
 *------------------------------------------------------------------------
 */
        this.scaleTimeWindow = new Solver( {
                vertexShader    : DefaultVertexShader.value ,
                fragmentShader  : sctwShader.value ,
                uniforms        : {
                    map         : { type : 's', value : this.ccrr,
                     minFilter : 'linear', magFilter : 'linear' } ,
                    oldWindow   : { type: 'f', value : this.timeWindow  } ,
                    newWindow   : { type: 'f', value : this.timeWindow  } ,
                } ,
                renderTargets   : {
                    FragColor   : { location : 0 , target : this.cprv   } ,
                } ,
                clear   : true ,
        } ) ;

/*------------------------------------------------------------------------
 * wA2b
 *------------------------------------------------------------------------
 */
        this.wA2b = new Solver(   {
            uniforms:{
                map: { type: 't', value: this.cprv }
            },
            vertexShader  : DefaultVertexShader.value,
            fragmentShader: wA2bShader.value,
            renderTargets:{
                outColor : { location :0, target : this.ccrr }
            }
        } ) ;

/*------------------------------------------------------------------------
 * iplt
 *------------------------------------------------------------------------
 */
        this.iplt = new Solver(   {
            uniforms: {
                restValue: {type: 'f', value: this.restValue }
            },
            vertexShader    : DefaultVertexShader.value,
            fragmentShader  : ipltShader.value,
            renderTargets   : {
                FragColor1  : { location : 0, target : this.cprv     } ,
                FragColor2  : { location : 1, target : this.ccrr     } ,
            }
        } ) ;

/*------------------------------------------------------------------------
 * line : signal line
 *------------------------------------------------------------------------
 */
        this.line = new Solver({
                vertexShader    : lvtxShader.value,
                fragmentShader  : lfgmShader.value,
                uniforms    : {
                    minValue:   { type: 'f',  value: this.minValue      } ,
                    maxValue:   { type: 'f',  value: this.maxValue      } ,
                    map     :   { type: 't',  value: this.ccrr          } ,
                    color   :   { type: 'v3', value: this.color         } ,
                    visible :   { type: 'f',  value: this.visible       } ,
                } ,
                geometry : this.lineGeom,
                clear    : false,
                clearColor : [0.,0.,0.,0.] ,
        } ) ;

    } 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * initialize signal
 *------------------------------------------------------------------------
 */
    init(currTime){
        if (currTime != undefined ){
            this.pltTime = currTime ;
        }
        this.iplt.render() ;
        this.hist.setUniform('shift',0) ;
        this.hist.render() ;
        this.wA2b.render() ;
    }

/*------------------------------------------------------------------------
 * update signal
 *------------------------------------------------------------------------
 */
    update(currTime){
        var timeDiff = currTime-this.pltTime ;
        var shift = timeDiff/this.timeWindow ;
        if ( shift>= 1.0/this.noPltPoints) {
            this.callback() ;
            this.hist.setUniform('shift', shift) ;
            this.hist.render() ;
            this.wA2b.render() ;
            this.pltTime = currTime ;
        }
        return ;
    }

/*------------------------------------------------------------------------
 * update time window of the signal
 *------------------------------------------------------------------------
 */
    updateTimeWindow(timeWindow){
        var oldWindow = this.timeWindow ;
        this.scaleTimeWindow.setUniform('oldWindow',oldWindow       ) ;
        this.scaleTimeWindow.setUniform('newWindow',timeWindow      ) ;
        this.timeWindow = timeWindow ;
        this.scaleTimeWindow.render() ;
        this.wA2b.render() ;
        this.hist.setUniform('shift',0) ;
        this.hist.render() ;
        this.wA2b.render() ;
        this.render() ;
        return ;
    }

/*------------------------------------------------------------------------
 * set channel
 *------------------------------------------------------------------------
 */
    setChannel(c){
        this.channel = c ;
        this.channelMultiplier = getChannelMultiplier(c) ;

        this.hist.setUniform('channel', this.channelMultiplier) ;
    }

/*------------------------------------------------------------------------
 * set pobe position for the signal
 *------------------------------------------------------------------------
 */
    setProbePosition(probePosition){
        this.init(this.pltTime) ;
        this.probePosition = probePosition ;
        this.hist.setUniform('probePosition',this.probePosition) ;
        return ;
    }

/*------------------------------------------------------------------------
 * get prob position for the signal
 *------------------------------------------------------------------------
 */
    getProbePosition(){
        return this.probePosition ;
    }

/*------------------------------------------------------------------------
 * set the minimum value on the vertical-axis of the signal plot
 *------------------------------------------------------------------------
 */
    setMinValue(minValue){
        this.minValue = minValue ;
        this.line.setUniform('minValue', this.minValue) ;
        return ;
    }

/*------------------------------------------------------------------------
 * set the maximum value on the vertical-axis of the signal pot
 *------------------------------------------------------------------------
 */
    setMaxValue(maxValue){
        this.maxValue = maxValue ;
        this.line.setUniform('maxValue', this.maxValue);
        return ;
    }

/*------------------------------------------------------------------------
 * set the rest (default) value of the signal
 *------------------------------------------------------------------------
 */
    setRestValue(restValue){
        this.restValue = restValue ;
        this.iplt.setUniform('restValue', this.restValue );
        return ;
    }

/*------------------------------------------------------------------------
 * set the color of the signal curve
 *------------------------------------------------------------------------
 */
    setColor(color){
        this.color = color  ;
        this.line.setUniform('color',this.color);
        return ;
    }

/*------------------------------------------------------------------------
 * set line width of the signal plot
 *------------------------------------------------------------------------
 */
    setLinewidth(lw){
        this.linewidth = lw ;
        this.lineGeom.width = this.linewidth ;
        this.material.linewidth = this.linewidth ;
        return ;
    }

/*------------------------------------------------------------------------
 * set sample target
 *------------------------------------------------------------------------
 */
    setSampleTarget(ST){
        this.sample = ST ;
        this.hist.setUniform('surf',this.sample) ;
    }

/*------------------------------------------------------------------------
 * reset(Opts)
 *
 * Opt(ion)s :
 *      -   sample      : a render target sampler
 *      -   channel     : r,g,b,a
 *      -   probePosition     : position of the probe
 *      -   timeWindow  : timeWindow to be plotted
 *      -   minValue    : minimum value on the vertical axis
 *      -   maxValue    : maximum value on the vertical axis
 *      -   restValue   : rest value of the signal
 *      -   color       : color of the curve to be plotted
 *      -   linewidth   : linewidth of the signal
 *------------------------------------------------------------------------
 */
    reset(Opts){
        if (Opts != undefined ){
            if ( Opts.minValue != undefined ){
                setMinValue(Opts.minValue) ;
            }
            if ( Opts.maxValue != undefined ){
                setMaxValue(Opts.maxValue) ;
            }
            if ( Opts.restValue != undefined ){
                setRestValue( Opts.restValue) ;
            }
            if ( Opts.probePosition != undefined ){
                setProbePosition( Opts.probePosition ) ;
            }
            if ( Opts.timeWindow != undefined ){
                setTimeWindow( Opts.timeWindow ) ;
            }
            if ( Opts.color != undefined ){
                setColor( Opts.color ) ;
            }
            if ( Opts.linewidth != undefined ){
                setLinewidth( Opts.linewidth ) ;
            }
            if ( Opts.channel != undefined ){
                setChannel(Opts.channel ) ;
            }
            if ( Opts.sample != undefined ) {
                setSampleTarget( Opts.sample ) ;
            }
        }
        this.init() ;
    }

/*------------------------------------------------------------------------
 * hide the signal plot
 *------------------------------------------------------------------------
 */
    hide(){
        this.visible = 0.0 ;
        this.line.setUniform('visible',0.0) ;
    }

/*------------------------------------------------------------------------
 * show the signal plot
 *------------------------------------------------------------------------
 */
    show(){
        this.visible = true ;
        this.line.setUniform('visible',1.0) ;
    }

/*------------------------------------------------------------------------
 * set visiblity of the signal plot
 *------------------------------------------------------------------------
 */
    setVisiblity( flag ){
        this.visible = flag ;
        this.line.setUniform('visible',flag) ;
    }

/*------------------------------------------------------------------------
 * render
 *------------------------------------------------------------------------
 */
    render(){
        if (this.visible > 0.5 ){
            this.line.render() ;
        }
    }
}

/*========================================================================
 * Ticks 
 *========================================================================
 */
class Ticks{
    constructor(opts={}){
        this._ticks = readOption( opts.ticks,   []              ) ;
        this._labels= readOption( opts.labels,  []              ) ;
        this._mode  = readOption( opts.mode,    'off'           ) ;
        this._unit  = readOption( opts.unit,    ''              ) ;
        this._style = readOption( opts.style,   '#000000'       ) ;
        this._font  = readOption( opts.font,    '11pt Times'    ) ;
        this._min   = readOption( opts.min,     0               ) ;
        this._max   = readOption( opts.max,     1               ) ;
        this._precision = readOption( opts.precision, undefined ) ;
        this._number= readOption( opts.number,  10              ) ;
        this._offset= readOption( opts.offset,  .025            ) ;
        this._plot  = readOption( opts.plot,    null            ) ;
        this._callback = function(){
            if (this.plot != null ){
                this.plot.init() ;
            }
        }
        
        this.init() ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    init(){
        if (this.mode == 'manual' ){
            this.number = this.labels.length ;
            if (this.ticks.length != this.labels.length ){
                warn('Number of ticks and tick labels are not equal') ;
            }
        }
        
        if (this.mode == 'auto'){
            var delta = this.delta ;
            var dl    = 1./(this.number+1) ;
            this._ticks = [] ;
            this._labels = [] ;
            for(var i=0 ; i<this.number ;i++){
                var num = delta*(i+1)+this.min ;
                if ( this.precision != undefined ){
                    num = num.toFixed(this.precision) ;
                }
                this.ticks.push( (1+i)*dl );
                this.labels.push(num+this.unit) ;
            }
        }
        this.callback() ;
    }
    
    set callback(nc){
        this._callback = nc ;
    }
    get callback(){
        return this._callback ;
    }

    /* min          */
    set min(nm){
        this._min = nm ;
        this.init() ;
    }
    get min(){
        return this._min ;
        this.init() ;
    }

    /* max          */
    set max(nm){
        this._max = nm ;
        this.init() ;
    }
    get max(){
        return this._max ;
    }

    /* delta        */
    get delta(){
        return (this.max - this.min)/(this.number+1) ;
    }

    /* unit         */
    get unit(){
        return this._unit ;
    }
    set unit(nu){
        this._unit = nu ;
        this.init() ;
    }

    /* mode         */
    set mode(nm){
        this._mode = nm ;
        this.init() ;
    }
    get mode(){
        return this._mode ;
    }

    /* font         */
    get font(){
        return this._font ;
    }
    set font(nf){
        this._font = ft ;
    }

    /* style        */
    get style(){
        return this._style ;
    }
    set style(ns){
        this._style = ns ;
    }
    
    /* precision    */
    set precision(np){
        this._precision = np ;
        this.init() ;
    }
    get precision(){
        return this._precision ;
    }

    /* number       */
    get number(){
        return this._number ;
    }
    set number(nn){
        this._number = nn ;
        this.init() ;
    }

    /* offset       */
    get offset(){
        return this._offset ;
    }
    set offset(no){
        this._offset =  no ;
    }

    /* ticks        */
    get ticks(){
        return this._ticks ;
    }
    set ticks(nt){
        this._ticks = nt ;
        this.number = this._ticks.length ;
        this._mode  = 'auto' ;
        this.init() ;
    }

    /* labels       */
    get labels(){
        return this._labels ;
    }
    set labels(nl){
        this._labels = nl ;
        this.init() ;
    }

    set plot(np){
        this._plot = np ;
    }

    get plot(){
        return this._plot ;
    }

}
/*========================================================================
 * Legened
 *========================================================================
 */ 
class Legend{
    constructor(opts){
        this._location  = readOption(   opts.location, [0.1,0.1]) ;
        this._separation= readOption(   opts.separation, 0.05   ) ;
        this._plot      = readOption(   opts.plot   , null      ) ;
        this._font      = readOption(   opts.font   , '12pt Times') ;
        this._style     = readOption(   opts.style  , "#000000" ) ;
        this._length    = readOption(   opts.length , 0.05      ) ;

        this.callback   = function(){
            if (this._plot != null){
                this._plot.init() ;
            }
        }
        this.visiblity  = readOption(    opts.visible, false     ) ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    get font(){
        return this._font ;
    }

    get length(){
        return this._length ;
    }

    get style(){
        return this._style ;
    }

    set visiblity(v){
        if ( v == true || v == 'on' || v == 'ON' || v == 'On'){
            this._visible = true ;
        }else{
            this._visible = false ;
        }
    }

    set visible(v){
            this.visiblity = v ;
            this.callback() ;
    }

    get visible(){
        return this._visible ;
    }

    get location(){
        return this._location ;
    }

    set location(nl){
        this._location = nl ;
        this.callback() ;
    }

    get separation(){
        return this._separation ;
    }
}

/*========================================================================
 * Message
 *========================================================================
 */
class Message{
    constructor( message, x,y, options){
        this._text = message ;
        this._x  = x ;
        this._y  = y ;

        this._style   = readOption( options.style,    "#000000"       ) ;
        this._font    = readOption( options.font,     "12px Times"    ) ;
        this._visible = readOption( options.visible,  true            ) ;
        this._align   = readOption( options.align ,   'start'         ) ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * x and y
 *------------------------------------------------------------------------
 */
    set x(xn){
        this._x = xn ;
    }
    get x(){
        return this._x ;
    }
    set y(yn){
        this._y = yn ;
    }
    get y(){
        return this._y ;
    }
  
/*------------------------------------------------------------------------
 * Font
 *------------------------------------------------------------------------
 */
    set font(ft){
        this._font = ft ;
    }
    get font(){
        return this._font ;
    }

    setFont(f){
        this.font   = readOption(font,      this._font   ) ;
    }

/*------------------------------------------------------------------------
 * setStyle
 *------------------------------------------------------------------------
 */
    set style(st){
        this._style = st ;
    }

    get style(){
        return this._style ;
    }

    setStyle(st){
        this.style  = readOption(st,    this._style  ) ;
    }

/*------------------------------------------------------------------------
 * setAlign
 *------------------------------------------------------------------------
 */
    set align(al){
        this._align = al ;
    }
    get align(){
        return this._align ;
    }
    setAlign(al){
        this.align  = readOption(al,     this._align  ) ;
    }

/*------------------------------------------------------------------------
 * setText
 *------------------------------------------------------------------------
 */
    set text(tx){
        this._text = tx ;
    }
    
    get text(){
        return this._text ;
    }

    setText(t){
        this.text = readOption(t, this._text) ;
    }
/*------------------------------------------------------------------------
 * 
 *------------------------------------------------------------------------
 */
    set visible(vs){
        this._visible = vs ;
    }
    get visible(){
        return this._visible  ;
    }

/*------------------------------------------------------------------------
 * hide
 *------------------------------------------------------------------------
 */
    hide(){
        this.visible = false ;
    }

/*------------------------------------------------------------------------
 * show
 *------------------------------------------------------------------------
 */
    show(){
        this.visible = true ;
    }

/*------------------------------------------------------------------------
 * setVisiblity
 *------------------------------------------------------------------------
 */
    setVisiblity( visible ){
        this.visible = readOption( visible, this._visible ) ;
    }

/*------------------------------------------------------------------------
 * toggleVisible
 *------------------------------------------------------------------------
 */
    toggleVisible(){
        this._visible = !this._visible ;
    }

    toggle(){
        this._visible = !this._visible ;
    }
}

/*=========================================================================
 * SignalPlot( renderer, camera, options )
 *
 * Usage    :   Constructor for plotting. The inputs are as follows
 *
 * renderer :   renderer to be used for all plotting purposes;
 * camera   :   camera to be used for plotting
 * options  :
 *      -   noPlotPoints    :   number of points on each signal curve
 *      -   backgroundColor :   color of plot's background
 *      -   dispWidth       :   number of horizontal pixels of plot
 *      -   dispHeight      :   number of vertical pixels of the plot
 *      -   grid            :   'on', 'off'
 *      -   nx              :   number of horizontal divisions of the grid
 *      -   ny              :   number of vertical divisions of the grid
 *      -   gridColor       :   color of the grid
 *      -   xticks          :   array of xticks
 *      -   yticks          :   array of yticks
 *      -   callback        :   callback function
 *=========================================================================
 */
class SignalPlot{
    constructor(pltOptions={}){
        this.cgl                = cgl ;
        this.gl                 = cgl.gl ;

        this.canvasTarget   = false ;
        this.backgroundColor = readOption(
            pltOptions.backgroundColor,
            [0,0,0,0]
        ) ;

        this.noSignals = 0 ;
        this.signals = [] ;

        this.noPlotPoints = readOption( pltOptions.noPltPoints, 512 ) ;
        this.grid       = readOption( pltOptions.grid, 'off'        ) ;
        this.nx         = readOption( pltOptions.nx ,   5           ) ;
        this.ny         = readOption( pltOptions.ny ,   5           ) ;
        this.gridColor  = readOption( pltOptions.gridColor,'#999999') ;
        this.gridDash   = readOption( pltOptions.gridDash, [10,10]  ) ;
        this.dispWidth  = readOption( pltOptions.dispWidth, 512     ) ;
        this.dispHeight = readOption( pltOptions.dispHeight,512     ) ;

        this.canvas     = readOption( pltOptions.canvas, undefined  ) ;
        if (this.canvas != undefined ){
            this.context = this.canvas.getContext('2d') ;
        }

        this.container  = readOption( pltOptions.container, undefined ) ;
        this.callback   = readOption( pltOptions.callback, function(){} ) ;

        this.xticks = new Ticks( pltOptions.xticks ) ;
        this.xticks.number = this.nx-1 ;

        this.yticks = new Ticks( pltOptions.yticks ) ;
        this.yticks.number = this.ny-1 ;


        this.legendOptions = readOption( pltOptions.legend, {visible: false, place: 'top-right'} ) ;

        if ( ( this.container != undefined ) &&
                (this.canvas != undefined ) ){
            this.canvasTarget = true ;
        }
        
/*-------------------------------------------------------------------------
 * Grid and Background
 *-------------------------------------------------------------------------
 */
        this.bcanvas = document.createElement('canvas') ;
        this.bcanvas.width = this.canvas.width ;
        this.bcanvas.height = this.canvas.height ;
        this.bcontext= this.bcanvas.getContext('2d') ;

/*------------------------------------------------------------------------
 * addMessage
 *------------------------------------------------------------------------
 */
        this.messages = [] ;
    
/*------------------------------------------------------------------------
 * initTitle
 *------------------------------------------------------------------------
 */
        var titleOptions = readOption( pltOptions.title, {} ) ;
        this.title = {} ;
        this.title.text = readOption(titleOptions.text, '' ) ;
        this.title.x = readOption( titleOptions.x , 0.5  ) ;
        this.title.y = readOption( titleOptions.y , 0.05 ) ;
        this.title.style = readOption( titleOptions.style,  "#000000"   ) ;
        this.title.font = readOption( titleOptions.font, '12pt Times'   ) ;
        this.title.visible = readOption( titleOptions.visible, true     ) ;
        this.title.align = readOption( titleOptions.align, 'center'     ) ;
        this.messages.push( this.title ) ;

/*------------------------------------------------------------------------
 * legend
 *------------------------------------------------------------------------
 */
        this.legendOptions.plot = this ;
        this.legend = new Legend( this.legendOptions ) ;
    } 

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * addMessage
 *------------------------------------------------------------------------
 */
    addMessage ( message, x, y, options){
        var msg = new Message( message,x,y, options) ;
        this.messages.push(msg) ;
        this.initBackground() ;
        return msg ;
    }

/*------------------------------------------------------------------------
 * setTitle
 *------------------------------------------------------------------------
 */
    setTitle(text, options={}){
        this.title.text = text ;
        this.title.x    = readOption( options.x , this.title.x         ) ;
        this.title.y    = readOption( options.y , this.title.y         ) ;
        this.title.style= readOption( options.style, this.title.style  ) ;
        this.title.font = readOption( options.font,  this.title.font   ) ;
        this.title.visible = readOption( options.visible,
                this.title.visible ) ;
        this.title.align= readOption( options.align,this.title.align  ) ;

        this.messages.push( this.title ) ;
        this.initBackground() ;
        this.render() ;
    }


/*------------------------------------------------------------------------
 * writeMessages
 *------------------------------------------------------------------------
 */
    writeMessages(){
        for (var i=0 ; i < this.messages.length; i++){
            var message = this.messages[i] ;
            if (message.visible){
                this.bcontext.font = message.font ;
                this.bcontext.fillStyle = message.style ;
                this.bcontext.textAlign = message.align ;
                this.bcontext.fillText( message.text,
                                        this.canvas.width*message.x,
                                        this.canvas.height*message.y );
            }
        }
    }

/*------------------------------------------------------------------------
 * setXTicks
 *------------------------------------------------------------------------
 */
    setXTicks(xt){
        if ( xt.ticks != undefined ){
            this.xticks.ticks = xt.ticks ;
        }
        if ( xt.mode != undefined ){
            this.xticks.mode = xt.mode ;
        }
        if ( xt.unit != undefined ){
            this.xticks.unit = xt.unit ;
        }
        if ( xt.style != undefined ){
            this.xticks.style = xt.style ;
        }
        if ( xt.font != undefined ){
            this.xticks.font = xt.font ;
        }
        this.initBackground() ;
    }

/*------------------------------------------------------------------------
 * setYTicks
 *------------------------------------------------------------------------
 */

    setYTicks (yt){
        if ( yt.ticks != undefined ){
            this.yticks.ticks = yt.ticks ;
        }
        if ( yt.mode != undefined ){
            this.yticks.mode = yt.mode ;
        }
        if ( yt.unit != undefined ){
            this.yticks.unit = yt.unit ;
        }
        if ( yt.style != undefined ){
            this.yticks.style = yt.style ;
        }
        if ( yt.font != undefined ){
            this.yticks.font = yt.font ;
        }
        if ( yt.min != undefined ){
            this.yticks.min = yt.min ;
        }
        if ( yt.max != undefined ){
            this.yticks.max = yt.max ;
        }
        this.initBackground() ;
    }

/*------------------------------------------------------------------------
 * writeTicks
 *------------------------------------------------------------------------
 */
    writeTicks(){
        if (this.xticks.mode != 'off' ){
            this.bcontext.font = this.xticks.font ;
            this.bcontext.fillStyle = this.xticks.style ;
            this.bcontext.textAlign = "center" ;
            for (var i=1; i<=this.xticks.number ;i++){
                var dx = this.canvas.width / (this.xticks.number+1)
                var dy = this.canvas.height/ (this.ny) ;
                this.bcontext.fillText(
                    this.xticks.labels[i-1] ,
                    i*dx,
                    this.canvas.height*(1.-this.xticks.offset) 
                ) ;
            }
        }
        if ( this.yticks.mode != 'off' ){
            this.bcontext.font = this.yticks.font ;
            this.bcontext.fillStyle = this.yticks.style ;
            this.bcontext.textAlign = "start" ;
            for (var i=1; i<=this.yticks.number ;i++){
                var dy = this.canvas.height
                        /(this.yticks.number+1) ;

                this.bcontext.fillText(
                    this.yticks.labels[i-1],
                    this.yticks.offset*this.canvas.width,
                    this.canvas.height-i*dy
                ) ;
            }
        }
    }
/*------------------------------------------------------------------------
 * processLegends
 *------------------------------------------------------------------------
 */
    processLegends(){
        if ( !this.legend.visible ){
            return ;
        }
        var loc = this.legend.location ;
        var x0 = loc[0]*this.canvas.width ;
        var y0 = loc[1]*this.canvas.height ;
        var j = 0 ;    
        for(var i=0 ; i <this.noSignals ;i++){
            this.bcontext.beginPath() ;
            this.bcontext.setLineDash([]) ;
            if ( this.signals[i].visible ){
                var color = this.signals[i].color ;
                this.bcontext.strokeStyle = "#"+fullColorHex(color) ;
                this.bcontext.lineWidth=this.signals[i].linewidth ;
                var x = x0 ;
                var y = y0+j*this.legend.separation*this.canvas.height ;
                this.bcontext.moveTo(x,y) ;

                x = x + this.legend.length*this.canvas.width ;
                this.bcontext.lineTo(x,y) ;
                this.bcontext.stroke() ;

                this.bcontext.font = this.legend.font ;
                this.bcontext.fillStyle = this.legend.style ;
                this.bcontext.textAlign = 'left' ;
                this.bcontext.fillText(this.signals[i].name, x+10,y) ;
                j++ ;
            }
        }
    }

/*------------------------------------------------------------------------
 * initBackground
 *------------------------------------------------------------------------
 */
    initBackground (){
        this.bcontext.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
        if ( this.grid == 'on' ){
            this.bcontext.beginPath() ;
            this.bcontext.setLineDash(this.gridDash) ;
            this.bcontext.strokeStyle= this.gridColor ;
            this.bcontext.lineWidth = 1 ;
            var dx = this.canvas.width / (this.nx) ;
            var dy = this.canvas.height/ (this.ny) ;
            for (var i=1; i<this.nx ; i++){
                this.bcontext.strokeStyle=this.gridColor ;
                this.bcontext.moveTo(i*dx,0) ;
                this.bcontext.lineTo(i*dx,this.canvas.height) ;
                this.bcontext.stroke() ;
            }
            for (var j=1; j<this.ny ; j++){
                this.bcontext.strokeStyle=this.gridColor ;
                this.bcontext.moveTo(0,j*dy) ;
                this.bcontext.lineTo(this.canvas.width,j*dy) ;
                this.bcontext.stroke() ;
            }
        }

        this.processLegends() ;
        this.writeTicks() ;
        this.writeMessages() ;
    }

/*-------------------------------------------------------------------------
 * Signals
 *-------------------------------------------------------------------------
 */
    
/*------------------------------------------------------------------------
 * addSignal(SampleTarget, options)
 *
 * Usage    :   Adds a signal to the plot. The inputs are as follows:
 *
 * SampleTarget : target to be sampled
 * options      :
 *      -   channel         : r,g,b,a
 *      -   probePosition   : position of the probe
 *      -   timeWindow      : timeWindow to be plotted
 *      -   minValue        : minimum value on the vertical axis
 *      -   maxValue        : maximum value on the vertical axis
 *      -   restValue       : rest value of the signal
 *      -   color           : color of the curve to be plotted
 *      -   visiblity       : "true" or "false"
 *      -   linewidth       : linewidth of the signal
 *------------------------------------------------------------------------
 */
    addSignal (SampleTarget, options){
        var newSignal = new Signal(
                    SampleTarget,
                    this.noPltPoints,
                    options ) ;
        this.signals.push( newSignal ) ;
        this.noSignals ++ ;
        this.yticks.min = newSignal.minValue ;
        this.yticks.max = newSignal.maxValue ;
        this.timeWindow = newSignal.timeWindow ;
        this.xticks.max = this.timeWindow ;
        this.initBackground() ;
        return newSignal ;
    }

/*------------------------------------------------------------------------
 * setMinValue
 *------------------------------------------------------------------------
 */
    setMinValue (val){
        this.yticks.min = val ;
        this.initBackground() ;
        this.render() ;
    }

/*------------------------------------------------------------------------
 * setMaxValue
 *------------------------------------------------------------------------
 */
    setMaxValue (val){
        this.yticks.max = val ;
        this.initBackground() ;
        this.render() ;
    }


/*------------------------------------------------------------------------
 * update(currTime)
 *
 * Usage    :   update all signals, and set the plot time to currTime
 *------------------------------------------------------------------------
 */
    /* update signals                    */
    update(currTime){
        this.callback() ;
        for(var i=0; i<this.noSignals; i++){
            this.signals[i].update(currTime) ;
        }
        return ;
    }
/*------------------------------------------------------------------------
 * init(currTime)
 *
 * Usage    :   initialize all signals
 *------------------------------------------------------------------------
 */

    /* initialize signals                */
    init(currTime){
        this.initBackground() ;
        if ( currTime != undefined ){
            for(var i=0; i<this.noSignals; i++){
                this.signals[i].init(currTime) ;
            }
        }
        return ;
    }

/*------------------------------------------------------------------------
 * updateTimeWindow(timeWindow)
 *
 * Usage    :   updates timeWindow for all signals
 *------------------------------------------------------------------------
 */
    /* update timeWindow for signals     */
    updateTimeWindow (timeWindow){
        this._timeWindow = timeWindow ;
        for(var i=0; i <this.noSignals; i++){
            this.signals[i].updateTimeWindow(timeWindow) ;
        }
        this.xticks.max = timeWindow ;
        this.initBackground() ;
        this.render() ;
        return ;
    }

    set timeWindow(ntw){
        this.updateTimeWindow(ntw) ;
    }

    get timeWindow(){
        return this._timeWindow ;
    }
/*------------------------------------------------------------------------
 * setProbePosition(probePosition)
 *
 * Usage    :   set the probe position for all signals to probePosition
 *------------------------------------------------------------------------
 */
    /* set probe position for signals    */
    setProbePosition (probePosition){
        for(var i=0; i <this.noSignals; i++){
            this.signals[i].setProbePosition(probePosition) ;
        }
        this.init() ;
        return ;
    }

/*------------------------------------------------------------------------
 * getProbePosition
 *
 * Usage    : returns the position of the signals
 *------------------------------------------------------------------------
 */
    getProbePosition(){
        return this.signals[0].getProbePosition() ;
    }

/*------------------------------------------------------------------------
 * setSize
 *------------------------------------------------------------------------
 */
    setSize ( dispWidth, dispHeight ){
        this.dispWidth = dispWidth ;
        this.dispHeight = dispHeight ;
        this.bgrnd.setSize( this.dispWidth, this.dispHeight ) ;
    }

/*------------------------------------------------------------------------
 * render([renderTarget,[forceClear])
 *
 * Usage        :   render the plot
 *
 * renderTarget :   target if the render if other than screen
 * forceClear   :   boolean asking the renderer to clear the output
                    before rendering. Default: false
 *------------------------------------------------------------------------
 */
    /* render plot                       */
    render(renderTarget, forceClear){
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
        this.context.drawImage(
            this.bcanvas,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
        gl.bindFramebuffer(
            gl.DRAW_FRAMEBUFFER,
            null
        );
        gl.clear(
            gl.COLOR_BUFFER_BIT
        );

        for(var i=0; i<this.noSignals; i++){
            this.signals[i].render() ;
        }
        this.context.drawImage(
            gl.canvas,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
    } ;

}  /* End of SignalPlot */

/*========================================================================
 * Curve        : Curve Structure
 *
 * options      :
 *      -   channel         : r,g,b,a
 *      -   probePosition   : position of the probe
 *      -   timeWindow      : timeWindow to be plotted
 *      -   minValue        : minimum value on the vertical axis
 *      -   maxValue        : maximum value on the vertical axis
 *      -   restValue       : rest value of the signal
 *      -   color           : color of the curve to be plotted
 *      -   visiblity       : "true" or "false"
 *      -   linewidth       : linewidth of the signal
 *========================================================================
 */
class Curve{
    constructor( SampleTarget,
                xAxisRange,
                options){

/*------------------------------------------------------------------------
 * Initial values
 *------------------------------------------------------------------------
 */
        this.cgl        = cgl ;
        this.sample     = SampleTarget ;
        this.noPltPoints= this.sample.width ;
        this.linewidth  = 2.0 ;
        this.lineGeom   = new LineGeometry(this.noPltPoints) ;
        this.color          = [1,0,0] ;
        this.visible        = 1.0 ;
        this.channel        = 'r' ;

        this.xAxisRange  = xAxisRange ;

        this.localXrange = xAxisRange ;

        this.calcXrange  = function(){
            var ax = this.xAxisRange[1]-this.xAxisRange[0] ;
            var x0 = (this.localXrange[0]-this.xAxisRange[0])/ax ;
            var x1 = (this.localXrange[1]-this.xAxisRange[0])/ax ;
            this.xrange = [x0,x1] ;
        }
        this.calcXrange() ;

        this.yrange     = [0,1] ;

        if ( options != undefined ){
            if (options.xrange != undefined ){
                this.localXrange = options.xrange ;
                this.calcXrange() ;
            }

            if (options.color != undefined ){
                this.color = options.color ;
            }
            if (options.linewidth != undefined ){
                this.linewidth = options.linewidth ;
            }
            if (options.visible != undefined ){
                this.visible = options.visible ;
            }
            if (options.channel != undefined ){
                this.channel = options.channel ;
            }

            if (options.yrange != undefined ){
                this.yrange = options.yrange ;
            }
        }

        this.lineGeom.width = this.linewidth ;
        this.channelMultiplier = getChannelMultiplier(this.channel) ;

/*------------------------------------------------------------------------
 * curve
 *------------------------------------------------------------------------
 */
        this.curve = new Solver({
                vertexShader    : lpvtShader.value,
                fragmentShader  : lfgmShader.value,
                uniforms    : {
                    xrange  :   {
                        type: 'v2',
                        value: this.xrange
                    } ,
                    yrange  :   {
                        type: 'v2',
                        value: this.yrange
                    } ,
                    map     :   {
                        type: 't',
                        value: this.sample
                    } ,
                    channelMultiplier : {
                        type: 'v4',
                        value: this.channelMultiplier
                    } ,
                    color   :   {
                        type: 'v3',
                        value: this.color
                    } ,
                    visible :   {
                        type: 'f',
                        value: this.visible
                    } ,
                } ,
                geometry : this.lineGeom,
                clear    : false,
                clearColor : [0.,0.,0.,0.] ,
        } ) ;

    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * initialize signal
 *------------------------------------------------------------------------
 */
    init(currTime){
        this.curve.render() ;
    }

/*------------------------------------------------------------------------
 * set channel
 *------------------------------------------------------------------------
 */
    setChannel(c){
        this.channel = c ;
        this.channelMultiplier = getChannelMultiplier(c) ;

        this.curve.setUniform('channel', this.channelMultiplier) ;
    }

/*------------------------------------------------------------------------
 * setXAxisRange
 *------------------------------------------------------------------------
 */
    setXAxisRange( xa ){
        this.xAxisRange = xa ;
        this.calcXrange() ;
        this.curve.setUniform('xrange', this.xrange) ;
    }

/*------------------------------------------------------------------------
 * set the range of the vertical axis
 *------------------------------------------------------------------------
 */
    setYRange(yr){
        this.yrange = yr ;
        this.curve.setUniform('yrange', this.yrange) ;
        return ;
    }

/*------------------------------------------------------------------------
 * setXrange
 *------------------------------------------------------------------------
 */
    setXrange (xr){
        this.localXrange = xr ;
        this.calcXrange ;
    }

/*------------------------------------------------------------------------
 * set the color of the signal curve
 *------------------------------------------------------------------------
 */
    setColor(color){
        this.color = color  ;
        this.curve.setUniform('color',this.color);
        return ;
    }

/*------------------------------------------------------------------------
 * set line width of the signal plot
 *------------------------------------------------------------------------
 */
    setLinewidth (lw){
        this.linewidth = lw ;
        this.lineGeom.width = this.linewidth ;
        return ;
    }

/*------------------------------------------------------------------------
 * set sample target
 *------------------------------------------------------------------------
 */
    setSampleTarget (ST){
        this.sample = ST ;
        this.curve.setUniform('map',this.sample) ;
    }

/*------------------------------------------------------------------------
 * hide the signal plot
 *------------------------------------------------------------------------
 */
    hide (){
        this.visible = 0.0 ;
        this.line.setUniform('visible',0.0) ;
    }

/*------------------------------------------------------------------------
 * show the signal plot
 *------------------------------------------------------------------------
 */
    show (){
        this.visible = 1.0 ;
        this.curve.setUniform('visible',1.0) ;
    }

/*------------------------------------------------------------------------
 * set visiblity of the signal plot
 *------------------------------------------------------------------------
 */
    setVisiblity ( flag ){
        this.visible = flag ;
        this.curve.setUniform('visible',flag) ;
    }

/*------------------------------------------------------------------------
 * render
 *------------------------------------------------------------------------
 */
    render (){
        if (this.visible > 0.5 ){
            this.curve.render() ;
        }
    }
} /* End of Curve */

/*========================================================================
 * Plot1D( options )
 *
 * Usage    :   Constructor for plotting 1D lines out of texture of data
 *
 * options  :
 *      -   backgroundColor :   color of plot's background
 *      -   dispWidth       :   number of horizontal pixels of plot
 *      -   dispHeight      :   number of vertical pixels of the plot
 *      -   grid            :   'on', 'off'
 *      -   nx              :   number of horizontal divisions of the grid
 *      -   ny              :   number of vertical divisions of the grid
 *      -   gridColor       :   color of the grid
 *      -   xticks          :   array of xticks
 *      -   yticks          :   array of yticks
 *========================================================================
 */
class Plot1D{
    constructor(pltOptions={}){
        this.cgl                = cgl ;
        this.gl                 = cgl.gl ;
        this.backgroundCollor = readOption(
            pltOptions.backgroundColor,
            [0.,0.,0.,0]
        ) ;
        this.grid       = readOption(pltOptions.grid,    'off'   ) ;
        this.nx         = readOption(pltOptions.nx,      5       ) ;
        this.ny         = readOption(pltOptions.ny,      5       ) ;
        this.gridColor  = readOption(pltOptions.gridColor, '#999999') ;
        this.dispWidth  = readOption(pltOptions.dispWidth, 512   ) ;
        this.dispHeight = readOption(pltOptions.dispHeight,512   ) ;
        this.xrange = readOption(pltOptions.xrange, [0,1]       ) ;
        this.yrange = readOption(pltOptions.yrange, [0,1]       ) ;

        this.canvas = readOption(pltOptions.canvas, null        ) ;
        if ( this.canvas == null ){
            warn( 'No canvas was provided! No destination plot is assumed! '
                + 'No Plot1D can be defined '   ) ;
            delete this ;
            return null ;
        }
        this.context = this.canvas.getContext("2d") ;


        this.xticks = new Ticks( pltOptions.xticks ) ;
        this.yticks = new Ticks( pltOptions.yticks ) ;

        this.canvasTarget   = true ;
        
        this.noCurves = 0 ;
        this.curves = [] ;
        this.messages = [] ;

/*-------------------------------------------------------------------------
 * Grid and Background
 *-------------------------------------------------------------------------
 */
        this.bcanvas = document.createElement('canvas') ;
        this.bcanvas.width = this.canvas.width ;
        this.bcanvas.height = this.canvas.height ;
        this.bcontext= this.bcanvas.getContext('2d') ;

    } 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * addMessage
 *------------------------------------------------------------------------
 */
    addMessage ( message, x, y, options ){
        var msg = new Message( message, x,y, options) ;
        this.messages.push(msg) ;
        this.initBackground() ;
    }

/*------------------------------------------------------------------------
 * writeMessages
 *------------------------------------------------------------------------
 */
    writeMessages (){
        for (var i=0 ; i < this.messages.length; i++){
            var message = this.messages[i] ;
            if (message.visible){
                this.bcontext.font = message.font ;
                this.bcontext.fillStyle = message.style ;
                this.bcontext.textAlign = message.align ;
                this.bcontext.fillText( message.text,
                                        this.canvas.width*message.x,
                                        this.canvas.height*message.y );
            }
        }
    }

/*------------------------------------------------------------------------
 * setTicks
 *------------------------------------------------------------------------
 */
    setTicks (){
        if ( this.xticks.mode == 'auto' ){
            this.xticks.ticks = [] ;
            var dx = (this.xrange[1]-this.xrange[0])/this.nx ;
            for (var i=1 ; i<this.nx ; i++){
                var num = this.xrange[0]+(dx*i) ;
                if( this.xticks.precision != undefined ){
                    num = num.toFixed(this.xticks.precision) ;
                }
                this.xticks.ticks.push(num+ this.xticks.unit ) ;
            }
        }

        if ( this.yticks.mode == 'auto' ){
            var dy = (this.yrange[1]-this.yrange[0])/this.ny ;
            this.yticks.ticks = [] ;
            for (var i=1 ; i<this.ny ; i++){
                var num = (dy*i+this.yrange[0]) ;
                if( this.yticks.precision != undefined ){
                    num = num.toFixed(this.yticks.precision) ;
                }
                this.yticks.ticks.push( num
                + this.yticks.unit );
            }
        }
    }

/*------------------------------------------------------------------------
 * setXTicks
 *------------------------------------------------------------------------
 */
    setXTicks(xt){
        if ( xt.ticks != undefined ){
            this.xticks.ticks = xt.ticks ;
        }
        if ( xt.mode != undefined ){
            this.xticks.mode = xt.mode ;
        }
        if ( xt.unit != undefined ){
            this.xticks.unit = xt.unit ;
        }
        if ( xt.style != undefined ){
            this.xticks.style = xt.style ;
        }
        if ( xt.font != undefined ){
            this.xticks.font = xt.font ;
        }
        this.initBackground() ;
    }

/*------------------------------------------------------------------------
 * setYTicks
 *------------------------------------------------------------------------
 */

    setYTicks (yt){
        if ( yt.ticks != undefined  ){
            this.yticks.ticks = yt.ticks ;
        }
        if ( yt.mode != undefined  ){
            this.yticks.mode = yt.mode ;
        }
        if ( yt.unit != undefined  ){
            this.yticks.unit = yt.unit ;
        }
        if ( yt.style != undefined   ){
            this.yticks.style = yt.style ;
        }
        if ( yt.font != undefined  ){
            this.yticks.font = yt.font ;
        }
        this.initBackground() ;
    }

/*------------------------------------------------------------------------
 * writeTicks
 *------------------------------------------------------------------------
 */
    writeTicks (){
        this.setTicks() ;
        if (this.xticks.mode != 'off' ){
            this.bcontext.font = this.xticks.font ;
            this.bcontext.fillStyle = this.xticks.style ;
            this.bcontext.textAlign = "center" ;
            for (var i=1; i<=this.xticks.ticks.length ;i++){
                var dx = this.canvas.width / (this.xticks.ticks.length+1)
                var dy = this.canvas.height/ (this.ny) ;
                this.bcontext.fillText( 
                        this.xticks.ticks[i-1],
                        i*dx,
                        this.canvas.height*(1.-this.xticks.offset)
                        ) ;
            }
        }
        if ( this.yticks.mode != 'off' ){
            this.bcontext.font = this.yticks.font ;
            this.bcontext.fillStyle = this.yticks.style ;
            this.bcontext.textAlign = "start" ;
            for (var i=1; i<=this.yticks.ticks.length ;i++){
                var dy = this.canvas.height /
                    (this.yticks.ticks.length+1) ;
                this.bcontext.fillText(
                    this.yticks.ticks[i-1],
                    this.canvas.width*this.yticks.offset,
                    this.canvas.height-i*dy
                ) ;
            }
        }
    }

/*------------------------------------------------------------------------
 * initBackground
 *------------------------------------------------------------------------
 */
    initBackground (){
        this.bcontext.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
        if ( this.grid != 'off' & this.grid != false ){
            this.bcontext.setLineDash([10,10]) ;
            this.bcontext.strokeStyle=this.gridColor ;
            var dx = this.canvas.width / (this.nx) ;
            var dy = this.canvas.height/ (this.ny) ;
            for (var i=1; i<this.nx ; i++){
                this.bcontext.moveTo(i*dx,0) ;
                this.bcontext.lineTo(i*dx,this.canvas.height) ;
                this.bcontext.stroke() ;
            }
            for (var j=1; j<this.ny ; j++){
                this.bcontext.moveTo(0,j*dy) ;
                this.bcontext.lineTo(this.canvas.width,j*dy) ;
                this.bcontext.stroke() ;
            }
        }

        this.writeTicks() ;
        this.writeMessages() ;
    }

/*------------------------------------------------------------------------
 * addCurve(SampleTarget, options)
 *
 * Usage    :   Adds a curve to the plot. The inputs are as follows:
 *
 * SampleTarget : target to be sampled
 * options      :
 *      -   channel         : r,g,b,a
 *      -   probePosition   : position of the probe
 *      -   timeWindow      : timeWindow to be plotted
 *      -   minValue        : minimum value on the vertical axis
 *      -   maxValue        : maximum value on the vertical axis
 *      -   restValue       : rest value of the curve
 *      -   color           : color of the curve to be plotted
 *      -   visiblity       : "true" or "false"
 *      -   linewidth       : linewidth of the curve
 *------------------------------------------------------------------------
 */
    addCurve (SampleTarget ,options){
        options.xrange = this.xrange ;
        options.yrange = this.yrange ;
        var newCurve = new Curve(    SampleTarget,
                                    this.xrange,
                                    options ) ;
        this.curves.push( newCurve ) ;
        this.noCurves ++ ;
        return newCurve ;
    }

/*------------------------------------------------------------------------
 * setSize
 *------------------------------------------------------------------------
 */
    setSize ( dispWidth, dispHeight ){
        this.dispWidth = dispWidth ;
        this.dispHeight = dispHeight ;
        this.canvas.width = this.dispWidth  ;
        this.canvas.height = this.dispHeight ;
        this.bcanvas.width = this.dispWidth ;
        this.bcanvas.height = this.dispHeight ;
        this.initBackground() ;
        this.render() ;
    }

/*------------------------------------------------------------------------
 * setXrange
 *------------------------------------------------------------------------
 */
    setXrange (xr){
        this.xrange = xr ;
        this.initBackground() ;

        for(var i=0; i < this.noCurves; i++){
            this.curves[i].setXAxisRange(xr) ;
        }
        this.render() ;
    }
/*------------------------------------------------------------------------
 *
 *------------------------------------------------------------------------
 */
    init (){
        this.initBackground() ;
        for(var i=0; i<this.noCurves; i++){
            this.curves[i].render() ;
        }

        this.render() ;
    }

/*------------------------------------------------------------------------
 * render([renderTarget,[forceClear])
 *
 * Usage        :   render the plot
 *
 * renderTarget :   target if the render if other than screen
 * forceClear   :   boolean asking the renderer to clear the output
                    before rendering. Default: false
 *------------------------------------------------------------------------
 */
    /* render plot                       */
    render (renderTarget, forceClear){
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
        this.context.drawImage(
            this.bcanvas,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
        gl.bindFramebuffer(
            gl.DRAW_FRAMEBUFFER,
            null
        );
        gl.clear(
            gl.COLOR_BUFFER_BIT
        );
        for(var i=0; i<this.noCurves; i++){
            this.curves[i].render() ;
        }
        this.context.drawImage(
            gl.canvas,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ) ;
    } ;

}  /* End of Plot1D */

/*========================================================================
 * imageFromArray 
 *========================================================================
 */ 
function imageFromArray(ar,w,h){
    var canvas=document.createElement("canvas");
    var ctx=canvas.getContext("2d");
    
    // size the canvas to your desired image
    canvas.width=w;
    canvas.height=h;
    var imgData=ctx.getImageData(0,0,w,h);
    var data = imgData.data ;
    var px  ;
    for(var i=0;i<data.length;i++){
        data[i]=ar[i];
    }
    
    ctx.putImageData(imgData,0,0) ;
    var image = new Image() ;
    image.src = canvas.toDataURL() ;
    image.width = w ;
    image.height = h ;
    return image ;
}

/*========================================================================
 * f32FromUint8
 *========================================================================
 */ 
function f32FromUint8(data){
    var dat = new Float32Array(data.length) ;
    for (var i=0 ; i<data.length;i++){
        dat[i] = data[i]/255.0 ;
    }
    return dat ;
}

/*========================================================================
 * Plot2D( renderer, camera, renderTargets, options )
 *
 * Usage    : plots a 2D field in addition to possible tip-trajectories
 *
 * renderer :   renderer to be used for all plotting purposes;
 * camera   :   camera to be used for plotting
 * renderTargets:   [1-2 steps of renderTargets]
 * options  :
 *      -   channel     :   channel to plot         (default='r'        )
 *      -   minValue    :   min. value of the field (default=0          )
 *      -   maxValue    :   max. value of the field (default=1          )
 *      -   colormap    :   name of colormap        (default='rainbowHotSpring'      )
 *      -   tipt        :   plot tip-trajectory?    (default='false'    )
 *      -   tiptColor   :   tip-trajectory color    (default=white      )
 *      -   tiptThreshold:  threshold for tipt      (default=0.5        )
 *      -   tiptThickness:  thickness of tipt       (default=2          )
 *      -   width       :   width of display        (default=512        )
 *      -   height      :   height of display       (default=512        )
 *      -   probePosition:   probe position         (default=(0.5,0.5)  )
 *========================================================================
 */
class Plot2D{
    constructor(options={}){

/*------------------------------------------------------------------------
 * return if no options are defined
 *------------------------------------------------------------------------
 */
        if (options == undefined ){
            delete this ;
            console.log('Options need to be defined') ;
            return undefined ;
        }

/*------------------------------------------------------------------------
 * setting up colormaps
 *------------------------------------------------------------------------
 */
        this.colormapList   = getColormapList() ;
        this.colormaps      = getColormaps(this.colormapList) ;

/*------------------------------------------------------------------------
 * default values
 *------------------------------------------------------------------------
 */
        this.cgl        = cgl ;
        this.gl         = cgl.gl ;

        this.canvasTarget   = false ;

        this._phase          = undefined ;
/*------------------------------------------------------------------------
 * options
 *------------------------------------------------------------------------
 */
        this._target = readOption( options.target, null ) ;
        if ( this._target == null){
            warn('Error : The target to plot needs to be defined!') ;
            return undefined ;
        }
        this._minValue   = readOption(options.minValue,      0           ) ;
        this._maxValue   = readOption(options.maxValue,      1           ) ;
        this._enableMaxColor = readOption(options.enableMaxColor, false  ) ;
        this._enableMinColor = readOption(options.enableMinColor, false  ) ;
        this._maxColor   = readOption(options.maxColor,  [1,1,1,1. ]     ) ;
        this._minColor   = readOption(options.minColor,  [0,0,0,1. ]     ) ;
        this._channel    = readOption(options.channel,       'r'         ) ;
        this._prevTarget = readOption(options.prevTarget,    undefined   ) ;
        this._callback   = readOption(options.callback,      function(){}) ;
        this._clrmName   = readOption(options.colormap,
                'rainbowHotSpring'       ) ;

        this._pltTipt    = readOption(options.tipt ,         false       ) ;
        this._tiptColor  = readOption(options.tiptColor,     [1,1,1]     ) ;
        this._tiptThreshold= readOption(options.tiptThreshold, 0.5       ) ;
        this._tiptThickness = readOptions( options.tiptThickness, 2      ) ;

        this._width      = readOption(options.width,         512         ) ;
        this._height     = readOption(options.height,        512         ) ;
        this._probeVisible = readOption(options.probeVisible, false      ) ;
        this._probePosition= readOption(options.probePosition, [0.5,0.5] ) ;
        this._probeColor = readOption( options.probeColor ,  "#000000"   ) ;
        this._canvas     = readOption( options.canvas,       null        ) ;
        this._unit       = readOption( options.unit ,        ''          ) ;
        this._colorbar   = readOption( options.colorbar,     false       ) ;
        this._phase      = readOption( options.phase,        null        ) ;
        this._phase      = readOption( options.phaseField,   this.phase  ) ;
        this._phaseColor = readOption( options.phaseColor, [1,1,1]       ) ;
        this._background = readOption( options.background,   null        ) ;

        this._cblborder   = readOption( options.cblborder,   40          ) ;
        this._cbrborder   = readOption( options.cbrborder,   40          ) ;

        this._grid       = readOption( options.grid, 'off' ) ;
        this._nx         = readOption( options.nx , 5 ) ;
        this._ny         = readOption( options.ny , 5 ) ;
        this._gridColor  = readOption( options.gridColor , "#999999" ) ;
        this._gridDash   = readOption( options.gridDash  , [10,10]   ) ;
 

        if ( this._canvas != null ){
            this._canvasTarget = true ;
            this.context = this.canvas.getContext("2d");
            this._width = this.canvas.width ;
            this._height = this.canvas.height ;
        }

        if ( this.prevTarget == undefined ){
            this._pltTipt = false ;
        }

        this._channelMultiplier = getChannelMultiplier(this._channel) ;

        this._ftipt  = 
            new Float32Texture( this.target.width, this.target.height ) ;
        this._stipt  = 
            new Float32Texture( this.target.width, this.target.height ) ;
        this._prob   = 
            new Float32Texture( this.target.width, this.target.height ) ;
        this._clrm   = this.colormaps[this.clrmName] ;

        this._messages = [] ;

/*------------------------------------------------------------------------
 * tiptInit solver
 *------------------------------------------------------------------------
 */
        this.tiptInit = new Solver(
                {
                    vertexShader:   DefaultVertexShader.value,
                    fragmentShader: tiptInitShader.value,
                    renderTargets : {
                        ftipt : { location : 0 , target : this.ftipt } ,
                        stipt : { location : 1 , target : this.stipt } ,
                    } ,
                }) ;

/*------------------------------------------------------------------------
 * tipts solver
 *------------------------------------------------------------------------
 */
        if ( this.prevTarget != undefined ){
            this.tipts  = new Solver(
               {
                   vertexShader:   DefaultVertexShader.value,
                   fragmentShader: tiptShader.value,
                   uniforms: {
                      vPrv    : { type: "t",
                                  value: this.prevTarget           } ,
                      vCur    : { type: "t",
                                  value: this.target               } ,
                      tips    : { type: "t",
                                  value: this.stipt                } ,
                      path    : { type: "i",  value: this.pltTipt  } ,

                      /* Potential Threshold */
                      Uth     : { type: "f",
                                  value: this.tiptThreshold        } ,
                      channel : { type : 'v4', 
                                  value: this.channelMultiplier     } ,

                   } ,
                   renderTargets :{
                       ftipt   : { location : 0 , target : this.ftipt} ,
                   } ,
                   clear   : true ,
               } ) ;
        }

/*------------------------------------------------------------------------
 * write stipt to ftipt
 *------------------------------------------------------------------------
 */
        this.stip2ftip = new Solver({
                    vertexShader    : DefaultVertexShader.value,
                    fragmentShader  : wA2bShader.value,
                    uniforms:{
                        map: { type: 't', value: this.ftipt     }
                    },
                    renderTargets : {
                        FragColor : { location : 0 , target : this.stipt} ,
                    }
                } ) ;
/*------------------------------------------------------------------------
 * bcanvas
 *------------------------------------------------------------------------
 */
        this.bcanvas = document.createElement('canvas') ;
        this.bcanvas.width = this.width ;
        this.bcanvas.height = this.height ;
        this.bcontext = this.bcanvas.getContext('2d') ;

/*------------------------------------------------------------------------
 * plot solver
 *------------------------------------------------------------------------
 */
        if ( this.phase != undefined ){
            if (this.background == null ){
            this.plot =
                new Solver(  {
                    vertexShader    : DefaultVertexShader.value,
                    fragmentShader  : dispPhasShader.value,
                    uniforms: {
                        phas    : { type: 's', value: this.phase ,
                            minFilter : 'nearest', magFilter : 'nearest'} ,
                        phaseColor: 
                        { type : 'v3', value : this.phaseColor} ,
                        minValue: { type: 'f', value: this.minValue     } ,
                        maxValue: { type: 'f', value: this.maxValue     } ,
                        enableMaxColor : { type : 'b', 
                            value : this.enableMaxColor } ,
                        enableMinColor : { type : 'b', 
                            value : this.enableMinColor } ,
                        minColor: { type: 'v4',value: this.minColor     } ,
                        maxColor: { type: 'v4',value: this.maxColor     } ,
                        tiptColor:{ type: 'v3',value: this.tiptColor    } ,
                        tipt    : {
                            type: 's',
                            value: this.ftipt,
                            wrapS : 'mirrored_repeat',
                            wrapT : 'mirrored_repeat'
                        } ,
                        tiptThickness : {
                            type : 'f',
                            value   : this.tiptThicknes                 } ,
                        map     : { type: 's', value: this.target ,
                            minFilter: 'nearest', magFilter: 'nearest'  } ,
                        clrm    : { type: 't', value: this.clrm         } ,
                        prob    : { type: 't', value: this.prob         } ,
                        channelMultiplier : { type: 'v4',
                        value: this.channelMultiplier                   } ,
                        } ,

                        canvas: this.bcanvas ,
                    } ,
                ) ;
            }
            else {
                this.plot = 
                    new Solver({
                    vertexShader    : DefaultVertexShader.value,
                    fragmentShader  : dispBackgroundPhasShader.value,
                    uniforms: {
                        phas    : { type: 's', value: this.phase ,
                            minFilter : 'nearest', magFilter : 'nearest'} ,
                        phaseColor: 
                        { type : 'v3', value : this.phaseColor} ,
                        background: { 
                            type : 't' , value : this.background } ,
                        minValue: { type: 'f', value: this.minValue     } ,
                        maxValue: { type: 'f', value: this.maxValue     } ,
                        enableMaxColor : { type : 'b', 
                            value : this.enableMaxColor } ,
                        enableMinColor : { type : 'b', 
                            value : this.enableMinColor } ,
                        minColor: { type: 'v4',value: this.minColor     } ,
                        maxColor: { type: 'v4',value: this.maxColor     } ,
                        tiptColor:{ type: 'v3',value: this.tiptColor    } ,
                        tipt    : {
                            type: 's',
                            value: this.ftipt,
                            wrapS : 'mirrored_repeat',
                            wrapT : 'mirrored_repeat'
                        } ,
                        tiptThickness : {
                            type : 'f',
                            value   : this.tiptThicknes                 } ,
                        map     : { type: 's', value: this.target ,
                            minFilter: 'nearest', magFilter: 'nearest'  } ,
                        clrm    : { type: 't', value: this.clrm         } ,
                        prob    : { type: 't', value: this.prob         } ,
                        channelMultiplier : { type: 'v4',
                        value: this.channelMultiplier                   } ,
                        } ,

                        canvas: this.bcanvas ,
                    } ,
                ) ;
            }
        }else{
            this.plot =
                new Solver( {
                    vertexShader    : DefaultVertexShader.value,
                    fragmentShader  : dispShader.value,
                    uniforms: {
                        minValue: { type: 'f', value: this.minValue     } ,
                        maxValue: { type: 'f', value: this.maxValue     } ,
                        enableMaxColor : { type : 'b', 
                            value : this.enableMaxColor } ,
                        enableMinColor : { type : 'b', 
                            value : this.enableMinColor } ,
                        minColor: { type: 'v4',value: this.minColor     } ,
                        maxColor: { type: 'v4',value: this.maxColor     } ,

                        tiptColor:{ type: 'v3',value: this.tiptColor    } ,
                        tipt    : {
                            type: 's',
                            value: this.ftipt ,
                            wrapS : 'mirrored_repeat',
                            wrapT : 'mirrored_repeat'
                        } ,
                        tiptThickness : {
                            type : 'f',
                            value   : this.tiptThickness                } ,
                        map     : { type: 't', value: this.target       } ,
                        clrm    : { type: 't', value: this.clrm         } ,
                        prob    : { type: 't', value: this.prob         } ,
                        channelMultiplier : { type: 'v4',
                        value: this.channelMultiplier                   } ,
                        } ,
                        canvas : this.bcanvas ,
                    } ) ;
        }

/*------------------------------------------------------------------------
 * foreground
 *------------------------------------------------------------------------
 */
        this.fcanvas = document.createElement('canvas') ;
        this.fcanvas.width = this.width ;
        this.fcanvas.height = this.height ;
        this.fcontext = this.fcanvas.getContext('2d') ;
        
/*------------------------------------------------------------------------
 * ticks 
 *------------------------------------------------------------------------
 */
         
        this._xticksOpts= readOption( options.xticks, {} ) ;
        this._yticksOpts= readOption( options.yticks, {} ) ;
        
        this._xticks    = new Ticks( this._xticksOpts ) ;
        this._xticks.number = this.nx-1 ;
        
        this._yticks    = new Ticks( this._yticksOpts ) ;
        this._yticks.number = this.ny-1 ;
      
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

    get xticks(){
        this._xticks.plot = this.me ;
        return this._xticks ;
    }

    get yticks(){
        this._yticks.plot = this.me ;
        return this._yticks ;
    }

    get me(){
        return this ;
    }

    get target(){
        return this._target ;
    }
    get minValue(){
        return this._minValue ;
    }

    get maxValue(){
        return this._maxValue ;
    }

    get enableMaxColor(){
        return this._enableMaxColor ;
    }

    get enableMinColor(){
        return this._enableMinColor ;
    }

    get maxColor(){
        return this._maxColor ;
    }

    get minColor(){
        return this._minColor ;
    }

    get channel(){
        return this._channel ;
    }

    get prevTarget(){
        return this._prevTarget ;
    }

    get callback(){
        return this._callback ;
    }

    get clrmName(){
        return this._clrmName ;
    }
    get clrmImage(){
        return this._clrm.image ;
    }

    get pltTipt(){
        return this._pltTipt ;
    }

    get tiptColor(){
        return this._tiptColor ;
    }

    get tiptThreshold(){
        return this._tiptThreshold ;
    }


    get tiptThickness(){
        return this._tiptThickness ;
    }
    get width(){
        return this._width  ;
    }

    get height(){
        return this._height ;
    }
    get probeVisible(){
        return this._probeVisible ;
    }
    get probePosition(){
        return this._probePosition ;
    }
    get probeColor(){
        return this._probeColor ;
    }

    get canvas(){
        return this._canvas ;
    }
    get unit(){
        return this._unit ;
    }
       
    get colorbar(){
        return this._colorbar ;
    }
   
    get phase(){
        return this._phase;
    }
      
    get phaseColor(){
        return this._phaseColor ;
    }
 
    get background(){
        return this._background ;
    }
 
    get cblborder(){
        return this._cblborder ; 
    }
  
    get cbrborder(){
        return this._cbrborder;
    }
  
    get grid(){
        return this._grid;
    }
       
    get nx(){
        return this._nx;
    }
         
    get ny(){
        return this._ny;
    }
         
    get gridColor(){
        return this._gridColor;
    }
  
    get gridDash(){
        return this._gridDash;
    }

    get ftipt(){
        return this._ftipt ;
    }

    get stipt(){
        return this._stipt ;
    }

    get prob(){
        return this._prob ;
    }

    get clrm(){
        return this._clrm.texture ;
    }

    get channelMultiplier(){
        return this._channelMultiplier ;
    }

    get messages(){
        return this._messages ;
    }
/*------------------------------------------------------------------------
 * setter functions
 *------------------------------------------------------------------------
 */
    set colorbar(value){
        this._colorbar = value ;
        this.initForeground() ;
    }

    set colormap( clrmname ){
        this._clrmName = clrmname ;
        this._clrm = this.colormaps[this.clrmName] ;
        this.plot.setUniform( 'clrm', this.clrm ) ; 
        this.initForeground() ;
    }

    set minValue( val ) {
        this._minValue = val ;
        this.plot.setUniform('minValue',this.minValue );
        this.initForeground() ;
    }
    set maxValue( val ) {
        this._maxValue = val ;
        this.plot.setUniform('maxValue',this.maxValue );
        this.initForeground() ;
    }

    set channel(c){
        this._channel = c ;
        this._channelMultiplier =  getChannelMultiplier( this.channel ) ;
        if (this.prevTarget != undefined ){
            this.tipts.uniforms.channel.value = this.channelMultiplier ;
        }
        this.plot.setUniform('channelMultiplier',
            this.channelMultiplier );
    }

    set probePosition(pos){
        this._probePosition = pos ;
        this.initForeground() ;
    }


    set target(nt){
        this._target = nt ;
        this.plot.uniforms.map.value = this.target ;
    }
    
/*------------------------------------------------------------------------
 * drawGrid
 *------------------------------------------------------------------------
 */
    drawGrid(){
        if ( this.grid == 'on' ){
            this.fcontext.setLineDash(this.gridDash) ;
            this.fcontext.strokeStyle=this.gridColor ;
            var dx = this.canvas.width / (this.nx) ;
            var dy = this.canvas.height/ (this.ny) ;
            for (var i=1; i<this.nx ; i++){
                this.fcontext.moveTo(i*dx,0) ;
                this.fcontext.lineTo(i*dx,this.canvas.height) ;
                this.fcontext.stroke() ;
            }
            for (var j=1; j<this.ny ; j++){
                this.fcontext.moveTo(0,j*dy) ;
                this.fcontext.lineTo(this.canvas.width,j*dy) ;
                this.fcontext.stroke() ;
            }
        }
    }

/*------------------------------------------------------------------------
 * messages to appear on foreground
 *------------------------------------------------------------------------
 */
    addMessage (message, x, y, options ){
        var msg = new Message(message,x,y,options) ;
        this.messages.push(msg) ;
        this.initForeground() ;
        return msg ;
    }

/*------------------------------------------------------------------------
 * write all messages
 *------------------------------------------------------------------------
 */
    writeMessages (){
        for (var i=0 ; i < this.messages.length; i++){
            var message = this.messages[i] ;
            if (message.visible){
                this.fcontext.font = message.font ;
                this.fcontext.fillStyle = message.style ;
                this.fcontext.textAlign = message.align ;
                this.fcontext.fillText( message.text,
                                        this.canvas.width*message.x,
                                        this.canvas.height*message.y );
            }
        }
    }

/*------------------------------------------------------------------------
 * writeTicks
 *------------------------------------------------------------------------
 */
    writeTicks(){
        if (this.xticks.mode != 'off' ){
            this.fcontext.font = this.xticks.font ;
            this.fcontext.fillStyle = this.xticks.style ;
            this.fcontext.textAlign = "center" ;
            for (var i=1; i<=this.xticks.number ;i++){
                var dx = this.canvas.width / (this.xticks.number+1)
                var dy = this.canvas.height/ (this.ny) ;
                this.fcontext.fillText(
                    this.xticks.labels[i-1] ,
                    i*dx,
                    this.canvas.height*(1.-this.xticks.offset)
                ) ;
            }
        }
        if ( this.yticks.mode != 'off' ){
            this.fcontext.font = this.yticks.font ;
            this.fcontext.fillStyle = this.yticks.style ;
            this.fcontext.textAlign = "start" ;
            for (var i=1; i<=this.yticks.number ;i++){
                var dy = this.canvas.height
                        /(this.yticks.number+1) ;

                this.fcontext.fillText(
                    this.yticks.labels[i-1],
                    this.canvas.width*this.yticks.offset,
                    this.canvas.height-i*dy
                ) ;
            }
        }
    }

/*------------------------------------------------------------------------
 * drawProbePosition
 *------------------------------------------------------------------------
 */
    drawProbePosition (){
        if (!this.probeVisible)
            return ;
        this.fcontext.strokeStyle = this.probeColor;
        this.fcontext.beginPath();
        this.fcontext.strokeRect(
                this.canvas.width*this.probePosition[0] 
                    - this.canvas.width*0.01 ,
                this.canvas.height*(1-this.probePosition[1]) 
                    - this.canvas.width*0.01 ,
                this.canvas.width*0.02 ,
                this.canvas.width*0.02 ) ;
     //   this.fcontext.arc(
     //       this.canvas.width*this.probePosition[0],
     //       this.canvas.height*(1-this.probePosition[1]) ,
     //       this.canvas.width*0.02 ,
     //       0.,
     //       Math.PI * 2.0 ) ;
        this.fcontext.stroke() ;

        this.fcontext.moveTo(
            this.canvas.width*this.probePosition[0]
                - this.canvas.width*0.02,
            this.canvas.height*(1-this.probePosition[1])
        ) ;

        this.fcontext.lineTo(
            this.canvas.width*this.probePosition[0]
                + this.canvas.width*0.02,
            this.canvas.height*(1-this.probePosition[1])
        ) ;
        this.fcontext.stroke() ;
        this.fcontext.moveTo(
            this.canvas.width*this.probePosition[0],
            this.canvas.height*(1-this.probePosition[1] )
                    - this.canvas.width*0.02
        ) ;

        this.fcontext.lineTo(
                this.canvas.width*this.probePosition[0],
                this.canvas.height*(1-this.probePosition[1] )
                    + this.canvas.width*0.02
        ) ;
        this.fcontext.stroke() ;

        return ;
    }

/*------------------------------------------------------------------------
 * drawColorbar
 *------------------------------------------------------------------------
 */
    drawColorbar () {
        if (this.colorbar){
            this.fcontext.font = '10pt Arial' ;
            this.fcontext.fillStyle = "#FFFFFF" ;
            this.fcontext.fillRect( this.canvas.width/4 - this.cblborder ,
                                    this.canvas.height - 38,
                                    this.canvas.width/2
                                        + this.cblborder
                                        + this.cbrborder
                                        ,
                                    30 ) ;

            this.fcontext.fillStyle = "#000000" ;
            this.fcontext.textAlign = 'end' ;
            this.fcontext.fillText(     this.minValue + this.unit,
                                    this.canvas.width/4,
                                    this.canvas.height - 30 + 13) ;
            this.fcontext.textAlign = 'start' ;
            this.fcontext.fillText(     this.maxValue + this.unit,
                                    this.canvas.width*3/4,
                                    this.canvas.height - 30 + 13) ;


        this.fcontext.drawImage(    this.clrmImage,this.canvas.width/4,
                                    this.canvas.height - 30 ,
                                    this.canvas.width/2,16) ;
        }
        this._clrm.image.plot = this ;
        this._clrm.image.init = function(e){
            e.path[0].plot.init() ;
            e.path[0].plot.render() ;
        }
        this._clrm.image.onload = (e) => this._clrm.image.init(e) ;
    }
/*------------------------------------------------------------------------
 * 
 *------------------------------------------------------------------------
 */

/*------------------------------------------------------------------------
 * setColorbarVisiblity
 *------------------------------------------------------------------------
 */
    setColorbarVisiblity  (v){
        this.colorbar = readOption(v, this.colorbar) ;
    }

/*------------------------------------------------------------------------
 * toggleColorbar
 *------------------------------------------------------------------------
 */
    toggleColorbar (){
        this.colorbar = !this.colorbar ;
    }

/*------------------------------------------------------------------------
 * showColorbar
 *------------------------------------------------------------------------
 */
    showColorbar (){
        this.colorbar = true ;
    }

/*------------------------------------------------------------------------
 * hideColorbar
 *------------------------------------------------------------------------
 */
    hideColorbar (){
        this.colorbar = false ;
    }

/*------------------------------------------------------------------------
 * initForeground
 *------------------------------------------------------------------------
 */
    initForeground () {
        this.fcontext.clearRect(0,0,this.canvas.width,this.canvas.height) ;
        this.drawGrid() ;
        this.writeTicks() ;
        this.writeMessages() ;
        this.drawProbePosition() ;
        this.drawColorbar() ;
    }

/*------------------------------------------------------------------------
 * setColormap
 *------------------------------------------------------------------------
 */
    setColormap (clrmName){
        if (clrmName != undefined ){
            this.colormap = clrmName ;
        }
    }

/*------------------------------------------------------------------------
 * setMinValue
 *------------------------------------------------------------------------
 */
    setMinValue (val){
        this._minValue = val ;
        this.plot.setUniform('minValue',this.minValue );
        this.initForeground() ;
    }

/*------------------------------------------------------------------------
 * setMaxValue
 *------------------------------------------------------------------------
 */
    setMaxValue (val){
        this.maxValue = readOption(val, this.maxValue) ;
    }

/*------------------------------------------------------------------------
 * setChannel
 *------------------------------------------------------------------------
 */
    setChannel (channel){
        this.channel = channel ;
    }

/*------------------------------------------------------------------------
 * setTiptVisiblity
 *------------------------------------------------------------------------
 */
    setTiptVisiblity ( tipt ){
        this._pltTipt = tipt ;
        this.tipts.setUniform('path' , this.pltTipt ) ;
        this.tiptInit.render() ;
    }

/*------------------------------------------------------------------------
 * setTiptColor
 *------------------------------------------------------------------------
 */
    setTiptColor(color){
        this._tiptColor = color ;
        this.plot.setUniform('tiptColor',
            this.tiptColor );
    }

/*------------------------------------------------------------------------
 * setTiptThreshold
 *------------------------------------------------------------------------
 */
    setTiptThreshold (threshold){
        this._tiptThreshold = threshold ;
        this.tipts.setUniform('Uth',
            this.tiptThreshold ) ;
    }

/*------------------------------------------------------------------------
 * setTiptThickness
 *------------------------------------------------------------------------
 */
    setTiptThickness (thickness){
        this._tiptThickness = readOption(thickness, this.tiptThickness ) ;
        this.plot.setUniform('tiptThickness', this.tiptThickness ) ;
    }

/*------------------------------------------------------------------------
 * setProbePosition
 *------------------------------------------------------------------------
 */
    setProbePosition (probePosition){
        if (probePosition != undefined ){
            this._probePosition = probePosition ;
        }
        this.initForeground() ;
    }

/*------------------------------------------------------------------------
 * setProbVisiblity
 *------------------------------------------------------------------------
 */
    setProbeVisiblity (flag){
        if ( flag != undefined ){
            this._probeVisible = flag ;
            this.initForeground() ;
        }
    }

/*------------------------------------------------------------------------
 * setProbColor
 *------------------------------------------------------------------------
 */
    setProbeColor (clr){
        if (clr != undefined ){
            this._probeColor = clr ;
            this.initForeground() ;
        }
    }

/*------------------------------------------------------------------------
 * init
 *------------------------------------------------------------------------
 */
    init (){
        this.initForeground() ;
        this.tiptInit.render() ;
        this.colormap = this.clrmName ;
    }

/*------------------------------------------------------------------------
 * initialize
 *------------------------------------------------------------------------
 */
    initialize(){
         this.init() ;
    }

/*------------------------------------------------------------------------
 * setSize
 *------------------------------------------------------------------------
 */
    setSize (width, height){
        this.ftipt.resize( width, height ) ;
        this.stipt.resize( width, height ) ;
        this.prob.resize( width, height ) ;
        this.init() ;
    }

/*------------------------------------------------------------------------
 * tiptUpdate
 *------------------------------------------------------------------------
 */
    updateTipt (){
        if ( this.pltTipt ){
            this.tipts.render() ;
            this.stip2ftip.render() ;
        }
        return ;
    }

/*------------------------------------------------------------------------
 * render
 *------------------------------------------------------------------------
 */
    render (){
        this.updateTipt() ;
        this.plot.render() ;

        this.context.clearRect(0,0,this.canvas.width, this.canvas.height ) ;
        this.context.drawImage(this.bcanvas,0,0) ;
        this.context.drawImage(this.fcanvas, 0,0) ;

        return ;
    }

} /* end of Plot2D */

/*========================================================================
 * Tvsx : time vs x solver
 *  options :
 *      ftarget     : first target 
 *      starget     : second target
 *      timeWindow  : time window (vertical length)
 *      dt          : delta t 
 *      active      : boolean to indicate if the solver is active
 *      defaultVal  : v4 for the default value of the solver
 *      yLevel      : y-level for x values (0.5)
 *      refresh     : boolean to refresh afte each time window
 *      width       : width of the internal texture
 *      height      : height of the internal texture
 *========================================================================
 */
class Tvsx{
    constructor(options={}){
        this._ftarget   = readOption( options.ftarget ,     null        ) ;
        this._starget   = readOption( options.starget , this._ftarget   ) ;
        this._timeWindow= readOption( options.timeWindow ,  1000.0      ) ;
        this._dt        = readOption( options.dt ,          0.01        ) ;
        this._active    = readOption( options.active ,      true        ) ;
        this._refresh   = readOption( options.refresh ,     true        ) ;
        this._defaultVal= readOption( options.defaultVal , [0.,0.,0.,0.]) ;
        this._defaultVal= readOption( options.defaultValue , 
                this._defaultVal    ) ;
        this._defaultVal= readOption( options.rgba ,this._defaultVal    ) ;
        this._yLevel    = readOption( options.yLevel ,      0.5         ) ;
        this._yLevel    = readOption( options.ylevel , this._yLevel     ) ;
        this._dispOpts  = readOption( options.displayOptions, null      ) ;
        this._width     = readOption( options.width     ,   512         ) ;
        this._height    = readOption( options.height    ,   512         ) ;


        this._ftvsx = new FloatRenderTarget(this._width, this._height) ;
        this._stvsx = new FloatRenderTarget(this._width, this._height) ;
        this._fttex = new FloatRenderTarget(1,1) ;
        this._sttex = new FloatRenderTarget(1,1) ;

        this.ftvsxs = new Solver({
            fragmentShader  : tvsxShader.value,
            vertexShader    : DefaultVertexShader.value,
            uniforms : {
                inText : {  
                    type    : 't', 
                    value   : this._ftarget 
                } ,
                inTvsx : {  
                    type    : 't', 
                    value   : this._ftvsx   
                } ,
                ttex : { 
                    type    : 't', 
                    value   : this._fttex   
                } ,
                timeWindow : { 
                    type    : 'f', 
                    value   : this._timeWindow 
                } ,

                devaultVal : { 
                    type    : 'v4', 
                    value   : this._defaultVal 
                } ,
                yLevel : { 
                    type    : 'f', 
                    value   : this._yLevel 
                } ,
                refresh : { 
                    type    : 'f', 
                    value   : this._refresh 
                } ,
            } ,
            renderTargets:{
                outTvsx : { location : 0, target : this._stvsx } ,
            }
        } ) ;

        this.stvsxs = new Solver({
            fragmentShader  : tvsxShader.value,
            vertexShader    : DefaultVertexShader.value,
            uniforms : {
                inText : {  
                    type    : 't', 
                    value   : this._starget 
                } ,
                inTvsx : {  
                    type    : 't', 
                    value   : this._stvsx   
                } ,
                ttex : { 
                    type    : 't', 
                    value   : this._sttex   
                } ,
                timeWindow : { 
                    type    : 'f', 
                    value   : this._timeWindow 
                } ,

                devaultVal : { 
                    type    : 'v4', 
                    value   : this._defaultVal 
                } ,
                yLevel : { 
                    type    : 'f', 
                    value   : this._yLevel 
                } ,
                refresh : { 
                    type    : 'f', 
                    value   : this._refresh 
                } ,
            } ,
            renderTargets:{
                outTvsx : { location : 0, target : this._ftvsx } ,
            }
        } ) ;

        this.ftstps = new Solver({
            vertexShader    : DefaultVertexShader.value ,
            fragmentShader  : tstpShader.value ,
            uniforms : {
                inTtex : { 
                    type    : 't' ,
                    value   : this._fttex 
                },
                timeWindow: {
                    type : 'f',
                    value: this._timeWindow 
                } ,
                dt : {
                    type: 'f',
                    value: this._dt
                } ,
            } ,
            renderTargets: {
                outTtex : { location : 0 , target   : this._sttex }
            } ,
            clear   : false ,
        } ) ;

        this.ststps = new Solver({
            vertexShader    : DefaultVertexShader.value ,
            fragmentShader  : tstpShader.value ,
            uniforms : {
                inTtex : { 
                    type    : 't' ,
                    value   : this._sttex 
                },
                timeWindow: {
                    type : 'f',
                    value: this._timeWindow 
                } ,
                dt : {
                    type: 'f',
                    value: this._dt
                } ,
            } ,
            renderTargets: {
                outTtex : { location : 0 , target   : this._fttex }
            } ,
            clear   : false ,
        } ) ;


    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    
    get texture(){
        return this._ftvsx ;
    }
    
    get target(){
        return this._ftvsx ;
    }

    get active(){
        return this._active ;
    }
    
    set active(val){
        this._active = val ;
    }

    set dt(newDt){
        this._dt = newDt ;
        this.ftstps.setUniform('dt',this._dt) ;
        this.ststps.setUniform('dt',this._dt) ;
    } 

    set timeWindow(tw){
        this._timeWindow = tw ;
        this.ftstps.setUniform('timeWindow', this._timeWindow) ;
        this.ststps.setUniform('timeWindow', this._timeWindow) ;
        this.ftvsxs.setUniform('timeWindow', this._timeWindow) ;
        this.stvsxs.setUniform('timeWindow', this._timeWindow) ;
    }

    get refresh(){
        return this._refresh ;
    }

    set refresh(b){
        this._refresh = b ;
        this.ftvsxs.setUniform('refresh', this._refresh ) ;
        this.stvsxs.setUniform('refresh', this._refresh ) ;
    }

    get timeWindow(){
        return this._timeWindow ;
    }

    set timewindow(tw){
        this.timeWindow = tw ;
    }

    get timeWindow(){
        return this.timeWindow ;
    }

    set yLevel(yl){
        this._yLevel = yl ;
        this.ftvsxs.setUniform('yLevel', this._yLevel ) ;
        this.stvsxs.setUniform('yLevel', this._yLevel ) ;
    }

    get yLevel(){
        return this._yLevel ;
    }

    set ylevel(yl){
        this.yLevel =yl ;
    }
    
    get ylevel(){
        return this.yLevel ;
    }

    set defaultVal(dv){
        this._defaultVal = dv ;
        this.ftvsxs.setUniform('defaultVal', this._defaultVal ) ;
        this.stvsxs.setUniform('defaultVal', this._defaultVal ) ;
    } 
    
    get defaultVal(){
        return this._defaultVal ;
    }

    set defaultValue(dv){
        this.defaultVal = dv ;
    }
    
    get defaultValue(){
        return this.defaultVal ;
    }

    set rgba(dv){
        this.defaultVal = dv ;
    }
    
    get rgba(){
        return this.defaultVal ;
    }
        
    frender(){
        this.ftvsxs.render() ;
        this.ftstps.render() ;
    }

    srender(){
        this.stvsxs.render() ;
        this.ststps.render() ;
    }
    
    render(){
        if (this.active){
            this.srender() ;
            this.frender() ;
        }
    }

} /* End of TvsxPlot class definition */

/*========================================================================
 * VolumeRayCaster({options}):
 *      - target            :   a texture to plot from
 *      - prev              :   previous time-step texture
 *      - canvas            :   a canvas to draw on
 *      - mx                :   number of z-slices in x-direction
 *      - my                :   number of z-slices in y-direction
 *      - alphaCorrection   :   alpha-correction
 *      - noSteps           :   number of ray-casting steps
 *      - channel           :   the channel to draw colors from
 *      - threshold         :   the drawing threshold value
 *      - filamentThreshold :   threshold for calculating filament
 *      - filamentColor     :   color of the filament
 *      - drawFilament      :   request to draw filament
 *      - xLevel            :   x-level of cut plane
 *      - yLevel            :   y-level of cut plane
 *      - zLevel            :   z-level of cut plane
 *      - showXCut          :   show x-cutplane
 *      - showYCut          :   show y-cutplane
 *      - showZCut          :   show z-cutplane
 *      - minValue          :   minimum value in the colorbar range
 *      - maxValue          :   maximum value in the colorbar range
 *      - colorbar          :   name of the colorbar to calc. colors
 *      - lights            :   a v3v of directional flood lights
 *      - phaseField        :   phase-field texture when necessary
 *      - compressionMap    :   compression map of a compressed structure
 *      - decompressionMap  :   decompression map of a compressed structure
 *      - onCtrlClick       :   callback function for Ctrl+Click events
 *      - clickPenetration  :   clickPenetration factor
 *========================================================================
 */
class VolumeRayCaster{
    constructor(opts={}){

/*------------------------------------------------------------------------
 * setting up colormaps
 *------------------------------------------------------------------------
 */
        this.colormapList   = getColormapList() ;
        this.colormaps      = getColormaps(this.colormapList) ;

/*------------------------------------------------------------------------
 * reading options
 *------------------------------------------------------------------------
 */
        this.target = readOption(opts.target,null,
                'Error : A Float32Texture must be provided for '+
                'plotting.\n'+
                'No VolumeRayCaster can be defined!'                    ) ;
        this.prev   = readOption(opts.prev, null    ) ;
        this.prevDefined = false ;

        if (this.target == null ){
            return null ;
        }
        if ( this.prev == null ){
            this.prev = 
                new Float32Texture( this.target.width,this.target.height) ;
        }else{
            this.prevDefined = true ;
        }

        this.prevTarget = readOption(opts.prevTarget, null ) ;

        this.canvas = readOption(opts.canvas, null,
            'Error: No canvas for VolumeRayCaster was provided.\n'+
            'No VolumeRayCaster can be defined!'                        ) ;
        if (this.canvas == null){
            return null ;
        }

        this.dispWidth  = this.canvas.width ;
        this.dispHeight = this.canvas.height ;
        this.context    = this.canvas.getContext('2d') ;

        this.mx = readOption( opts.mx, 1,
            'Warning : Number of z-slices in x-direction '+
            'of structure/mx was not provided. Assuming mx = 1. '       ) ;

        this.my = readOption(opts.my, 1,
            'Warning : Number of z-slices in y-direction '+
            'of structure/my was not provided. Assuming my = 1. '       ) ;

        this.alphaCorrection = readOption(opts.alphaCorrection, 0.5     ) ;
        this._structural_alpha= readOption(opts.structural_alpha, 1.0   ) ;
        this.fov            = readOption(opts.fieldOfView, Math.PI*0.1  ) ;
        this.fov            = readOption(opts.fov   , this.fov          ) ;
        this.nearField      = readOption(opts.nearField,    0.01        ) ;
        this.farField       = readOption(opts.farField,     100         ) ;
        this.noSteps        = readOption(opts.noSteps   , 50            ) ;
        this.channel        = readOption(opts.channel   , 'r'           ) ;
        this.threshold      = readOption(opts.threshold , 0.            ) ;

        this.drawFilament   = readOption(opts.drawFilament, false ) ;
        this.filamentThreshold = readOption(opts.filamentThreshold, 0.  ) ;
        this.filamentColor = readOption(opts.filamentColor,[0.,0.,0.,0.]) ;
        this.filamentThickness = readOption(opts.filamentThickness, 1 ) ;
        this.filamentBorder = readOption(opts.filamentBorder, 0.1     ) ;
        this.xLevel         = readOption(opts.xLevel, 0.1) ;
        this.yLevel         = readOption(opts.yLevel, 0.2) ;
        this.zLevel         = readOption(opts.zLevel, 0.3) ;
        this.showXCut       = readOption(opts.showXCut, false ) ;
        this.showYCut       = readOption(opts.showYCut, false ) ;
        this.showZCut       = readOption(opts.showZCut, false ) ;
        this.rayCast        = readOption(opts.rayCast,  true  ) ;

        this.minValue       = readOption(opts.minValue  , 0.            ) ;
        this.maxValue       = readOption(opts.maxValue  , 1.            ) ;
        this.unit           = readOption(opts.unit      , ''            ) ;
        this.clrmName       = readOption(opts.colormap  , 'rainbowHotSpring'         ) ;
        this.scale          = readOption(opts.scale ,   1.0             ) ;
        this.clickPenetration = readOptions( opts.clickPenetration, 0   ) ;
        this.clickPenetration = readOptions( opts.cp,
                this.clickPenetration ) ;

        this.clrm   = this.colormaps[this.clrmName] ;

        this.colorbar       = readOption(opts.colorbar  , false         ) ;

        this.dfls           = readOption(opts.floodLights, []           ) ;
        this.noDfls = Math.floor(this.dfls.length/3) ;

        this.ptls           = readOption(opts.pointLights, []           ) ;
        this.noPtls         = Math.floor(this.ptls.length/3) ;
        this.lightShift     = readOption(opts.lightShift,   0           ) ;

        this.dfls.push(0,0,0) ; /* this is added to avoid problems
                                   when no light is provided        */
        this.ptls.push(0,0,0) ;

        this.phaseField     = readOption(opts.phaseField , null         ) ;
        this.compMap        = readOption(opts.compressionMap, null      ) ;

        if (this.compMap != null ){
            this.useCompMap = true ;
            this.width  = this.compMap.width ;
            this.height = this.compMap.height ;
        }else{
            this.useCompMap = false ;
            this.width  = this.target.width ;
            this.height = this.target.height ;
        }
        this.domainResolution = 
            [ this.width/this.mx, this.height/this.my,this.mx*this.my ] ;

        function ifNullThenUnit(trgt){
            if (trgt == null ){
                return new Float32Texture(1,1) ;
            }else{
                return trgt ;
            }
        }
        if( this.phaseField != null ){
            this.usePhaseField = true ;
        }else{
            this.usePhaseField = false ;
        }

        this.usePhaseField = 
            readOption( opts.usePhaseField, this.usePhaseField ) ;
        this.phaseField = ifNullThenUnit(this.phaseField) ;
        this.compMap    = ifNullThenUnit(this.compMap   ) ;
        this.prevTarget = ifNullThenUnit(this.prevTarget) ;

        this.flmt = new Float32Texture(this.width, this.height ) ;


        /* callback function for control click */
        this.onCtrlClick = readOption(opts.onCtrlClick, function(){}    ) ;

        this.channelMultiplier = getChannelMultiplier( this.channel ) ;

/*------------------------------------------------------------------------
 * copyTrgt2Prev
 *------------------------------------------------------------------------
 */
        this.copyTrgt2Prev = new Copy( this.target, this.prev ) ;

/*------------------------------------------------------------------------
 * coordinate and light
 *------------------------------------------------------------------------
 */
        this.crdtTxt = new Float32Texture(this.width, this.height) ;
        this.crdt   = new  Solver( {
            vertexShader    : DefaultVertexShader.value,
            fragmentShader  : vrcCrdShader.value,
            uniforms : {
                mx          : {
                    type    : 'f',
                    value   : this.mx
                } ,
                my          : {
                    type    : 'f',
                    value   : this.my
                } ,
            } ,
            renderTargets : {
                crd : { location : 0 , target : this.crdtTxt  } ,
            }
        } ) ;
        this.crdt.render() ;

/*------------------------------------------------------------------------
 * light
 *------------------------------------------------------------------------
 */
        this.lightTxt = new Float32Texture(this.width, this.height) ;
        this.light = new Solver({
            vertexShader    :   DefaultVertexShader.value ,
            fragmentShader  :   vrcLgtShader.value ,
            uniforms : {
                crdtTxt     : {
                    type    : 't',
                    value   : this.crdtTxt
                } ,
                phaseTxt    : {
                    type    : 's',
                    value   : this.phaseField,
                    //minFilter: 'nearest',
                    //magFilter: 'nearest',
                } ,
                target      : {
                    type    : 's',
                    value   : this.target ,
                    minFilter: 'nearest',
                    magFilter: 'nearest',
                } ,
                usePhaseField: {
                    type    : 'b',
                    value   : this.usePhaseField
                } ,
                mx          : {
                    type    : 'f',
                    value   : this.mx
                } ,
                my          : {
                    type    : 'f',
                    value   : this.my,
                },
                minValue    : {
                    type    : 'f',
                    value   : this.minValue
                } ,
                maxValue    : {
                    type    : 'f' ,
                    value   : this.maxValue
                } ,
                threshold   : {
                    type    : 'f',
                    value   : this.threshold
                } ,
                dfls        : {
                    type    : 'f3v',
                    value   : this.dfls
                } ,
                noDfls      : {
                    type    : 'i',
                    value       : this.noDfls
                } ,
                ptls        : {
                    type    : 'f3v',
                    value   : this.ptls,
                } ,
                noPtls      : {
                    type    : 'i',
                    value   : this.noPtls,
                } ,
                alphaCorrection : {
                    type    : 'f',
                    value   : this.alphaCorrection
                } ,
                channelMultiplier : {
                    type    : 'v4',
                    value   : this.channelMultiplier
                } ,
                lightShift  : {
                    type    : 'f',
                    value   : this.lightShift,
                } ,
                structural_alpha : {
                    type    : 'f',
                    value   : this.structural_alpha 
                } ,

            } ,
            renderTargets: {
                light   : { location : 0 , target : this.lightTxt   } ,
            }
        } ) ;
        this.light.render() ;

/*------------------------------------------------------------------------
 * geometry
 *------------------------------------------------------------------------
 */
        var cubeGeometry        = new UnitCubeGeometry() ;
        var frameGeometry   = new UnitCubeFrameGeometry() ;

/*------------------------------------------------------------------------
 * transformation matrices
 *------------------------------------------------------------------------
 */
        /* modelMatrix  */
        this.modelMatrix = mat4.create() ;
        mat4.identity(  this.modelMatrix                 ) ;

        mat4.rotate(    this.modelMatrix, this.modelMatrix,
                        -Math.PI/2.,[1.,0.,0.]      ) ;

        mat4.translate( this.modelMatrix, this.modelMatrix,
                        [-0.5,-0.5,-0.5]            ) ;

        /* viewMatrix   */
        this.viewMatrix = mat4.create() ;

        mat4.rotate(    this.viewMatrix,this.viewMatrix,
                        Math.PI/2.0,[1,1,1]         ) ;

        mat4.identity(  this.viewMatrix                  ) ;

        mat4.lookAt(    this.viewMatrix,
                        [2,2,2],[0,0,0],[0,1,0]     ) ;

        this.viewMatrix.onchange= function(){
            log('hehehe') ;
        } ;

        this.controler = new OrbitalCameraControl(
            this.viewMatrix,
            4.0 , this.canvas,
            {
                prevx: -.4,
                prevy: 0.4,
            }
        ) ;

        /* projectionMatrix */
        this.projectionMatrix = mat4.create() ;
        mat4.identity(      this.projectionMatrix        ) ;
        mat4.perspective (  this.projectionMatrix ,
                            this.fov, this.dispWidth/this.dispHeight,
                            this.nearField, this.farField               ) ;

/*------------------------------------------------------------------------
 * pass1
 *------------------------------------------------------------------------
 */
        this.backfaceCrdTxt = new Float32Texture(this.dispWidth,
                                                    this.dispHeight     ) ;
        this.pass1 = new Solver({
            vertexShader    : vrc1VShader.value,
            fragmentShader  : vrc1FShader.value,
            uniforms : {
                modelMatrix : {
                    type    : 'mat4',
                    value   : this.modelMatrix
                } ,
                viewMatrix  : {
                    type    : 'mat4',
                    value   : this.viewMatrix
                } ,
                projectionMatrix : {
                    type    : 'mat4',
                    value   : this.projectionMatrix
                } ,
            } ,
            geometry        : cubeGeometry ,
            cullFacing      : true ,
            cullFace        : 'front',
            depthTest       : 'true',
            renderTargets   : {
                back_face_Crds : {
                    location :0 ,
                    target  : this.backfaceCrdTxt
                } ,
            } ,
        } ) ;

/*------------------------------------------------------------------------
 * pass2
 *------------------------------------------------------------------------
 */
        this.pass2  = new Solver({
            vertexShader    : vrc2VShader.value,
            fragmentShader  : vrc2FShader.value,
            uniforms    : {
                modelMatrix : {
                    type    : 'mat4',
                    value   : this.modelMatrix
                } ,
                viewMatrix  : {
                    type    : 'mat4',
                    value   : this.viewMatrix
                } ,
                projectionMatrix : {
                    type    : 'mat4',
                    value   : this.projectionMatrix
                } ,
                backfaceCrdTxt : {
                    type    : 's',
                    value   : this.backfaceCrdTxt ,
                    minFilter : 'nearest' ,
                    magFilter : 'nearest' ,
                    wrapS   : 'clamp_to_edge' ,
                    wrapT   : 'clamp_to_edge' ,
                } ,
                phaseTxt    : {
                    type    : 's',
                    value   : this.phaseField,
                    minFilter: 'nearest',
                    magFilter: 'nearest',
                } ,
                target      : {
                    type    : 's',
                    value   : this.target ,
                    minFilter: 'nearest',
                    magFilter: 'nearest',
                } ,
                compMap     : {
                    type    : 't',
                    value   : this.compMap
                } ,
                lightTxt    : {
                    type    : 't' ,
                    value   : this.lightTxt ,
                } ,
                flmt        : {
                    type    : 't',
                    value   : this.flmt ,
                } ,
                drawFilament: { 
                    type    : 'b',
                    value   : this.drawFilament 
                } ,
                showXCut    : {
                    type    : 'b',
                    value   : this.showXCut ,
                } ,
                showYCut    : {
                    type    : 'b',
                    value   : this.showYCut,
                } ,
                showZCut    : {
                    type    : 'b',
                    value   : this.showZCut,
                } ,
                xLevel      : {
                    type    : 'f',
                    value   : this.xLevel,
                } ,
                yLevel      : {
                    type    : 'f',
                    value   : this.yLevel,
                } ,
                zLevel      : {
                    type    : 'f',
                    value   : this.zLevel ,
                } ,
                filamentColor:{
                    type    : 'v4',
                    value   : this.filamentColor 
                } ,
                rayCast     : {
                    type    : 'b',
                    value   : this.rayCast ,
                } ,
                clrm        : {
                    type    : 't',
                    value   : this.clrm.texture,
                } ,
                usePhaseField: {
                    type    : 'b',
                    value   : this.usePhaseField
                } ,
                useCompMap  : {
                    type    : 'b',
                    value   : this.useCompMap
                } ,
                minValue    : {
                    type    : 'f',
                    value   : this.minValue
                } ,
                maxValue    : {
                    type    : 'f',
                    value   : this.maxValue
                } ,
                threshold   : {
                    type    : 'f',
                    value   : this.threshold
                } ,
                channelMultiplier: {
                    type    : 'v4',
                    value   : this.channelMultiplier
                } ,
                alphaCorrection : {
                    type    : 'f',
                    value   : this.alphaCorrection
                } ,
                noSteps       : {
                    type    : 'i',
                    value   : this.noSteps
                } ,
                mx          : {
                    type    : 'f' ,
                    value   : this.mx ,
                } ,
                my          : {
                    type    : 'f',
                    value   : this.my ,
                } ,
                lightShift  : {
                    type    : 'f',
                    value   : this.lightShift ,
                } ,
                structural_alpha : { type : 'f', value : this.structural_alpha } ,
            } ,
            geometry        : cubeGeometry ,
            cullFacing      : true ,
            cullFace        : 'back' ,
            depthTest       : true ,
            clear           : true ,
        } ) ;

/*------------------------------------------------------------------------
 * frame solver
 *------------------------------------------------------------------------
 */
        this.frameSol = new Solver({
            vertexShader    : vrc2VShader.value ,
            fragmentShader  : vrcFrmShader.value ,
            uniforms :{
                modelMatrix : {
                    type    : 'mat4',
                    value   : this.modelMatrix
                } ,
                viewMatrix  : {
                    type    : 'mat4',
                    value   : this.viewMatrix
                } ,
                projectionMatrix : {
                    type    : 'mat4',
                    value   : this.projectionMatrix
                } ,
                frameColor : { type: 'v4', value: [0.,0.,0.,1.] } ,
            } ,
            geometry        : frameGeometry ,
            cullFacing      : false ,
            cullFace        : 'back' ,
            depthTest       : true ,

            clear           : true ,
        } ) ;

/*------------------------------------------------------------------------
 * filament
 *------------------------------------------------------------------------
 */
        this.filament = new Solver({
            vertexShader:   DefaultVertexShader.value ,
            fragmentShader  :   filamentShader.value ,
            uniforms    : {
                inFtrgt : { type : 't', value : this.prev           } ,
                inStrgt : { type : 't', value : this.target         } ,
                crdtMap : { type : 't', value : this.crdtTxt        } ,
                filamentThickness: 
                    { type : 'f', value : this.filamentThickness  } ,
                domainResolution 
                        : { type : 'v3',value : this.domainResolution   } ,
                mx      : { type : 'f', value : this.mx                 } ,
                my      : { type : 'f', value : this.my                 } ,
                filamentThreshold   : 
                    { type : 'f', value : this.filamentThreshold        } ,
                filamentBorder: 
                    { type : 'f', value : this.filamentBorder           } ,
            } ,
            renderTargets   : {
                outTrgt : { location : 0 , target : this.flmt } ,
            } ,
            clear :false ,
        } ) ;
/*------------------------------------------------------------------------
 * projectedCrds
 *------------------------------------------------------------------------
 */
        this.projectedCrds = new Float32Texture(
            this.dispWidth,
            this.dispHeight,
        ) ;

        this.projectCrds = new Solver({
            vertexShader    :   vrc2VShader.value,
            fragmentShader  :   vrcPCShader.value,
            uniforms :{
                modelMatrix : {
                    type    : 'mat4',
                    value   : this.modelMatrix
                } ,
                viewMatrix  : {
                    type    : 'mat4',
                    value   : this.viewMatrix
                } ,
                projectionMatrix : {
                    type    : 'mat4',
                    value   : this.projectionMatrix
                } ,
                backfaceCrdTxt : {
                    type    : 's',
                    value   : this.backfaceCrdTxt ,
                    minFilter : 'nearest' ,
                    magFilter : 'nearest' ,
                    wrapS   : 'clamp_to_edge' ,
                    wrapT   : 'clamp_to_edge' ,
                } ,
                phaseTxt    : {
                    type    : 's',
                    value   : this.phaseField,
                    minFilter: 'nearest',
                    magFilter: 'nearest',
                } ,
                target      : {
                    type    : 's',
                    value   : this.target ,
                    minFilter: 'nearest',
                    magFilter: 'nearest',
                } ,
                usePhaseField: {
                    type    : 'b',
                    value   : this.usePhaseField
                } ,
                minValue    : {
                    type    : 'f',
                    value   : this.minValue
                } ,
                maxValue    : {
                    type    : 'f',
                    value   : this.maxValue
                } ,
                threshold   : {
                    type    : 'f',
                    value   : this.threshold
                } ,
                channelMultiplier: {
                    type    : 'v4',
                    value   : this.channelMultiplier
                } ,
                noSteps       : {
                    type    : 'i',
                    value   : this.noSteps
                } ,
                mx          : {
                    type    : 'f' ,
                    value   : this.mx ,
                } ,
                my          : {
                    type    : 'f',
                    value   : this.my ,
                } ,
                clickPenetration : {
                    type    : 'f',
                    value   : this.clickPenetration ,
                } ,
            } ,
            renderTargets :{
                FragColor : {
                    location    : 0,
                    target      : this.projectedCrds ,
                } ,
            } ,
            geometry        : cubeGeometry ,
            cullFacing      : true ,
            cullFace        : 'back' ,
            depthTest       : true ,
            clear           : true ,
        } ) ;
    
    
/*------------------------------------------------------------------------
 * clickCoordinate
 *------------------------------------------------------------------------
 */
        this.clickCoordinates   = new Float32Texture(1,1) ;
        this.clickVoxelCrd      = new Float32Texture(1,1) ;
        this.clickPosition      = [0.,0.] ;
        this.clickVoxelProbe    = new Probe(this.clickVoxelCrd) ;
        this.clickVoxelPosition = [0.,0.] ;

        this.clickCoordinator = new Solver({
            vertexShader    : DefaultVertexShader.value ,
            fragmentShader  : vrcClickCrdShader.value ,
            uniforms        : {
                projectedCrds : {
                    type        : 't' ,
                    value       : this.projectedCrds ,
                } ,
                clickPosition : {
                    type        : 'v2' ,
                    value       : this.clickPosition ,
                } ,
            } ,
            renderTargets   : {
                clickCoordinates : {
                    location    : 0 ,
                    target      : this.clickCoordinates ,
                }
            } ,
            clear : true ,
        } ) ;

        this.clickVoxelCoordinator = new Solver({
            vertexShader    : DefaultVertexShader.value ,
            fragmentShader  : vrcClickVoxelCrdShader.value,
            uniforms   : {
                mx  : { type : 'f', value : this.mx } ,
                my  : { type : 'f', value : this.my } ,
                useCompMap : { type : 'b', value : this.useCompMap },
                compMap : { type : 't', value : this.compMap } ,
                clickCoordinates : { type : 't',
                    value :  this.clickCoordinates } ,
            } ,
            renderTargets : {
                voxelPos : { location : 0 , target : this.clickVoxelCrd } ,
            } ,
            clear : true ,
        } ) ;

/*------------------------------------------------------------------------
 * foreground
 *------------------------------------------------------------------------
 */
        this.fcanvas = document.createElement('canvas') ;
        this.fcanvas.width = this.canvas.width ;
        this.fcanvas.height= this.canvas.height ;
        this.fcontext = this.fcanvas.getContext('2d') ;




        this.messages = [] ;

    } 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    
/*------------------------------------------------------------------------
 * setClickPenetration
 *------------------------------------------------------------------------
 */
    setClickPenetration (cp){
        if ( cp != undefined ){
            this.clickPenetration = cp ;
        }
        this.projectCrds.setUniform('clickPenetration',
                this.clickPenetration) ;
        this.projectCrds.render() ;
    }
    setCP(cp){
         this.setClickPenetration(cp) ;
    }

/*------------------------------------------------------------------------
 * updateClickCoordinate
 *------------------------------------------------------------------------
 */
    updateClickCoordinates(clickPosition){
        this.clickPosition = clickPosition ;
        this.controler.update() ;
        mat4.scale(
            this.viewMatrix,
            this.viewMatrix, [
                this.scale,
                this.scale,
                this.scale,
                this.scale
            ] ) ;

        this.pass1.setUniform(
            'viewMatrix',
            this.viewMatrix
        ) ;
        this.projectCrds.setUniform(
            'viewMatrix',
            this.viewMatrix
        ) ;
        this.clickCoordinator.setUniform(
            'clickPosition',
            this.clickPosition ,
        ) ;

        this.pass1.render() ;
        this.projectCrds.render() ;
        this.clickCoordinator.render() ;
        this.clickVoxelCoordinator.render() ;
    }

    updateClickPosition(cc){
        this.updateClickCoordinates(cc) ;
    }
/*------------------------------------------------------------------------
 * structural_alpha
 *------------------------------------------------------------------------
 */
    get structural_alpha(){
        return this._structural_alpha ;
    }

    set structural_alpha(sa){
        this._structural_alpha = sa ;
        this.light.uniforms.structural_alpha.value 
            = this.structural_alpha ;
        this.pass2.uniforms.structural_alpha.value 
            = this.structural_alpha ;
    }

/*------------------------------------------------------------------------
 * getClickVoxelPosition
 *------------------------------------------------------------------------
 */
    getClickVoxelPosition (){
        var voxel = this.clickVoxelProbe.getPixel() ;
        this.clickVoxelPosition[0] = voxel[0] ;
        this.clickVoxelPosition[1] = voxel[1] ;
        return this.clickVoxelPosition ;
    }

    getClickVoxel(){
        return this.getClickVoxelPosition() ;
    }

/*------------------------------------------------------------------------
 * messages to appear on foreground
 *------------------------------------------------------------------------
 */
    addMessage (message, x, y, options ){
        var msg = new Message( message, x,y, options);
        this.messages.push(msg) ;
        this.initForeground() ;
        return msg ;
    }

/*------------------------------------------------------------------------
 * write all messages
 *------------------------------------------------------------------------
 */
    writeMessages (){
        for (var i=0 ; i < this.messages.length; i++){
            var message = this.messages[i] ;
            if (message.visible){
                this.fcontext.font = message.font ;
                this.fcontext.fillStyle = message.style ;
                this.fcontext.textAlign = message.align ;
                this.fcontext.fillText( message.text,
                                        this.canvas.width*message.x,
                                        this.canvas.height*message.y );
            }
        }
    }

/*------------------------------------------------------------------------
 * drawColorbar
 *------------------------------------------------------------------------
 */
    drawColorbar () {
        if (this.colorbar){
            this.fcontext.fillStyle = "#FFFFFF" ;
            this.fcontext.fillRect( this.canvas.width/4 - 40 ,
                                    this.canvas.height - 38,
                                    this.canvas.width/2 + 2*40  ,
                                    30 ) ;

            this.fcontext.fillStyle = "#000000" ;
            this.fcontext.textAlign = 'end' ;
            this.fcontext.fillText(     this.minValue + this.unit,
                                    this.canvas.width/4,
                                    this.canvas.height - 30 + 13) ;
            this.fcontext.textAlign = 'start' ;
            this.fcontext.fillText(     this.maxValue + this.unit,
                                    this.canvas.width*3/4,
                                    this.canvas.height - 30 + 13) ;


        this.fcontext.drawImage(    this.clrm.image,this.canvas.width/4,
                                    this.canvas.height - 30 ,
                                    this.canvas.width/2,16) ;
        }
        this.clrm.image.vrc = this ;
        this.clrm.image.init = function(e){
            e.path[0].vrc.initForeground() ;
            e.path[0].vrc.render() ;
        }
        this.clrm.image.onload = (e) => this.clrm.image.init(e) ;
    }

/*------------------------------------------------------------------------
 * showColorbar
 *------------------------------------------------------------------------
 */
    showColorbar (){
        this.colorbar = true ;
        this.initForeground() ;
    }

/*------------------------------------------------------------------------
 * hideColorbar
 *------------------------------------------------------------------------
 */
    hideColorbar (){
        this.colorbar = false ;
        this.initForeground() ;
    }

/*------------------------------------------------------------------------
 * initForeground
 *------------------------------------------------------------------------
 */
    initForeground () {
        this.fcontext.clearRect(    0,  0,
                                    this.canvas.width,
                                    this.canvas.height  ) ;
        this.writeMessages() ;
        this.drawColorbar() ;
    }

/*------------------------------------------------------------------------
 * setLightShift
 *------------------------------------------------------------------------
 */
    setLightShift (lf){
        this.lightShift = readOption(lf,    this.lightShift ) ;
        this.light.setUniform('lightShift', this.lightShift ) ;
        this.pass2.setUniform('lightShift', this.lightShift ) ;
        this.light.render() ;
    }

/*------------------------------------------------------------------------
 * setColormap
 *------------------------------------------------------------------------
 */
    setColormap (clrmName){
        if (clrmName != undefined ){
            this.clrmName = clrmName ;
        }
        this.clrm = this.colormaps[this.clrmName] ;
        this.pass2.setUniform( 'clrm', this.clrm.texture ) ;
        this.initForeground() ;
    }

/*------------------------------------------------------------------------
 * setMinValue
 *------------------------------------------------------------------------
 */
    setMinValue (val){
        this.minValue = val ;
        this.pass2.setUniform('minValue', this.minValue ) ;
        this.light.setUniform('minValue', this.minValue ) ;
        this.light.render() ;
        this.initForeground() ;
    }

/*------------------------------------------------------------------------
 * setMaxValue
 *------------------------------------------------------------------------
 */
    setMaxValue (val){
        this.maxValue = val ;
        this.pass2.setUniform('maxValue', this.maxValue ) ;
        this.light.setUniform('maxValue', this.maxValue ) ;
        this.light.render() ;
        this.initForeground() ;
    }

/*-------------------------------------------------------------------------
 * setThreshold
 *-------------------------------------------------------------------------
 */
    setThreshold (val){
        this.threshold = readOption(val, this.threshold ) ;
        this.light.setUniform('threshold', this.threshold ) ;
        this.pass2.setUniform('threshold', this.threshold ) ;
    }

/*------------------------------------------------------------------------
 * setAlphaCorrection
 *------------------------------------------------------------------------
 */
    setAlphaCorrection (ac){
        this.alphaCorrection = readOption(ac, this.alphaCorrection) ;
        this.light.setUniform('alphaCorrection', this.alphaCorrection) ;
        this.pass2.setUniform('alphaCorrection', this.alphaCorrection) ;
        this.light.render() ;
    }

/*------------------------------------------------------------------------
 * setNoSteps
 *------------------------------------------------------------------------
 */
    setNoSteps (_ns){
        this.noSteps = readOption(_ns, this.noSteps) ;
        this.pass2.setUniform('noSteps', this.noSteps ) ;
    }

/*------------------------------------------------------------------------
 * setRayCast
 *------------------------------------------------------------------------
 */
    setRayCast (_rc){
        this.rayCast = readOption(_rc, this.rayCast ) ;
        this.pass2.setUniform('rayCast', this.rayCast) ;
    }

/*------------------------------------------------------------------------
 * toggleRayCast
 *------------------------------------------------------------------------
 */
    toggleRayCast (){
        this.rayCast != this.rayCast ;
        this.setRayCast() ;
    }

/*------------------------------------------------------------------------
 * setShowXCut
 *------------------------------------------------------------------------
 */
    setShowXCut(_sc){
        this.showXCut = readOption(_sc, this.showXCut ) ;
        this.pass2.setUniform('showXCut', this.showXCut ) ;
    }

/*------------------------------------------------------------------------
 * setShowYCut
 *------------------------------------------------------------------------
 */
    setShowYCut(_sc){
        this.showYCut = readOption(_sc, this.showYCut ) ;
        this.pass2.setUniform('showYCut', this.showYCut ) ;
    }

/*------------------------------------------------------------------------
 * setShowZCut
 *------------------------------------------------------------------------
 */
    setShowZCut(_sc){
        this.showZCut = readOption(_sc, this.showZCut ) ;
        this.pass2.setUniform('showZCut', this.showZCut ) ;
    }

/*------------------------------------------------------------------------
 * setXLevel
 *------------------------------------------------------------------------
 */
    setXLevel (_l){
        this.xLevel = readOption(_l, this.xLevel ) ;
        this.pass2.setUniform('xLevel', this.xLevel ) ;
    }

/*------------------------------------------------------------------------
 * setYLevel
 *------------------------------------------------------------------------
 */
    setYLevel (_l){
        this.yLevel = readOption(_l, this.yLevel ) ;
        this.pass2.setUniform('yLevel', this.yLevel ) ;
    }

/*------------------------------------------------------------------------
 * setZLevel
 *------------------------------------------------------------------------
 */
    setZLevel (_l){
        this.zLevel = readOption(_l, this.zLevel ) ;
        this.pass2.setUniform('zLevel', this.zLevel ) ;
    }

/*------------------------------------------------------------------------
 * setDrawFilament
 *------------------------------------------------------------------------
 */
    setDrawFilament (_df){
        this.drawFilament = readOption(_df, this.drawFilament) ;
        this.pass2.setUniform('drawFilament',this.drawFilament) ;
    }

/*------------------------------------------------------------------------
 * showFilamend
 *------------------------------------------------------------------------
 */
    showFilamend (){
        this.setDrawFilament(true) ;
    }

/*------------------------------------------------------------------------
 * hideFilament
 *------------------------------------------------------------------------
 */
    hideFilament (){
        this.setDrawFilament(false) ;
    }

/*------------------------------------------------------------------------
 * toggleFilament
 *------------------------------------------------------------------------
 */
    toggleFilament (){
        this.drawFilament != this.drawFilament() ;
        this.pass2.setUniform('drawFilament',this.drawFilament) ;
    }

/*------------------------------------------------------------------------
 * setFilamentThreshold
 *------------------------------------------------------------------------
 */
    setFilamentThreshold (_ft){
        this.filamentThreshold = readOption(_ft, this.filamentThreshold) ;
        this.filament.setUniform('filamentThreshold',
                this.filamentThreshold) ;
    } ;

/*------------------------------------------------------------------------
 * setFilamentBorder
 *------------------------------------------------------------------------
 */
    setFilamentBorder (_fb){
        this.filamentBorder = readOption(_fb, this.filamentBorder ) ;
        this.filament.setUniform('filamentBorder', this.filamentBorder) ;
    }

/*------------------------------------------------------------------------
 * setFilamentColor
 *------------------------------------------------------------------------
 */
    setFilamentColor (_fc){
        this.filamentColor = readOption(_fc, this.filamentColor ) ;
        this.pass2.setUniform('filamentColor', this.filamentColor ) ;
    }

/*------------------------------------------------------------------------
 * render
 *------------------------------------------------------------------------
 */
    rrender (){

        if ( !this.rayCast && this.drawFilament){
            this.filament.render() ;
            if ( !this.prevDefined )
                this.copyTrgt2Prev.render() ;
        }
        var s = this.scale ;
        if (gl.canvas.width!=this.canvas.width) {
            gl.canvas.width = this.canvas.width ;
        }if (gl.canvas.height != this.canvas.height){
            gl.canvas.height= this.canvas.height ;
        }
        gl.viewport(0,0, this.canvas.width, this.canvas.height) ;
        this.context.clearRect(  0 ,   0,
                                this.canvas.width,
                                this.canvas.height  ) ;
        this.controler.update() ;
        mat4.scale( this.viewMatrix, this.viewMatrix, [s,s,s,s] ) ;
        this.pass1.setUniform('viewMatrix', this.viewMatrix) ;
        this.pass2.setUniform('viewMatrix', this.viewMatrix) ;
        this.frameSol.setUniform('viewMatrix',this.viewMatrix) ;
        this.pass1.render() ;
        this.pass2.render() ;
        this.context.drawImage(  gl.canvas,0,0       ) ;
        if ( !this.usePhaseField ){
            this.frameSol.render() ;
            this.context.drawImage(  gl.canvas,0,0       ) ;
        }
        this.context.drawImage(  this.fcanvas, 0,0   ) ;
    }

    render (){
        this.rrender() ;
        this.rrender() ;
    }
}

/*========================================================================
 * TextureTableBond
 *========================================================================
 */ 
class Float32TextureTableBond{
    
/*------------------------------------------------------------------------
 * constructor
 *------------------------------------------------------------------------
 */
    constructor( options={}){
        if ( options.target == undefined && options.texture == undefined ){
            return null ;
        } ;

        this.texture = readOptions( options.target , null ) ;
        this.texture = readOptions( options.texture, this.target ) ;
    
        this.framebuffer = gl.createFramebuffer() ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this.framebuffer) ;
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D,
                                this.target.texture, 0 ) ;
        gl.readBuffer( gl.COLOR_ATTACHMENT0 ) ;
        this.canRead    = (
            gl.checkFramebufferStatus(gl.READ_FRAMEBUFFER)
            == gl.FRAMEBUFFER_COMPLETE
        ) ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null) ;

        this.width  = this.target.width ;
        this.height = this.target.height ;
        this.table   = readOption(options.table, 
                new Float32Array(this.width*this.height*4 ) ) ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * getter and setter functions
 *------------------------------------------------------------------------
 */
    get texture(){ return this._texture ; }
    set texture(v){ this._texture = v ; } 
    
    get target(){ return this.texture ; }
    set target(val){ 
        this._texture = val ; 
    }

/*------------------------------------------------------------------------
 * setTexture
 *------------------------------------------------------------------------
 */
    setTexture(trgt){
        this.target = readOption( trgt, this.target ) ;
    }
    
/*------------------------------------------------------------------------
 * tex2tab
 *------------------------------------------------------------------------
 */
    tex2tab(txt){
        this.target = readOption(txt, this.target) ;

        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this.framebuffer) ;
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D,
                            this.target.texture, 0 ) ;
        gl.readBuffer( gl.COLOR_ATTACHMENT0 ) ;
        gl.readPixels(  0, 0,this.width,this.height, 
                gl.RGBA, gl.FLOAT, this.table ) ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null) ;   
    }

/*------------------------------------------------------------------------
 * tab2tex
 *------------------------------------------------------------------------
 */
    tab2tex(tab){
        this.table = readOption(tab, this.table ) ;
        gl.bindTexture(gl.TEXTURE_2D, this.target.texture ) ;
        gl.texImage2D( gl.TEXTURE_2D, 0 , gl.RGBA32F,
        this.width, this.height, 0, gl.RGBA, gl.FLOAT, this.table ) ;
        gl.bindTexture(gl.TEXTURE_2D, null) ;
    }

}

/*========================================================================
 * Probe  : probe a location for the value of a channel
 *
 * options:
 *      - renderer  : renderer to be used (compulsory)
 *      - target    : render target to be probed ( compulsory )
 *      - channel   : preferred probed channel (r,g,b,a -- default = a )
 *      - probePosition   : position of the probe
 *========================================================================
 */
class Probe{
    constructor( target, options={} ){
        this.channel = readOption( options.channel, 'r') ;
        this.probePosition = readOption( options.probePosition, [0.5,0.5]) ;


        if ( target != undefined ){
            this.target = target ;
        }else return null ;
        this.channelMultiplier =
            getChannelMultiplier( this.channel ) ;


        this.pixelValue = new Float32Array(4) ;

/*------------------------------------------------------------------------
 * framebuffer
 *------------------------------------------------------------------------
 */
        this.framebuffer = gl.createFramebuffer() ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this.framebuffer) ;
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D,
                                this.target.texture, 0 ) ;
        gl.readBuffer( gl.COLOR_ATTACHMENT0 ) ;
        this.canRead    = (
            gl.checkFramebufferStatus(gl.READ_FRAMEBUFFER)
            == gl.FRAMEBUFFER_COMPLETE
        ) ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null) ;

    } 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * setPosition
 *------------------------------------------------------------------------
 */
    setPosition (pos){
        this.probePosition = readOption( pos , this.probePosition ) ;
    }

    set position(pos){
        this.probePosition = pos ;
    }
    get position(){
        return this.probePosition ;
    }

/*------------------------------------------------------------------------
 * setChannel
 *------------------------------------------------------------------------
 */
    setChannel(c){
        this.channel = c ;
        this.channelMultiplier =
            getChannelMultiplier( this.channel ) ;
    }

    set channel(c){
        this._channel = c ;
        this.channelMultiplier = getChannelMultiplier(this.channel) ;
    }
    get channel(){
        return this._channel ;
    }

/*------------------------------------------------------------------------
 * setTarget
 *------------------------------------------------------------------------
 */
    setTarget(trgt){
        this.target = trgt ;
    }

    set target(t){
        this._target = t ;
    }
    get target(){
        return this._target ;
    }

/*------------------------------------------------------------------------
 * getPixel : get the value of whole pixel
 *------------------------------------------------------------------------
 */
    getPixel(){
        if (this.canRead){
        var x = Math.floor(this.target.width   * this.probePosition[0]) ;
        var y = Math.floor(this.target.height  * this.probePosition[1]) ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this.framebuffer) ;
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D,
                            this.target.texture, 0 ) ;
        gl.readBuffer( gl.COLOR_ATTACHMENT0 ) ;
        gl.readPixels(  x, y,1,1, gl.RGBA, gl.FLOAT, this.pixelValue ) ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null) ;
        return this.pixelValue ;
        }else{
            return null ;
        }
    }

    get pixel(){
        return this.getPixel() ;
    }

/*------------------------------------------------------------------------
 * get      : get the value of a channel
 *------------------------------------------------------------------------
 */
    getValue (){
        this.getPixel() ;

        var g = this.pixelValue[0]*this.channelMultiplier[0] +
            this.pixelValue[1]*this.channelMultiplier[1] +
            this.pixelValue[2]*this.channelMultiplier[2] +
            this.pixelValue[3]*this.channelMultiplier[3] ;
        return g ;
    }

    get value(){
        return this.getValue() ;
    }

} /* end of Probe */

/*========================================================================
 * TextureReader
 *      target  : the target to read
 *========================================================================
 */
class TextureReader{
    constructor(target,options={}){
        if (target != undefined ){
            this._target = target ;
        }else return null ;
        
        this.framebuffer = gl.createFramebuffer() ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this.framebuffer) ;
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D,
                                this.target.texture, 0 ) ;
        gl.readBuffer( gl.COLOR_ATTACHMENT0 ) ;

        this._readable =  (
            gl.checkFramebufferStatus(gl.READ_FRAMEBUFFER)
            == gl.FRAMEBUFFER_COMPLETE
        ) ;
        gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null) ;

        this._buffer = new
            this.TypedArray(this.width*this.height*this.numberOfColors) ;
    }
/*------------------------------------------------------------------------
 * End of constructor
 *------------------------------------------------------------------------
 */
    get numberOfColors(){
        switch (GL(this.target.format)){
            case (gl.RED) : 
                return 1 ;
                break ;
            case (gl.RED_INTEGER)  :
                return 1 ;
                break ;
            case (gl.RG) :
                return 2 ;
                break ;
            case (gl.RG_INTEGER):
                return 2 ;
                break ;
            case (gl.RGB):
                return 3 ;
                break ;
            case (gl.RGB_INTEGER):
                return 3 ;
                break ;
            case (gl.RGBA):
                return 4 ;
                break ;
            case (gl.RGBA_INTEGER):
                return 4 ;
                break ;
            default :
                return 4 ;
                break ;
        }
    }

    get TypedArray(){
        switch ( GL(this.target.type) ){
            case (gl.BYTE):
                return Int8Array ;
                break ;
            case (gl.UNSIGNED_BYTE):
                return Uint8Array
                break ;

            case (gl.SHORT ) :
                return Int16Array ;
                break ;
            case (gl.UNSIGNED_SHORT ) :
                return Uint16Array ;
                break ;

            case (gl.INT ) :
                return Int32Array ;
                break ;
            case (gl.UNSIGNED_INT ) :
                return Uint32Array ;
                break ;

            case (gl.HALF_FLOAT ) :
                return Float16Array ;
                break ;
            case (gl.FLOAT ) :
                return Float32Array ;
                break ;
            default : 
                return Float32Array ;
        }
    }

    get format(){
        return this.target.format ;
    }

    get type(){
        return this.target.type ;
    }
    get target(){
        return this._target ;
    }

    get width(){
        return this.target.width ;
    }

    get height(){
        return this.target.height ;
    }

    get readable(){
        return this._readable ;
    }

    get buffer(){
        if(this.readable){
            gl.bindFramebuffer( 
                    gl.READ_FRAMEBUFFER, 
                    this.framebuffer        ) ;

            gl.framebufferTexture2D(
                    gl.READ_FRAMEBUFFER, 
                    gl.COLOR_ATTACHMENT0,
                    gl.TEXTURE_2D,
                    this.target.texture, 0  ) ;

            gl.readBuffer( gl.COLOR_ATTACHMENT0 ) ;

            gl.readPixels(  0, 0,this.width,this.height, 
                    GL(this.format), GL(this.type) , this._buffer ) ;

            gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null) ;

            return this._buffer ;
        }else return null ;
    }

    get value(){
        return this.buffer ;
    }

    read(){
        return this.value ;
    }
}

/*========================================================================
 * ProbeRecorder
 *========================================================================
 */
class ProbeRecorder{
    constructor(probe, options){
        this.probe = probe ;
        this.sampleRate = 1 ;
        this.lastRecordedTime = -1 ;
        this.timeSeries = [] ;
        this.samples    = [] ;
        this.recording = false ;
        this.fileName ='samples.csv' ;

        if (options != undefined ){
            if (options.sampleRate != undefined){
                this.sampleRate = options.sampleRate ;
            }

            if (options.recording != undefined ){
                this.recording = options.recording ;
            }

            if (options.fileName != undefined ){
                this.fileName = options.fileName ;
            }
        }
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * record(time) :   records probe with the required sample rate if
 *                  recording is requested.
 *
 *       time   :   recording current time ;
 *------------------------------------------------------------------------
 */
    record(time){
        if (this.recording){
            if (time > (this.lastRecordedTime + this.sampleRate)){
                this.timeSeries.push(time) ;
                this.lastRecordedTime = time ;
                this.samples.push(this.probe.getValue()) ;
            }
        }
    }

/*------------------------------------------------------------------------
 * stop         : stop recording
 *------------------------------------------------------------------------
 */
    stop(){
        this.recording = false ;
    }

/*------------------------------------------------------------------------
 * start        : start recording
 *------------------------------------------------------------------------
 */
    start(){
        this.recording = true ;
    }

/*------------------------------------------------------------------------
 * setRecordingStatus(recording)    : set this.recording
 *------------------------------------------------------------------------
 */
    setRecordingStatus(recording){
        this.recording = recording  ;
    }

/*------------------------------------------------------------------------
 * toggleRecording  : toggle recording status
 *------------------------------------------------------------------------
 */
    toggleRecording (){
        this.recording = !(this.recording) ;
    }

/*------------------------------------------------------------------------
 * setSampleRate(sampeRate)
 *------------------------------------------------------------------------
 */
    setSampleRate(sampleRate){
        this.sampleRate = sampleRate ;
    }

/*------------------------------------------------------------------------
 * setProbe(probe)  : set a new probe
 *------------------------------------------------------------------------
 */
    setProbe(pb){
        this.probe = pb ;
    }

/*------------------------------------------------------------------------
 * setFileName(fileName)
 *------------------------------------------------------------------------
 */
    setFileName (fn){
        this.fileName = fn ;
    }

/*------------------------------------------------------------------------
 * resetRecording
 *------------------------------------------------------------------------
 */
    resetRecording (){
        this.timeSeries = [] ;
        this.samples    = [] ;
        this.lastRecordedTime = -1 ;
    }
/*------------------------------------------------------------------------
 * reset
 *------------------------------------------------------------------------
 */
    reset (){
        this.resetRecording() ;
    }

/*------------------------------------------------------------------------
 * save
 *------------------------------------------------------------------------
 */
    save (){
        var csvContent = "data:text;charset=utf-8,";
        for(var i=0;i<this.samples.length;i++){
            csvContent+= this.timeSeries[i]+'\t'+this.samples[i]+'\n' ;
        }
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", this.fileName);
        link.click() ;
    }

}   /* end of ProbeRecorder */

/*========================================================================
 * IntervalCaller
 *========================================================================
 */
class IntervalCaller{
    constructor( options={} ){
        this.interval = readOption(options.interval, 1      ) ;
        this.callback = readOption(options.callback, function(){} ) ;
        this.active   = readOption(options.active, false    ) ;
        this.lastCall = readOption(options.currTime, 1e10   ) ;

        this.timeDiff = 0 ;
        this.lastCall = -1e10 ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * setInetrval
 *------------------------------------------------------------------------
 */
    reset(){
        this.lastCall = -1e10 ;
    }

/*------------------------------------------------------------------------
 * setInetrval
 *------------------------------------------------------------------------
 */
    setInterval (intr){
        this.interval = intr ;
    }

/*------------------------------------------------------------------------
 * toggleActive
 *------------------------------------------------------------------------
 */
    toggleActive(){
        this.active = !(this.active) ;
    }

/*------------------------------------------------------------------------
 *
 *------------------------------------------------------------------------
 */
    toggle (){
        this.active = !this.active ;
    }

/*------------------------------------------------------------------------
 * setActive
 *------------------------------------------------------------------------
 */
    setActive(){
        this.active = true ;
    }

/*------------------------------------------------------------------------
 * setInactive
 *------------------------------------------------------------------------
 */
    setInactive(){
        this.active = false ;
    }

/*------------------------------------------------------------------------
 * setActivity
 *------------------------------------------------------------------------
 */
    setActivity (state){
        this.active = readOption(state, this.active ) ;
    }

/*------------------------------------------------------------------------
 * setCallback
 *------------------------------------------------------------------------
 */
    setCallback (cb){
        this.callback = cb ;
    }

/*------------------------------------------------------------------------
 * call the callback function if necessary
 *------------------------------------------------------------------------
 */
    call (ctime){
        if (this.lastCall > ctime ){
            this.lastCall = ctime  ;
        }
        this.timeDiff = ctime - this.lastCall ;
        if ( this.timeDiff >= this.interval ){
            this.lastCall = ctime ;
            this.timeDiff = 0 ;
            if ( this.active == true ){
                this.callback() ;
            }
        }
    }
} /* end of IntervalCaller */

/*========================================================================
 * saveCanvas
 *========================================================================
 */
function saveCanvas(canvasId, options){
    var link = document.createElement('a') ;
    link.href = document.getElementById(canvasId).toDataURL() ;

    var prefix   = '' ;
    var postfix  = '' ;
    var number   = '' ;
    var format   = 'png' ;
    var download = 'download';

    if ( options != undefined ){
        if ( options.prefix != undefined ){
            prefix = options.prefix ;
            download = '' ;
        }

        if ( options.postfix != undefined ){
            postfix = options.postfix ;
            download = '' ;
        }

        if ( options.number != undefined ){
            download = '' ;
            var t = Math.floor(options.number) ;
            if ( t<1000 ){
                number = '000'+ t.toString() ;
            }else if (t<10000){
                number = '00'+t.toString() ;
            }else if (t<100000){
                number = '0'+t.toString() ;
            }else{
                number = t.toString() ;
            }
        }

        if (options.format != undefined ){
            format = options.format ;
        }
    }

    link.download = download + prefix + number + postfix + '.' + format ;
    var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });

    link.dispatchEvent(clickEvent) ;
} /* end of saveCanvas */

/*========================================================================
 * APD
 *========================================================================
 */
class APD{
    constructor( target,  opts={}){
        this.target         = target ;
        this.currVal        = undefined ;
        this.apCounts       = readOption( opts.apCounts,    10  ) ;
        this.threshold      = readOption( opts.threshold,   -75 ) ;
        this.channel        = readOption( opts.channel,     'r' ) ;
        this.avgApd         = 0;
        this.noApsMeasured  = 0 ;
        this.measuring      = readOption( opts.measuring , false ) ;
        this.apStarted      = false ;
        this.apIncomplete   = true ;
        this.apStartTime    = undefined ;
        this.apEndTime      = undefined ;
        this.apd            = undefined ;
        this.probePosition = readOption( opts.probePosition, [.5,.5] ) ;

        this.probe = new Probe(this.target, {
                channel : this.channel,
                probePosition : this.probePosition } ) ;
    }
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 * CONSTRUCTOR ENDS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/*------------------------------------------------------------------------
 * getAvgApd    : getAvgValue of APD
 *------------------------------------------------------------------------
 */
    getAvgApd(){
        return this.avgApd ;
    }

/*------------------------------------------------------------------------
 * setMeasuring
 *------------------------------------------------------------------------
 */
    setMeasuring ( measuring ){
        this.measuring = readOption( measuring, this.measuring ) ;
    }

/*------------------------------------------------------------------------
 * toggleMeasuring
 *------------------------------------------------------------------------
 */
    toggleMeasuring (){
        this.measuring = ! this.measuring ;
    }

/*------------------------------------------------------------------------
 * startMeasuring
 *------------------------------------------------------------------------
 */
    startMeasuring (){
        this.measuring = true ;
    }

/*------------------------------------------------------------------------
 * stopMeasuring
 *------------------------------------------------------------------------
 */
    stopMeasuring (){
        this.measuring = false ;
    }


/*------------------------------------------------------------------------
 * reset
 *------------------------------------------------------------------------
 */
    reset (ropts={}){
        this.noApsMeasured  = 0 ;
        this.apStarted      = false ;
        this.apIncomplete   = true ;
        this.apStartTime    = undefined ;
        this.apEndTime      = undefined ;
        this.apd            = 0 ;
        this.avgApd         = 0 ;
        this.apCounts =
            readOption( ropts.apCounts, this.apCounts ) ;
        this.threshold =
            readOption ( ropts.threshold, this.threshold);
        this.channel =
            readOption( ropts.channel, this.channel ) ;
        this.target =
            readOption( ropts.target, this.target ) ;
        this.probePosition =
            readOption( ropts.probePosition, this.probePosition ) ;
        this.measuring = readOption( ropts.measuring, this.measuring ) ;

        this.probe.setChannel(this.channel) ;
        this.probe.setPosition(this.probePosition) ;
        this.probe.setTarget(this.target) ;
    }

/*------------------------------------------------------------------------
 * measure      : measure APD
 *------------------------------------------------------------------------
 */
    measure ( currTime ){
        if ( ! this.measuring ){
            return ;
        }
        if ( this.noApsMeasured >= this.apCounts )
            return this.getAvgApd() ;

        this.currVal = this.probe.getValue() ;
        if (this.apIncomplete){
            /*  check if A.P.
                just completed       */
            if (this.currVal < this.threshold){
                this.apIncomplete = false ;
                this.apEndTime = currTime ;
                if (this.apStarted){
                    this.apd = this.apEndTime - this.apStartTime ;
                    this.avgApd =
                        (this.apd + this.avgApd*this.noApsMeasured)/
                        (this.noApsMeasured+1) ;
                    this.noApsMeasured += 1 ;
                    this.apStarted = false ;
                }
            }
        }else if (!this.apStarted){
            /*  Check if a new A.P.
                just started        */
            if( this.currVal > this.threshold ){
                this.apStarted      = true ;
                this.apIncomplete   = true;
                this.apStartTime    = currTime ;
            }
        }

        return this.getAvgApd() ;
    } /* end of measure */

} /* end of APD */

/*========================================================================
 * resizeRenderTargets
 *========================================================================
 */
function resizeRenderTargets( targets, width, height ){
    for (var i=0 ; i< targets.length;  i++  ){
        targets[i].resize(width,height) ;
    }
    return ;
}

/*========================================================================
 * setUniformInSolvers
 *========================================================================
 */
function setUniformInSolvers( name,value, solvers ){
    for( var i=0; i< solvers.length; i++ ){
        solvers[i].setUniform(name , value ) ;
    }
    return ;
}

/*========================================================================
 * setUniformsInSolvers
 *========================================================================
 */
function setUniformsInSolvers( names, values, solvers ){
    for (var i=0; i < names.length; i++){
        setUniformInSolvers( names[i], values[i], solvers ) ;
    }
}

/*========================================================================
 * CtrlClickListener
 *========================================================================
 */
function CtrlClickListener( __object, __callback, options={}){
    this.object     = __object ;
    this.callback   = __callback ;
    this.onClick    = function(e){
        if ( e.ctrlKey & !e.shiftKey ){
            if ( (e.type == 'click') || (e.buttons >=1)){
                e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;
                this.callback(e) ;
            }
        }
    }

    this.mousemove  = readOption(options.mousemove, false   ) ;
    this.click      = readOption(options.click, true        ) ;

    if ( this.mousemove ){
        this.object.addEventListener(
            'mousemove',
            (e) => this.onClick(e),
            false
        ) ;
    }

    if (this.click){
        this.object.addEventListener(
            'click',
            (e) => this.onClick(e),
            false
        ) ;
    }
}

/*========================================================================
 * ShiftClickListener
 *========================================================================
 */
function ShiftClickListener( __object, __callback, options={}){
    this.object     = __object ;
    this.callback   = __callback ;
    this.onClick    = function(e){
        if ( e.shiftKey & !e.ctrlKey ){
            if ( (e.type == 'click') || (e.buttons >=1)){
                e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;
                this.callback(e) ;
            }
        }
    }

    this.mousemove  = readOption(options.mousemove, false   ) ;
    this.click      = readOption(options.click, true        ) ;

    if ( this.mousemove ){
        this.object.addEventListener(
            'mousemove',
            (e) => this.onClick(e),
            false
        ) ;
    }

    if (this.click){
        this.object.addEventListener(
            'click',
            (e) => this.onClick(e),
            false
        ) ;
    }
}

/*========================================================================
 * CommandClickListener
 *========================================================================
 */ 
function CommandClickListener(__object, __callback, options={}){
    this.object     = __object ;
    this.callback   = __callback ;
    this.onClick    = function(e){
        if ( !e.shiftKey & e.metaKey ){
            if ( (e.type == 'click') || (e.buttons >=1)){
                e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;
                this.callback(e) ;
            }
        }
    }

    this.mousemove  = readOption(options.mousemove, false   ) ;
    this.click      = readOption(options.click, true        ) ;

    if ( this.mousemove ){
        this.object.addEventListener(
            'mousemove',
            (e) => this.onClick(e),
            false
        ) ;
    }

    if (this.click){
        this.object.addEventListener(
            'click',
            (e) => this.onClick(e),
            false
        ) ;
    }
}

/*========================================================================
 * DoubleClickListener
 *========================================================================
 */
function DoubleClickListener(__object, __callback, options={}){
    this.object = __object ;
    this.callback = __callback ;
    this.onClick = function(e){
        e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;

        var clickTime = new Date().getTime();
        var deltaT = clickTime - gl.lastClickTime ;
        gl.lastClickTime = clickTime ;
        if (deltaT>600) {
            return ;
        }
        this.callback(e) ;
    }
    this.object.addEventListener(
            'mousedown',
            (e) => this.onClick(e),
            false ) ;
}

/*========================================================================
 * LongClickListener
 *========================================================================
 */
function LongClickListener( __object, __callback, options={}){
    this.object = __object ;
    this.callback = __callback ;
    this.duration = readOptions( options.duration, 1000 ) ;
    this.movementTolerance =
        readOptions( options.movementTolerance, 0.05 ) ;

    this.onMousedown = function(e){
        e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;
        gl.__clickPosition = e.position ;
        var clickTime = new Date().getTime();
        gl.lastClickTime = clickTime ;
    }

    this.onMouseup = function(e){
        e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;
        var releaseTime = new Date().getTime() ;
        var deltaT = releaseTime - gl.lastClickTime ;
        var deltaX = e.position[0] - gl.__clickPosition[0] ;
        var deltaY = e.position[1] - gl.__clickPosition[1] ;
        var deltaL = Math.sqrt( deltaX*deltaX + deltaY*deltaY ) ;

        if (    (deltaT > this.duration) &&
                (deltaL < this.movementTolerance )
            ){
            this.callback(e) ;
        }

    }

    this.object.addEventListener(
            'mousedown',
            (e) => this.onMousedown(e),
            false ) ;
    this.object.addEventListener(
            'mouseup',
            (e) => this.onMouseup(e),
            false ) ;

}

/*========================================================================
 * CtrlShiftClickListener
 *========================================================================
 */
function CtrlShiftClickListener( __object, __callback, options={}){
    this.object     = __object ;
    this.callback   = __callback ;
    this.onClick    = function(e){
        if ( e.shiftKey & e.ctrlKey ){
            if ( (e.type == 'click') || (e.buttons >=1)){
                e.position = [
                    e.offsetX/this.object.width ,
                    1.-e.offsetY/this.object.height
                ] ;
                this.callback(e) ;
            }
        }
    }

    this.mousemove  = readOption(options.mousemove, false   ) ;
    this.click      = readOption(options.click, true        ) ;

    if ( this.mousemove ){
        this.object.addEventListener(
            'mousemove',
            (e) => this.onClick(e),
            false
        ) ;
    }

    if (this.click){
        this.object.addEventListener(
            'click',
            (e) => this.onClick(e),
            false
        ) ;
    }
}


/*========================================================================
 * ClickListener
 *========================================================================
 */
function ClickListener( __object, __callback, options={}){
    this.object     = __object ;
    this.callback   = __callback ;
    this.onClick    = function(e){
        var deltaT = clickTime - gl.lastClickTime ;
        gl.lastClickTime = new Date().getTime() ;
        if (deltaT<600) {
            return ;
        }

        if ( (e.type == 'click') || (e.buttons >=1)){
            e.position = [
                e.offsetX/this.object.width ,
                1.-e.offsetY/this.object.height
            ] ;
            this.callback(e) ;
        }
    }


    this.mousemove  = readOption(options.mousemove, false   ) ;
    this.click      = readOption(options.click, true        ) ;

    if ( this.mousemove ){
        this.object.addEventListener(
            'mousemove',
            (e) => this.onClick(e),
            false
        ) ;
    }

    if (this.click){
        this.object.addEventListener(
            'click',
            (e) => this.onClick(e),
            false
        ) ;
    }
}

/*========================================================================
 * Storage : Store Values using LocalStorage
 *========================================================================
 */
class Storage{
    constructor(options={}){
        this.storage = localStorage ;
        this.prefix = readOption( options.prefix, "") ;
    }

/*------------------------------------------------------------------------
 * store
 *------------------------------------------------------------------------
 */
    store(name, value){
        this.storage.setItem(this.prefix+name, value) ;
    }

/*------------------------------------------------------------------------
 * get
 *------------------------------------------------------------------------
 */
    get(name){
        return this.storage.getItem(this.prefix+name) ;
    }

/*------------------------------------------------------------------------
 * getFloat
 *------------------------------------------------------------------------
 */
    getFloat(name){
        return parseFloat(this.get(name)) ;
    }

/*------------------------------------------------------------------------
 * storeList
 *------------------------------------------------------------------------
 */
    storeList( names, values ){
        for(var i=0; i<names.length; i++){
            this.store(names[i], values[i]) ;
        }
    }

/*------------------------------------------------------------------------
 * restoreFloatList
 *------------------------------------------------------------------------
 */
    restoreFloatList( vars, names ){
        for(var i=0; i< vars.length ; i++){
            vars[i] = this.getFloat( names[i]) ;
        }
    }

/*------------------------------------------------------------------------
 * restoreValue
 *------------------------------------------------------------------------
 */
    restoreValue( variable, name ){
        variable = this.get(name) ;
    }

/*------------------------------------------------------------------------
 * storeAsXML
 *------------------------------------------------------------------------
 */
    storeAsXML(options={}){
        var xml = readOption(options.xml, undefined ) ;
        var obj = readOption(options.object,undefined) ;
        obj = readOption(options.obj, obj ) ;
        if( obj == undefined ){
            warn('You need to define "object"') ;
        }

        var names = readOption(options.names, [] ) ;


        function xmlAdd( name, value ){
            var type = typeof(value) ;
            return '\t<data id="'+
                                name+
                '" type="'
                                +type+'">'
                                            +value+
            '</data>\n' ;
        }

        var fileName = readOption(options.fileName, 'download.xml') ;
        var stream =  '<?xml version="1.0" encoding="utf-8"?>\n' ;
        stream += '<xml>\n' ;

        for( var i=0 ; i< names.length ; i++){
            var name = names[i] ;
            stream += xmlAdd( name , obj[name] ) ;
        }
        stream += '</xml>' ;

        this.store(xml, stream) ;
    }

/*------------------------------------------------------------------------
 * restoreFromXML
 *------------------------------------------------------------------------
 */
    restoreFromXML(options={}){
        var xml = readOption(options.xml, undefined ) ;
        var obj = readOption(options.object,undefined) ;
        obj = readOption(options.obj, obj ) ;
        if( obj == undefined ){
            warn('You need to define "object"') ;
        }
        var names = readOption(options.names, undefined , 'You need to define "names"' ) ;

        if ( obj == undefined || names == undefined ){
            warn( 'Insuficient information was provided' ) ;
            warn( 'Exit without loading from XML file') ;
            return ;
        }
        var callback = readOption(options.callback, function(){} ) ;

        var stream = this.get(xml) ;

        if (stream){
            var parser = new DOMParser() ;
            var doc = parser.parseFromString(stream, "text/xml") ;

            for (var i=0; i<names.length ; i++){
                var name = names[i] ;
                var v = doc.getElementById(name) ;
                var type ;
                if (v){
                    type = v.getAttribute('type') ;
                    switch (type){
                        case 'number':
                            obj[name] = eval( v.innerHTML ) ;
                            break ;
                        case 'boolean':
                            obj[name] = eval( v.innerHTML ) ;
                            break ;
                        case 'object':
                            var strArray = v.innerHTML.split(',') ;
                            for(var i=0 ; i<strArray.length; i++){
                                obj[name][i] = eval(strArray[i]) ;
                            }
                            break ;

                        default:
                            obj[name] = v.innerHTML ;
                            break ;
                    }
                }
            }
            callback() ;
        }
    }
} /* end of Storage Class */

/*=========================================================================
 * saveToXML    :   save variables from and object to xml file
 *
 *      options :
 *          - obj   :   parent object that contains variables
 *          - names :   array of names of children of the obj to be saved
 *          - fileName: default name for the xml file to be saved to disk
 *=========================================================================
 */
    function saveToXML( options={}){
        var obj = readOption(options.object,undefined) ;
        obj = readOption(options.obj, obj ) ;
        if( obj == undefined ){
            warn('You need to define "object"') ;
        }
        var names = readOption(options.names, [] ) ;


        function xmlAdd( name, value ){
            var type = typeof(value) ;
            return '\t<data id="'+
                                name+
                '" type="'
                                +type+'">'
                                            +value+
            '</data>\n' ;
        }

        var fileName = readOption(options.fileName, 'download.xml') ;
        var stream =  '<?xml version="1.0" encoding="utf-8"?>\n' ;
        stream += '<xml>\n' ;

        for( var i=0 ; i< names.length ; i++){
            var name = names[i] ;
            stream += xmlAdd( name , obj[name] ) ;
        }
        stream += '</xml>' ;

        var link = document.createElement('a') ;
        link.download = fileName ;
        var blob = new Blob([stream], {type:'text/plain'});

        if (window.URL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            link.href =
                window.URL.createObjectURL(blob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            link.href =
                window.URL.createObjectURL(blob);
            link.onclick = destroyClickedElement;
            link.style.display = "none";
            document.body.appendChild(link);
        }
        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });

        link.dispatchEvent(clickEvent) ;
    }

/*========================================================================
 * xorwow   : creates a random integer between 0 and (2^32-1)
 *========================================================================
 */  
    var randomState = new Uint32Array(5) ;
    randomState[0] = 123456789 ;
    randomState[1] = 362436069 ;
    randomState[2] = 521288629 ;
    randomState[3] = 88675123 ;
    randomState[4] = 5783321 ;

    function xorwow(){
        var s = new Uint32Array(1) ;
        var t = new Uint32Array(1) ;
        t[0]= randomState[3];
	t[0] ^= t[0] >> 2;
	t[0] ^= t[0] << 1;
	randomState[3] = randomState[2]; randomState[2] = randomState[1]; 
        s[0] = randomState[0]
        randomState[1] = s[0]  ;
	t[0] ^= s[0];
	t[0] ^= s[0] << 4;	
	randomState[0] = t[0];
        randomState[4] += 362437 ;
        s[0] =  t[0] + randomState[4] ;
	return s[0];
    }

/*========================================================================
 * random   : creates a 
 *========================================================================
 */ 
    function random(){
        return xorwow()/4294967295.0 ;
    }


/*========================================================================
 * TinyMT (Tiny Mersenne Twister) : A random number generator that can be
 * initialized using 3 values to create unique streams. Additionally, a
 * seed value can be used to uniformly initialize the processors.
 *
 * Usage : var tmt = new TinyMT(options) ;
 *
 * Options 
 * -------
 *      mat1  (default = 0)     : first  id
 *      mat2  (default = 0)     : second id
 *      tmat  (default = 0)     : tempering number
 *      seed  (default = 0)     : seed number for the generator
 *  
 *========================================================================
 */ 
class TinyMT{
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CONSTRUCTOR BEGINS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
    constructor(opts={}){
        // constants .....................................................
        this._MEXP      = 127 ;
        this._SH0       = 1 ;
        this._SH1       = 10 ;
        this._SH8       = 8 ;
        this._MASK      = 0x7fffffff ;
        this._MIN_LOOP  = 8 ;
        this._PRE_LOOP  = 8 ;

        // creating the unsigned variables ...............................
        this._state = new Uint32Array(4) ;
        this._mat   = new Uint32Array(4) ;

        // reading options ...............................................
        this._mat[0] = readOption(opts.mat1 , 0 ) ;
        this._mat[1] = readOption(opts.mat2 , 0 ) ;
        this._mat[2] = readOption(opts.tmat , 0 ) ;
        this._mat[3] = readOption(opts.seed , 0 ) ;
        this._linearityCheck = readOption( opts.linearityCheck, false) ;

        this.init() ;
    } // end of constructor ----------------------------------------------

/*------------------------------------------------------------------------
 * Getters and setters
 *------------------------------------------------------------------------
 */
    // getter only for constants and read-only variables ~~~~~~~~~~~~~~~~~
    get MEXP    (){ return this._MEXP       ; } 
    get SH0     (){ return this._SH0        ; }
    get SH1     (){ return this._SH1        ; }
    get SH8     (){ return this._SH8        ; }
    get MASK    (){ return this._MASK       ; }
    get MIN_LOOP(){ return this._MIN_LOOP   ; }
    get PRE_LOOP(){ return this._PRE_LOOP   ; }
    get state   (){ return this._state      ; }
    get mat     (){ return this._mat        ; }

    get mat1(){
        return this.mat[0] ;
    }
    set mat1(val){
        this.mat[0] = readOption(val, this._mat[0] ) ;
        this.init() ;
    }

    get mat2(){
        return this.mat[1] ;
    }
    set mat2(val){
        this.mat[1] = readOption(val, this.mat2) ;
        this.init() ;
    }

    get tmat(){
        return this.mat[2] ;
    }
    set tmat(v){
        this.mat[2] = readOptions(v, this.tmat) ;
        this.init() ;
    }

    get seed(){
        return this.mat[3] ;
    }
    set seed(v){
        this.mat[3] = readOptions(v, this.seed) ;
        this.init() ;
    }


    get linearityCheck(){
        return this._linearityCheck ;
    }
    set linearityCheck(v){
        this._linearityCheck = v ;
        this.init() ;
    }

/*------------------------------------------------------------------------
 * iterate to the next state 
 *------------------------------------------------------------------------
 */
    nextState(){
        let y = this.state[3];
        let x = (this.state[0] & this.MASK)
            ^ this.state[1]
            ^ this.state[2];
        x ^= (x << this.SH0);
        y ^= (y >>> this.SH0) ^ x;
        this.state[0] = this.state[1];
        this.state[1] = this.state[2];
        this.state[2] = x ^ (y << this.SH1);
        this.state[3] = y;
        this.state[1] ^= (-(y & 1)>>>0) & this.mat1;
        this.state[2] ^= (-(y & 1)>>>0) & this.mat2;
    }
    
/*------------------------------------------------------------------------
 * initialize the generator
 *------------------------------------------------------------------------
 */
    init() {
        this.state[0] = this.seed ;
        this.state[1] = this.mat1 ;
        this.state[2] = this.mat2 ;
        this.state[3] = this.tmat ;
        for (let i = 1; i < this.MIN_LOOP; i++) {
            const  a = i & 3 ;
            const  b = (i-1) & 3 ;
            this.state[a] ^= i + Math.imul(1812433253,
                 (this.state[b]
                   ^ (this.state[b] >>> 30)));
        }

        for (let i = 0; i < this.PRE_LOOP; i++) {
            this.nextState();
        }
    }

/*------------------------------------------------------------------------
 * temper : temper the output by breaking F_2 linearity
 *------------------------------------------------------------------------
 */
    temper(){
        let t0 = new Uint32Array(1) ;
        let t1 = new Uint32Array(1) ;
        t0[0] = this.state[3];
        if (this.linearityCheck){
            t1[0] = this.state[0] ^ (this.state[2] >>> this.SH8);
        }else{
            t1[0] = this.state[0] + (this.state[2] >>> this.SH8);
        }

        t0[0] ^= t1[0] ;
        t0[0] ^= (-(t1[0] & 1)>>>0) & this.tmat;
        return t0[0] ;
    }

/*------------------------------------------------------------------------
 * randomUint32: generate an Uint32 random number
 *------------------------------------------------------------------------
 */
    randomUint32(){
        this.nextState() ;
        return this.temper() ;
    }

/*------------------------------------------------------------------------
 * randomFloat: generate a float random number between 0 and 1 
 *------------------------------------------------------------------------
 */
    randomFloat(){
        return (this.randomUint32())/4294967295. ;
    }
}


/*=========================================================================
 * loadFromXML :
 *      options:
 *          - input     :   input element on the page which loads the file
 *          - obj       :   parent object to be loaded
 *          - names     :   list of names of children of obj to be loaded
 *                          from xml file
 *          - callback  :   callback function to call when loading is
 *                          finished
 *=========================================================================
 */
    function loadFromXML(options={}){
        var input = readOption(options.input,undefined,
                'You need define "input" option') ;
        var obj = readOption(options.object,undefined) ;
        obj = readOption(options.obj, obj ) ;
        if( obj == undefined ){
            warn('You need to define "object"') ;
        }
        var names = readOption(options.names, undefined ,
                'You need to define "names"' ) ;

        if (    input == undefined ||
                obj == undefined ||
                names == undefined ){
            warn( 'Insuficient information was provided' ) ;
            warn( 'Exit without loading from XML file') ;
            return ;
        }
        var callback = readOption(options.callback, function(){} ) ;

        var file = input.files[0] ;
        var reader = new FileReader();
        var savedXml ;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            savedXml = new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            savedXml=new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (file){
            reader.readAsDataURL(file) ;
        }


        reader.onload = function(){
            fileURL = reader.result ;

            savedXml.open("GET", fileURL, true);
            savedXml.send();

            savedXml.onreadystatechange = function() {
                if (savedXml.readyState == 4 && savedXml.status == 200) {
                    doc = savedXml.responseXML ;
                    for (var i=0; i<names.length ; i++){
                        var name = names[i] ;
                        var v = doc.getElementById(name) ;
                        var type ;
                        if (v){
                            type = v.getAttribute('type') ;
                            switch (type){
                                case 'number':
                                    obj[name] = eval( v.innerHTML ) ;
                                    break ;
                                case 'boolean':
                                    obj[name] = eval( v.innerHTML ) ;
                                    break ;
                                case 'object':
                                    var strArray = v.innerHTML.split(',') ;
                                    for(var i=0 ; i<strArray.length; i++){
                                        obj[name][i] = eval(strArray[i]) ;
                                    }
                                    break ;
                                default:
                                    obj[name] = v.innerHTML ;
                                    break ;
                            }
                        }
                    }
                    callback() ;
                } /* end of if Statement ) */
            } /* End of onreadystatechange */
        } /* End of reader.onload */
    }/* End of loadFromXML */

/*========================================================================
 * TextReader 
 *========================================================================
 */ 
class TextReader{
    constructor( options={} ){
        this._reader    = new FileReader() ;
        this.reader.owner = this ;
        this.reader.onload = function(){
            this.owner.content = this.result ;
            this.owner.callback() ;
        }

        this._input     = document.createElement('input') ;
        this.input.owner = this ;
        this.input.setAttribute('type', 'file') ;
        this.input.onchange = function(){
            var file = this.files[0] ;
            if (file){
                this.owner.reader.readAsText(file) ;
            }
        } ;

        this._content   = null ;

        this.callback = readOption(options.callback , function(){}  ) ;
        this.onload   = readOption(options.onload , this.callback   ) ;
    } /* End of Constructor */

    get click(){
        return this.input.click ;
    }
    get reader(){
        return this._reader ;
    }

    get target(){
        return this._target ;
    }

    set target(nt){
        this._target = nt ;
        this._target.content = this.content ;
    }

    get input(){
        return this._input ;
    }

    get callback(){
        return this._callback ;
    }
    set callback(nc){
        this._callback = nc ;
    }

    set onload(nf){
        this.callback = nf ;
    }
    get onload(){
        this.callback ;
    }

    get content(){
        return this._content ;
    }
    get result(){
        return this.content ;
    }
    get text(){
        return this._content ;
    }

    set content(nc){
        this._content = nc ;
        this.callback() ;
    }
    set result(nr){
        this.content = nr ;
    }
    set text(t){
        this.content = t ;
    }
    
    set onload(f){
        this.callback = f ;
    }
    get onload(){
        return this.callback ;
    }
}
/*========================================================================
 * 
 *========================================================================
 */
class TextWriter{
    constructor(options={}){
        this._link = document.createElement('a') ; 
        this._filename = readOptions(options.filename, 'output.txt') ;
        this._filename = readOptions(options.fileName, this.filename) ;
        this._text = null ;

        this.link.download = this.filename ;
        this.clickEvent = new MouseEvent('click',{
            'view': window ,
            'bubbles': true ,
            'cancelable' : false ,
        } ) ;
        this.callback = readOptions(options.callback , function(){}) ;
    }
    write( txt ){
        this.callback() ;
        this.text = readOptions(txt, this.text) ;
        var blob = new Blob([this.text], {type:'text/plain'}) ;

        this.link.href =
            window.URL.createObjectURL(blob);
        this.link.style.display = "none";

        // FireFox needs the link to be added to DOM before we can 
        // click the link
        document.body.appendChild(this.link);

        this.link.click() ; // Dispatching the click event
        
        document.body.removeChild(this.link);
    } 

    set callback(nc){
        this._callback = nc ;
    }

    get callback(){
        return this._callback ;
    }

    set onclick(nc){
        this.callback = nc ;
    }
    get onclick(){
        return this.callback ;
    }

    get onwrite(){
        return this.callback ;
    }
    set onwrite(nc){
        this.callback = nc ;
    }

    get onwriting(){
        return this.onwrite ;
    }
    set onwriting(nc){
        this.callback = nc ;
    }

    get save(){
        return this.write;
    }

    set text(nt){
        this._text = nt ;
        //this.write(nt) ;
    }
    get text(){
        return this._text ;
    }

    set filename(nf){
        this._filename = nf ;
        this.link.download = this.filename ;
    }

    set fileName(nf){
        this.filename = nf ;
    }

    get filename(){
        return this._filename ;
    }
    get fileName(){
        return this.filename ;
    }

    get link(){
        return this._link ;
    }

}

/*========================================================================
 * Gui  :   forks dat.GUI and adds updateDisplay functionality to the
 *          entirety of the gui
 *
 *          instead of new dat.GUI we can now use addPanel of the class
 *========================================================================
 */
class Gui{
    constructor(){
        this.panels = [] ;
    }

/*------------------------------------------------------------------------
 * create a new panel and add it to the gui
 *------------------------------------------------------------------------
 */
    addPanel(options={}){
        if ( dat != undefined ){
            var panel = new dat.GUI(options) ;
        this.panels.push(panel) ;
        }else{
            console.error('dat.gui.js is not loaded') ;
        }
        return panel ;
    }

/*------------------------------------------------------------------------
 * updateControllersDisplay     : update display for all conrolers
 *------------------------------------------------------------------------
 */
    updateControllersDisplay( controllers, verbose ){
        for(var c in controllers ){
            if(verbose) log('Controller : ', c) ;

            controllers[c].updateDisplay() ;
            if( typeof(controllers[c].__onChange) == 'function'){
                if (verbose) log('running onChange') ;
                controllers[c].__onChange() ;
            }
        }
    }

/*------------------------------------------------------------------------
 * updateFolderDisplay  : update display for all subfolder of a folder
 *------------------------------------------------------------------------
 */
    updateFolderDisplay( folder ,verbose ){
        for(var fldr in folder.__folders ){
            if (verbose) log( 'Entering folder :', fldr ) ;
            this.updateFolderDisplay(folder.__folders[fldr], verbose) ;
        }
        this.updateControllersDisplay( folder.__controllers , verbose ) ;
    }

/*------------------------------------------------------------------------
 * updateDisplay    :   updates all gui displays and runs onChange
 *                      callback functions
 *------------------------------------------------------------------------
 */
    updateDisplay(options={}){
        var verbose = readOption(options.verbose, false ) ;
        for(var panel in this.panels){
            this.updateFolderDisplay(this.panels[panel], verbose) ;
        }
    }

/*------------------------------------------------------------------------
 * update           : forks updateDisplay
 *------------------------------------------------------------------------
 */
    update(options={}){
        this.updateDisplay(options) ;
    }
    
/*------------------------------------------------------------------------
 * addCoeficients
 *------------------------------------------------------------------------
 */
    addCoeficients( fldr,
            env, 
            coefs,
            solvers ,
            options ){
        var coefGui = {} ;
        var min = undefined ;
        var max = undefined ;
        var step = undefined ;
        var callback = undefined ;
        if (options != undefined ){
            if (options.min != undefined ){
                min = options.min ;
            }
            if (options.max != undefined ){
                max = options.max ;
            }
            if (options.step !=undefined ){
                step = options.step ;
            } 
            if (options.callback != undefined){
                callback = options.callback ;
            }
        }
        for(var i=0; i<coefs.length; i++){
            var coef = addCoef(fldr,env,coefs[i],solvers, callback) ;
            if (min != undefined ){
                coef.min(min) ;
            }
            if (max != undefined ){
                coef.max(max) ;
            }
            if (step != undefined){
                coef.step(step) ;
            }
            coefGui[coefs[i]] = coef ;
        }
        return coefGui ;
        /* addCoef */
        function addCoef( fldr,
                env,
                coef,
                solvers, 
                callback ){
            var coefGui  ;
            if (callback != undefined ){
                coefGui =   fldr.add( env, coef )
                .onChange(
                        function(){
                        callback() ;
                        setUniformInSolvers(  coef,
                                env[coef],
                                solvers  ) ;
                        } ) ;

            }else{
            coefGui =   fldr.add( env, coef )
                .onChange(
                        function(){
                        setUniformInSolvers(  coef,
                                env[coef],
                                solvers  ) ;
                        } ) ;
            }
            return coefGui ;

        }
    }
}
/*========================================================================
 * MouseListener    : defines a mouse event listener
 *
 *  options:    
 *      canvas  :   the canvas that mouse events are associated to
 *      callback:   the callback function to run when the event happens
 *                  an event with the accurate coordinates of the 
 *                  click are sent to the callback function.
 *      event   :   the event to listen for (default: 'click')
 *                  any standard mouse event name acceptable by javascript
 *                  can be used. Additionally, 'drag' event is defined
 *                  to be used.
 *      shiftKey or shift   : true or false values to indicate Shift Key
 *                              combination with the event
 *      altKey or alt   : similar to shiftKey
 *      ctrlKey or ctrl : similar to shiftKey
 *      metaKey or meta : similar to shiftKey
 *
 *  Future features:
 *      adding minX, maxX, minY, maxY ;
 *      adding xrange, yrange ;
 *========================================================================
 */ 
class MouseListener{
    constructor(options){
        if (options == undefined){
            console.error('No options were provided and mouse listener'+
                    ' could not be defined!') ;
            return null ;
        }
        this._canvas    = readOptions(options.canvas ,  undefined       ) ;
        this._callback  = readOption(options.callback , function(){}    ) ;
        this._event     = readOption(options.event ,    'click'         ) ;

        this._shiftKey  = readOption(options.shiftKey , false           ) ;
        this._altKey    = readOption(options.altKey ,   false           ) ;
        this._ctrlKey   = readOption(options.ctrlKey ,  false           ) ;
        this._metaKey   = readOption(options.metaKey ,  false           ) ;
        
        this._shiftKey  = readOption(options.shift  ,   this.shiftKey   ) ;
        this._altKey    = readOption(options.alt ,      this.altKey     ) ;
        this._ctrlKey   = readOption(options.ctrl,      this.ctrlKey    ) ;
        this._metaKey   = readOption(options.meta,      this.metaKey    ) ;

        if (this.event != 'drag'){
            this.canvas.addEventListener(this.event,   
                    (e) =>this.call(this, e) ) ;
        }else{
            this.canvas.addEventListener('mousedown' ,  
                    (e) =>this.call(this, e)) ;
            this.canvas.addEventListener('mousemove',
                    (e)=>this.call(this,e));
        }
    }

    call(prnt, e){
        if ((prnt.event == 'drag') && (e.buttons < 1)) return ;
        if (prnt.shiftKey != e.shiftKey ) return ;
        if (prnt.ctrlKey != e.ctrlKey   ) return ;
        if (prnt.metaKey != e.metaKey   ) return ;
        if (prnt.altKey  != e.altKey    ) return ;

        var o = {} ;
        var u = 0 ;
        var v = 0 ;
        u = ( e.clientX 
                + document.documentElement.scrollLeft 
                - prnt.canvas.offsetLeft
                                            ) / prnt.width ;
        v = 1.    -   
                (   e.clientY 
                 + document.documentElement.scrollTop  
                 - prnt.canvas.offsetTop )/ prnt.height ;

        var offsetParent = prnt.canvas.offsetParent ;
        /* Fixing the location if the element is embeded
           in a <div> or table element.                 */
        while(offsetParent != null ){
            u -= offsetParent.offsetLeft/prnt.width ;
            v += offsetParent.offsetTop/prnt.height ;
            offsetParent = offsetParent.offsetParent ;
        }
       
        o.u = u ;
        o.v = v ;
        o.x = u ;
        o.y = v ;
        o.position = [ o.x , o.y ] ;
        o.uv = [o.u, o.v] ;
        o.xy = [o.x, o.y] ;
        o.event = e ;

        prnt.callback(o) ;
    }


    get event(){
        return this._event ;
    }

    get callback(){
        return this._callback  ;
    }

    set callback(cb){
        this._callback = cb ;
    }

    get canvas(){
        return this._canvas ;
    }

    get shiftKey(){
        return this._shiftKey ;
    }
    get altKey(){
        return this._altKey ;
    }
    get ctrlKey(){
        return this._ctrlKey ;
    }

    get metaKey(){
        return this._metaKey ;
    }

    get width(){
        return this.canvas.width ;
    }

    get height(){
        return this.canvas.height ;
    }

}
/*========================================================================
 * SourceCode
 *========================================================================
 */ 
class SourceCode{
    constructor(o={}){
        this._source    = readOptions(o.source   , null) ;
        this._filename  = readOptions(o.filename , 'shader.glsl');
        this._solvers   = readOptions(o.solvers ,  [] ) ;
        this._func      = readOptions(o.FUNCTION , null ) ;
        this._title     = readOptions(o.title , '');
        this._name      = readOptions(o.name , this.title ) ;
        this._parent    = readOptions(o.parent, undefined) ;
        this._callback  = readOptions(o.callback, function(){}) ;
        this.type = readOptions(o.type, 'fragmentShader') ;
    }
    get func(){
        return this._func ;
    }
    set func(nf){
        this._func = nf ;
    }

    set name(nn){
        this._name = nn ;
    }
    get name(){
        return this._name ;
    }
    get callback(){
        return this._callback ;
    }

    set callback(nc){
        this._callback = nc ;
    }

    set type(t){
        if (t == 'fragmentShader'){
            this._type = 0 ;
        }else if (t=='vertexShader'){
            this._type = 1 ;
        }else{
            this._type = 2 ;
        }
    }
    get type(){
        return this._type ;
    }

    get source(){
        return this._source ;
    }
    set source(ns){
        this._source = ns ;
        if (this.source.length < 15){
            return ;
        }
        for(var sol in this.solvers ){
            if (this.type == 0){
                this.solvers[sol].fragmentShader = this.source ;
            }else if (this.type == 1){
                this.solvers[sol].vertexShader = this.source ;
            }
        }
        if ( this.type == 2 ){
            try{
                this.func = new Function( "return " + this.source )() ;
            }catch(e){} 
        }
        try{
            this.callback() ;
        }catch(e){
            console.warn(e) ;
        }
    }
    
    get filename(){
        return this._filename ;
    }

    set filename(nf){
        this._filename = nf ;
    }

    set title(nt){
        this._title = nt ;
    }

    get title(){
        return this._title ;
    }
    
    get solvers(){
        return this._solvers ;
    }
}

/*========================================================================
 * Editor
 *========================================================================
 */ 
class Editor{
    constructor(o={}){
        var sources = readOptions(o.sources, {}) ;
        this._sources = [] ;
        this._editorId = readOptions(o.editor, '') ;
        this._editorId = readOptions(o.id, this.id ) ;
        this._editorId = readOptions(o.editorId, this.id ) ;
        this._callback = readOptions(o.callback, function(){}) ;
        this._theme    = readOptions(o.theme, 'ace/theme/tomorrow') ;
        this._mode     = readOptions(o.mode, 'ace/mode/glsl') ;
        this._options = readOptions(o.options, {} ) ;
        this._active = 0 ;
        this._names = [] ;
        this._titles = [] ;
        this._modes = [] ;
        this._on = readOptions(o.on , 'change') ;
        try{
            
            this.editor = ace.edit(this.id) ;
            this.editor.setTheme(this.theme);
            this.editor.getSession().setMode(this.mode) ;
            this.editor.setOptions(this.options);
            this.editor.on('change', (e) => this.update(e)) ;
        }catch(e){
            console.error(e) ;
            return null ;
        }
        for(var i in sources){
            var so = sources[i] ;
            this.names.push(i) ;
            this.modes.push( readOptions(so.mode, this.mode ) ) ;
            this.titles.push(sources[i].title) ;
            so.name = i ;
            so.parent = this ;
            this._sources.push(new SourceCode(sources[i])) ;
        }
        this.active = readOptions(o.active, null ) ;

        this.setValue() ;

        this._reader = new TextReader() ;
        this.reader.owner = this ;
        this.reader.onload = function(){
            var result = this.result ;
            this.owner.editor.setValue(result) ;
            this.owner.editor.clearSelection() ;
        } ;
        this._writer = new TextWriter({filename: this.active.filename}) ;
        this.writer.owner = this ;
        this.writer.onclick = function(){
            this.owner.filename = this.owner.filename ;
            this.owner.writer.text = this.owner.editor.getValue() ;
        } ;

    } // End of constructor
    
    set options(opts){
        this._options = opts ;
        this.setOptions(opts) ;
    }
    get options(){
        return this._options ;
    }
    get setOption(){
        return this.editor.setOption ;
    }

    get setOptions(){
        return this.editor.setOptions ;
    }

    get mode(){
        return this._mode ;
    }
    set mode(nm){
        this._mode = nm ;
        this.editor.getSession().setMode(this.mode) ;
    }

    get modes(){
        return this._modes ;
    }
    set modes(nm){
        this._modes = nm ;
    }
    get theme(){
        return this._theme ;
    }
    set theme(nt){
        this._theme = nt ;
        this.editor.setTheme(this.theme) ;
    }

    load(){
        this.reader.input.click() ;
    }
    get filename(){
        return this.active.filename ;
    }

    set filename(nf){
        this.active.filename = nf ;
        this.writer.filename = nf ;
    }

    get writer(){
        return this._writer ;
    }
    set writer(nw){
        this._writer = nw ;
    }

    get reader(){
        return this._reader ;
    }

    save(){
        this.writer.save() ;
    }

    get callback(){
        return this._callback ;
    }

    set callback(nc){
        this._callback = nc ;
    }

    get name(){
        return this.active.name ;
    }
    set name(nn){
        this.active = nn ;
    }

    get names(){
        return this._names ;
    }

    get titles(){
        return this._titles ;
    }

    get editing(){
        return this.active.name ;
    }

    set editing(nn){
        this.active = nn ;
    }

    get title(){
        return this.active.title ;
    }

    set title(nt){
        this.active = nt ;
    }
    update(e){
        if (this.editor.getValue().length > 15){
            this.active.source = this.editor.getValue() ;
            this.callback() ;
        }
    }
    setValue(nv){
        if (nv != undefined ){
            this.active.source = nv ;
        }

        this.editor.setValue(this.active.source) ;
        this.editor.clearSelection() ;
            
    }
    get sources(){
        return this._sources ;
    }

    get active(){
        return this.sources[this._active] ;
    }

    set active(s){
        for(var i in this.sources){
            if (s   == this.sources[i].title || 
                s   == this.sources[i].name     ){
                this._active = i ;
                this.mode = this.modes[i] ;
                this.editor.setValue(this.active.source) ;
                this.editor.clearSelection() ;
                return ;
            }
        }
    }

    get editorId(){
        return this._editorId ;
    }

    get id(){
        return this._editorId ;
    }
}

/*************************************************************************
 * The structure to be returned as CompGL
 *************************************************************************
 */
this.cgl                 = cgl ;
this.gl                  = gl ;
this.ComputeGL           = ComputeGL ;
this.LineGeometry        = LineGeometry ;
this.UnitCubeGeometry    = UnitCubeGeometry ;
this.Texture             = Texture ;

this.Int32Texture        = Int32Texture ;
this.Int32RenderTarget   = Int32Texture ;
this.IntegerTexture      = Int32Texture ;
this.IntegetRenderTarget = Int32Texture ;

this.Uint32Texture        = Uint32Texture ;
this.Uint32RenderTarget   = Uint32Texture ;
this.UintegerTexture      = Uint32Texture ;
this.UintegetRenderTarget = Uint32Texture ;

this.Float32RTexture     = Float32RTexture ;
this.R32FTexture         = Float32RTexture ;

this.Float32Texture      = Float32Texture;
this.RGBA32FTexture      = Float32Texture;
this.FloatTexture        = Float32Texture;
this.FloatRenderTarget   = Float32Texture ;

this.ImageTexture        = ImageTexture ;
this.TableTexture        = TableTexture ;
this.CanvasTexture       = CanvasTexture ;
this.LegacyCanvasTexture = LegacyCanvasTexture ;

this.Float32TextureTableBond         = Float32TextureTableBond ;

this.RgbaCompressedData              = RgbaCompressedData ;
this.RgbaCompressedDataFromImage     = RgbaCompressedDataFromImage ;
this.SparseDataFromImage             = RgbaCompressedDataFromImage ;
this.RgbaCompressedDataFromTexture   = RgbaCompressedDataFromTexture ;


this.Solver              = Solver ;
this.Copy                = Copy ;
this.setUniformInSolvers = setUniformInSolvers ;
this.setUniformsInSolvers= setUniformsInSolvers ;
this.resizeRenderTargets = resizeRenderTargets ;
this.copyTexture         = copyTexture ;
this.SignalPlot          = SignalPlot ;
this.Plot1D              = Plot1D ;
this.Plot2D              = Plot2D ;
this.Tvsx                = Tvsx ;
this.VolumeRayCaster     = VolumeRayCaster ;
this.getColormapList     = getColormapList ;
this.Probe               = Probe ;
this.TextureReader       = TextureReader ;
this.ProbeRecorder       = ProbeRecorder ;
this.IntervalCaller      = IntervalCaller ;
this.saveCanvas          = saveCanvas ;
this.APD                 = APD ;

/* glMatrix             */
//this.glMatrix            = glMatrix.glMatrix ;
//this.mat2                = mat2 ;
//this.mat2d               = mat2d ;
//this.mat3                = mat3 ;
//this.mat4                = mat4 ;
//this.quat                = quat ;
//this.vec2                = vec2 ;
//this.vec3                = vec3 ;
//this.vec4                = vec4 ;

/* OrbitalCamera Control    */
this.OrbitalCameraControl= OrbitalCameraControl ;

/* Event Listeners          */
this.ClickListener       =   ClickListener;
this.DoubleClickListener =   DoubleClickListener;
this.CtrlClickListener   =   CtrlClickListener;
this.ShiftClickListener  =   ShiftClickListener;
this.CommandClickListener=   CommandClickListener ;
this.CtrlShiftClickListener = CtrlShiftClickListener ;
this.ShiftCtrlClickListener = CtrlShiftClickListener ;
this.LongClickListener   = LongClickListener ;

this.readOption      = readOption;

/* Storage */
this.Storage         = Storage ;
this.saveToXML       = saveToXML;
this.loadFromXML     = loadFromXML;
this.TextReader      = TextReader ;
this.TextWriter      = TextWriter ;
this.xorwow          = xorwow ;
this.random          = random ;
this.TinyMT          = TinyMT ;

this.Gui             = Gui ;
this.MouseListener   = MouseListener ;
this.MouseEventListener = MouseListener ;

/* Editor */
this.Editor    = Editor ;
