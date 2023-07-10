} ;

try{
    define( [] , function(){
        console.log('Loading the library using require.js...') ;
        var abubu = Abubu ;
        Abubu = undefined ;
        return abubu ;
    } ) ;
}catch(e){
    console.log('Loaded the library without using require.js...') ;
}
