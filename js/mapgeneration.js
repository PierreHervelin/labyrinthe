class Map{
    #size=[10,10];
    #map=[];
    #spawns=[[],[]];
    constructor(size){
        if(size[1]%2==0){
            console.log('Y paire, impossible');
            return -1
        }
        this.#size=size;
        this.#map=new Array(this.#size[0]);
        this.#init()
    }
    #init(){
        //INIT GRILLES : attention Y doit être impaire
        for(var i=0;i<this.#size[1];i++){
            this.#map[i]=[];
            for(var j=0;j<this.#size[0];j++){
                if(i%2==0){
                    this.#map[i].push(-1);
                }else{
                    if(j%2==0){
                        this.#map[i].push(-1);
                    }else{
                        this.#map[i].push(1);
                    }
                }
            }
        }
        for(var i=0;i<2;i++){
            //INIT SPAWNS :
                /*
                0:top
                1:right
                2:bottom
                3:left
                */
            console.log(this.#spawns);
            if(i==1){
                var pick2=getRandomInt(0,3,pick);
                pick=pick2;
            }else{
                var pick=getRandomInt(0,3);
            }
            switch (pick) {
                case 0:
                    this.#spawns[i]=[getRandomIntImpaire(0,this.#size[1]),0];
                    break;
                case 1:
                    this.#spawns[i]=[this.#size[1]-1,getRandomIntImpaire(0,this.#size[0])];
                    break;
                case 2:
                    this.#spawns[i]=[0,getRandomIntImpaire(0,this.#size[0])];
                    break;
                case 3:
                    this.#spawns[i]=[getRandomIntImpaire(0,this.#size[1]),this.#size[0]-1];
                    break;
                default:
                    break;
            }
            this.#map[this.#spawns[i][0]][this.#spawns[i][1]]=1;
        }
        var nb=0;
        for(var i in this.#map){
            for(var j in this.#map[i]){
                if(this.#map[i][j]==1){
                    nb++;
                    this.#map[i][j]=nb;
                }
            }
        }
        while(!this.#isFinished()){
            var x=getRandomInt(1,this.#size[0]-2);

            if(x%2==0){
                var y=getRandomIntImpaire(1,this.#size[1]-2);
            }else{
                var y=getRandomIntPaire(1,this.#size[1]-2);
            }

            if(this.#map[y][x]==-1){
                if(this.#map[y][x-1]==-1){
                    this.#map[y][x]=0;
                    var cell1=this.#map[y-1][x];
                    var cell2=this.#map[y+1][x];
                }else{
                    this.#map[y][x]=0;
                    var cell1=this.#map[y][x-1];
                    var cell2=this.#map[y][x+1];
                }
                if(cell1!=cell2){
                    for(var i=1;i<this.#size[1]-1;i+=2){
                        for(var j=1;j<this.#size[0]-1;j+=2){
                            if(this.#map[i][j]==cell2){
                                this.#map[i][j]=cell1;
                            }
                        }
                    }
                }

            }
        }
    }
    #isFinished(){
        var nb=this.#map[1][1];
        for(var i=1;i<this.#size[1]-1;i+=2){
            for(var j=1;j<this.#size[0]-1;j+=2){
                if(this.#map[i][j]!=nb){
                    return false;
                }
            }
        }
        return true;
    }
    
    printMap(val){
        console.log('=====MAP=====');
        var line='';
        for(var i in this.#map){
            for(var j in this.#map[i]){
                if(this.#map[i][j]!=-1){
                    line+=' ';
                }else{
                    line+='*';
                }
            }
            line+='\n';
        }
        console.log(line);
    }
    

}
/*
class Case{
    #top=true;
    #left=true;
    #right=true;
    #bottom=true;
    constructor()
}
*/