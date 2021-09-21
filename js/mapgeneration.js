class Map{
    #size=[10,10];
    #map=[];
    constructor(size){
        this.#size=size;
        this.#map=new Array(size[0]);
        for(var i in this.#map){
            this.#map[i]=new Array(size[1]);
        }
    }
    fill(val){
        for(var i in this.#map){
            for(var j in this.#map[i]){
                this.#map[i][j]=val
            }
        }
    }
    printMap(val)
    

}
class Case{
    #top=true;
    #left=true;
    #right=true;
    #bottom=true;
    constructor()
}