function getRandomInt(min, max, exclu=false) {
    min = Math.ceil(min);
    max = Math.floor(max);
    val=Math.floor(Math.random() * (max - min +1)) + min;
    if(exclu!=false){
        while(val==exclu){
            val=Math.floor(Math.random() * (max - min +1)) + min;
        }
    }
    return val
}
function getRandomIntImpaire(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    val=Math.floor(Math.random() * (max - min +1)) + min;
    while(val%2==0){
        val=Math.floor(Math.random() * (max - min +1)) + min;
    }
    return val
}
function getRandomIntPaire(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    val=Math.floor(Math.random() * (max - min +1)) + min;
    while(val%2!=0){
        val=Math.floor(Math.random() * (max - min +1)) + min;
    }
    return val
}
function getIndex(tab,el) {
    if(typeof el==='object' && typeof tab[0]==='object'){
        for(var i in tab){
            if(Array.isArray(tab)){
                if(
                    el[0]==tab[i][0] &&
                    el[1]==tab[i][1]
                ){
                    return i+1;
                }
            }else{
                if(
                    el[0]==tab[î].x &&
                    el[1]==tab[î].y
                ){
                    return i;
                }
            }
        }
    }
}