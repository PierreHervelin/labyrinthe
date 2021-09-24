class Robot{
    health=10.0;
    damage=0.5;
    speed=0.5;
    attack_speed=0.8;
    hand=undefined;
    body=undefined;
    pos;
    map;
    direction='bottom';
    vision=[];
    lastCiblePosition=undefined;
    lastMove;
    constructor(map,id){
        this.map=map;
        this.pos=this.map.spawns[id];
        this.getVision();
        console.log('[constructor Robot]:robot créé');
    }
    move(direction){
        var x=this.pos[1],
            y=this.pos[0];
        switch (direction) {
            case 'left':
                if(this.pos[1]-1>0 && this.map.getMap()[y][x-1]!=-1){
                    this.pos[1]-=1;
                    this.direction='left';
                    this.lastMove='right';
                }else{
                    return -1;
                }
                break;
            case 'right':
                if(this.pos[1]+1<this.map.size[0]-1 && this.map.getMap()[y][x+1]!=-1){
                    this.pos[1]+=1;
                    this.direction='right';
                    this.lastMove='left';
                }else{
                    return -1;
                }
                break;
            case 'top':
                if(this.pos[0]-1>0 && this.map.getMap()[y-1][x]!=-1){
                    this.pos[0]-=1;
                    this.direction='top';
                    this.lastMove='bottom';
                }else{
                    return -1;
                }
                break;
            case 'bottom':
                if(this.pos[0]+1<this.map.size[1]-1 && this.map.getMap()[y+1][x]!=-1){
                    this.pos[0]+=1;
                    this.direction='bottom';
                    this.lastMove='top';
                }else{
                    return -1;
                }
                break;
            default:
                this.lastCiblePosition=undefined;
                console.log('[Robot.move()]:direction inconnu');
                break;
        }
    }
    randomMove(){
        var moves=['left','right','top','bottom'];
        var pick=getRandomInt(0,moves.length-1);
        
        while(moves[pick]==this.lastMove || this.move(moves[pick])){
            if(this.isInImpasse()){
                this.lastMove='';
                break;
            }
            pick=getRandomInt(0,moves.length-1);
        }
    }
    isInImpasse(){
        var x=this.pos[1],
            y=this.pos[0];
        var issue=4;
        if(this.map.map[y][x-1]==-1){
            issue-=1;
        }
        if(this.map.map[y][x+1]==-1){
            issue-=1;
        }
        if(this.map.map[y-1][x]==-1){
            issue-=1;
        }
        if(this.map.map[y+1][x]==-1){
            issue-=1;
        }
        if(issue==1){
            return true;
        }
        return false;
    }
    getVision(){
    //Récupère les coordonnées de chaque bloque du champs de vision
        var x=this.pos[1],
            y=this.pos[0];
        
        this.vision=[];

        switch (this.direction) {
            case 'top':
                for(var i=0;i<6;i++){
                    if(y-i<0){
                        break;
                    }
                    this.vision.push([x,y-i]);
                    for(var j=i*(-1);j<0;j++){
                        if(x+j<0){
                            continue;
                        }
                        this.vision.push([x+j,y-i]);
                    }
                    for(var j=1;j<i;j++){
                        if(x+j>this.map.size[0]-1){
                            break;
                        }
                        this.vision.push([x+j,y-i]);
                    }
                }
                break;
            case 'bottom':
                for(var i=0;i<6;i++){
                    if(y+i>this.map.size[1]-1){
                        break;
                    }
                    this.vision.push([x,y+i]);
                    for(var j=i*(-1);j<0;j++){
                        if(x+j<0){
                            continue;
                        }
                        this.vision.push([x+j,y+i]);
                    }
                    for(var j=1;j<i;j++){
                        if(x+j>this.map.size[0]-1){
                            break;
                        }
                        this.vision.push([x+j,y+i]);
                    }
                }
                break;
            case 'right':
                for(var i=0;i<6;i++){
                    if(x+i>this.map.size[0]-1){
                        break;
                    }
                    this.vision.push([x+i,y]);
                    for(var j=i*(-1);j<0;j++){
                        if(y+j<0){
                            continue;
                        }
                        this.vision.push([x+i,y+j]);
                    }
                    for(var j=1;j<i;j++){
                        if(y+j>this.map.size[1]-1){
                            break;
                        }
                        this.vision.push([x+i,y+j]);
                    }
                }
                break;
            case 'left':
                for(var i=0;i<6;i++){
                    if(x-i<0){
                        break;
                    }
                    this.vision.push([x-i,y]);
                    for(var j=i*(-1);j<0;j++){
                        if(y+j<0){
                            continue;
                        }
                        this.vision.push([x-i,y+j]);
                    }
                    for(var j=1;j<i;j++){
                        if(y+j>this.map.size[1]-1){
                            break;
                        }
                        this.vision.push([x-i,y+j]);
                    }
                }
                break;
        
            default:
                break;
        }
    }
    getFastRoad(){
        if(this.lastCiblePosition){
            for(var i in this.map.getMap()){
                for(var j in this.map.getMap()[i]){
                    if(this.map.getMap()[i][j]>=0){
                        this.map.getMap()[i][j]=0;
                    }
                }
            }
            var distance=1;
            var x1=this.lastCiblePosition[1],
                y1=this.lastCiblePosition[0];
            var x2=this.pos[1],
                y2=this.pos[0];

            this.map.getMap()[y2][x2]=1;

            while(this.map.map[y1][x1]==0){

                var temp=this.map.getMap()
                distance++;

                for(var i=1;i<(this.map.size[1]-1);i++){
                    for(var j=1;j<this.map.size[0]-1;j++){
                        if(
                            this.map.getMap()[i][j]==0 &&
                            (
                                this.map.getMap()[i+1][j]==distance-1 ||
                                this.map.getMap()[i-1][j]==distance-1 ||
                                this.map.getMap()[i][j+1]==distance-1 ||
                                this.map.getMap()[i][j-1]==distance-1
                            )
                        ){
                            temp[i][j]=distance;
                        }
                    }
                }
                this.map.map=temp;
            }
            var x=this.lastCiblePosition[1],
                y=this.lastCiblePosition[0];
            var top,left,bottom,right;
            var fastRoad=[];

            while(this.map.getMap()[y][x]!=1){
                top=this.map.getMap()[y-1][x];
                if(top<=0){
                    top=500;
                }
                bottom=this.map.getMap()[y+1][x];
                if(bottom<=0){
                    bottom=500;
                }
                left=this.map.getMap()[y][x-1];
                if(left<=0){
                    left=500;
                }
                right=this.map.getMap()[y][x+1];
                if(right<=0){
                    right=500;
                }

                if(top<=bottom && top<=left && top<=right){
                    y-=1;
                    fastRoad.push('bottom');
                }else if(bottom<=top && bottom<=left && bottom<=right){
                    y+=1;
                    fastRoad.push('top');
                }else if(left<=top && left<=bottom && left<=right){
                    x-=1;
                    fastRoad.push('right');
                }else if(right<=top && right<=bottom && right<=left){
                    x+=1;
                    fastRoad.push('left');
                }
            }
            return fastRoad;
        }
    }
}