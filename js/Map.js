class Map{
    size=[];
    map=[];
    spawns=[[],[]];
    constructor(size){
        if(size[1]%2==0){
            console.log('Y paire, impossible');
            return -1
        }
        this.size=size;
        this.map=new Array(this.size[0]);

        this.init();
        while(this.getMurs()<(
            (this.size[0]+this.size[1]-1)*2-2)
            +(((this.size[0]-1)/2)-1)*((this.size[1]/2)-2)+this.size[0]*3
            ){
                this.map=new Array(this.size[0]);
                this.init();
            }
    }
    init(){
        //INIT GRILLES : attention Y doit être impaire
        for(var i=0;i<this.size[1];i++){
            this.map[i]=[];
            for(var j=0;j<this.size[0];j++){
                if(i%2==0){
                    this.map[i].push(-1);
                }else{
                    if(j%2==0){
                        this.map[i].push(-1);
                    }else{
                        this.map[i].push(1);
                    }
                }
            }
        }
        var pick=[];
        for(var i=0;i<2;i++){
            //INIT SPAWNS :
                /*
                0:top
                1:right
                2:bottom
                3:left
                */
            if(i==0){
                pick.push(getRandomInt(0,3));
            }
            switch (pick[i]) {
                case 0:
                    this.spawns[i]=[1,getRandomIntImpaire(1,this.size[0]-2)];
                    pick[1]=2;
                    break;
                case 1:
                    this.spawns[i]=[getRandomIntImpaire(1,this.size[1]-2),this.size[0]-2];
                    pick[1]=3;
                    break;
                case 2:
                    this.spawns[i]=[this.size[1]-2,getRandomIntImpaire(1,this.size[0]-2)];
                    pick[1]=0;
                    break;
                case 3:
                    this.spawns[i]=[getRandomIntImpaire(1,this.size[1]-2),1];
                    pick[1]=1;
                    break;
                default:
                    break;
            }
            this.map[this.spawns[i][0]][this.spawns[i][1]]=1;
        }
        var nb=0;
        for(var i in this.map){
            for(var j in this.map[i]){
                if(this.map[i][j]!=-1){
                    nb++;
                    this.map[i][j]=nb;
                }
            }
        }
        while(!this.isFinished()){
            var x=getRandomInt(1,this.size[0]-2);

            if(x%2==0){
                var y=getRandomIntImpaire(1,this.size[1]-2);
            }else{
                var y=getRandomIntPaire(1,this.size[1]-2);
            }

            if(this.map[y][x]==-1){
                if(this.map[y][x-1]==-1){
                    this.map[y][x]=0;
                    var cell1=this.map[y-1][x];
                    var cell2=this.map[y+1][x];
                }else{
                    this.map[y][x]=0;
                    var cell1=this.map[y][x-1];
                    var cell2=this.map[y][x+1];
                }
                if(cell1!=cell2){
                    for(var i=1;i<this.size[1]-1;i+=2){
                        for(var j=1;j<this.size[0]-1;j+=2){
                            if(this.map[i][j]==cell2){
                                this.map[i][j]=cell1;
                            }
                        }
                    }
                }

            }
        }
    }
    isFinished(){
        var nb=this.map[1][1];
        for(var i=1;i<this.size[1]-1;i+=2){
            for(var j=1;j<this.size[0]-1;j+=2){
                if(this.map[i][j]!=nb){
                    return false;
                }
            }
        }
        return true;
    }
    getMap(){
        return this.map;
    }
    getMurs(){
        var murs=0;
        for(var i in this.map){
            for(var j in this.map[i]){
                if(this.map[i][j]==-1){
                    murs++;
                }
            }
        }
        return murs;
    }
    
    printMap(val){
        console.log('=====MAP=====');
        var line='';
        for(var i in this.map){
            for(var j in this.map[i]){
                if(this.map[i][j]!=-1){
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