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

