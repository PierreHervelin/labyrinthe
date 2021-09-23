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
            +(((this.size[0]-1)/2)-1)*((this.size[1]/2)-2)+this.size[0]*2
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
                    this.spawns[i]=[0,getRandomIntImpaire(1,this.size[0]-2)];
                    pick[1]=2;
                    break;
                case 1:
                    this.spawns[i]=[getRandomIntImpaire(1,this.size[1]-2),this.size[0]-1];
                    pick[1]=3;
                    break;
                case 2:
                    this.spawns[i]=[this.size[1]-1,getRandomIntImpaire(1,this.size[0]-2)];
                    pick[1]=0;
                    break;
                case 3:
                    this.spawns[i]=[getRandomIntImpaire(1,this.size[1]-2),0];
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
    getFastRoad(){
        for(var i in this.map){
            for(var j in this.map[i]){
                if(this.map[i][j]>=0){
                    this.map[i][j]=0;
                }
            }
        }
        var distance=1;
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

class Robot{
    health=10.0;
    damage=0.5;
    speed=0.5;
    attack_speed=0.8;
    hand=undefined;
    body=undefined;
    pos;
    map;
    direction;
    constructor(map,id){
        this.map=map
        this.pos=this.map.spawns[id];
        console.log('[constructor Robot]:robot créé');
    }
    move(direction){
        var x=this.pos[1],
            y=this.pos[0];
        switch (direction) {
            case 'left':
                if(this.pos[1]-1!=-1 && this.map.getMap()[y][x-1]!=-1){
                    this.pos[1]-=1;
                }else{
                    return -1;
                }
                break;
            case 'right':
                if(this.pos[1]+1!=this.map.size[0] && this.map.getMap()[y][x+1]!=-1){
                    this.pos[1]+=1;
                }else{
                    return -1;
                }
                break;
            case 'top':
                if(this.pos[0]-1!=-1 && this.map.getMap()[y-1][x]!=-1){
                    this.pos[0]-=1;
                }else{
                    return -1;
                }
                break;
            case 'bottom':
                if(this.pos[0]+1!=this.map.size[1] && this.map.getMap()[y+1][x]!=-1){
                    this.pos[0]+=1;
                }else{
                    return -1;
                }
                break;
            default:
                console.log('[Robot.move()]:direction inconnu');
                break;
        }
    }
    getFastRoad(cible){
        for(var i in this.map){
            for(var j in this.map[i]){
                if(this.map[i][j]>=0){
                    this.map[i][j]=0;
                }
            }
        }
        var distance=1;

        

    }

}

class Arme{
    damage;
    durability;
    speed;
    constructor(type){
        switch (type) {
            case 'epee_bois':
                this.epee_bois();
                break;
            case 'epee_pierre':
                this.epee_pierre();
                break;
            case 'epee_fer':
                this.epee_fer();
                break;
            default:
                console.log('arme inconnu');
                break;
        }
    }
    epee_bois(){
        this.damage=1;
        this.durability=4;
        this.speed=1.2;
    }
    epee_pierre(){
        this.damage=2;
        this.durability=6;
        this.speed=1.5;
    }
    epee_fer(){
        this.damage=3.5;
        this.durability=6;
        this.speed=1.8;
    }
    getDamage(){
        return this.damage
    }
    getDurability(){
        return this.durability
    }
    getSpeed(){
        return this.speed
    }
}