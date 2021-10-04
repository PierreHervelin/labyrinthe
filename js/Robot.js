class Robot{
    id;
    health=10.0;
    damage=0.5;
    speed=0.5;
    attack_speed=0.8;
    hand=undefined;
    body=undefined;
    pos;
    game;
    direction='bottom';
    cible=undefined;
    lastMove;
    constructor(game,id){
        this.id=id;
        this.game=game;
        this.pos={
            x:this.game.getSpawns()[id][1],
            y:this.game.getSpawns()[id][0]
        }
        console.log(`[constructor Robot]:robot ${id} créé`);
    }
    move(direction){
        var x=this.pos.x,
            y=this.pos.y;

        switch (direction) {
            case 'left':
                if(x-1>0 && this.game.getMap()[y][x-1]!=-1 && !(this.thereIsRobot('left'))){
                    this.pos.x-=1;
                    this.direction='left';
                    this.lastMove='left';
                    return undefined;
                }else{
                    this.direction='left';
                }
                break;
            case 'right':
                if(x+1<this.game.getSize()[0]-1 && this.game.getMap()[y][x+1]!=-1 && !(this.thereIsRobot('right'))){
                    this.pos.x+=1;
                    this.direction='right';
                    this.lastMove='right';
                    return undefined;
                }else{
                    this.direction='right';
                }
                break;
            case 'top':
                if(y-1>0 && this.game.getMap()[y-1][x]!=-1 && !(this.thereIsRobot('top'))){
                    this.pos.y-=1;
                    this.direction='top';
                    this.lastMove='top';
                    return undefined;
                }else{
                    this.direction='top';
                }
                break;
            case 'bottom':
                if(y+1<this.game.getSize()[1]-1 && this.game.getMap()[y+1][x]!=-1 && !(this.thereIsRobot('bottom'))){
                    this.pos.y+=1;
                    this.direction='bottom';
                    this.lastMove='bottom';
                    return undefined;
                }else{
                    this.direction='bottom';
                }
                break;
            default:
                console.log('[Robot.move()]:direction inconnu');
                break;
        }
        return -1
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
    getPossiblePath(){
        var x=this.pos.x,
            y=this.pos.y;

        var map=this.game.getMap();

        var possiblePath=[];

        while(map[y][x]!=-1){
            if(this.direction=='top'||this.direction=='bottom'){
                if(map[y][x+1]!=-1){
                    possiblePath.push([x+1,y]);
                }
                if(map[y][x-1]!=-1){
                    possiblePath.push([x-1,y]);
                }
            }else{
                if(map[y+1][x]!=-1){
                    possiblePath.push([x,y+1]);
                }
                if(map[y-1][x]!=-1){
                    possiblePath.push([x,y-1]);
                }
            }
            switch (this.direction) {
                case 'left':
                    x-=1;
                    break;
                case 'right':
                    x+=1;
                    break;
                case 'top':
                    y-=1;
                    break;
                case 'bottom':
                    y+=1;
                    break;
                default:
                    break;
            }
        }
        return possiblePath;
    }
    choosePath(){
        var possiblePath=this.getPossiblePath();

        if(this.getPossiblePath().length==0){
            this.cible=undefined;
            switch (this.lastMove) {
                case 'top':
                    this.move('bottom');
                    break;
                case 'bottom':
                    this.move('top');
                    break;
                case 'right':
                    this.move('left');
                    break;
                case 'left':
                    this.move('right');
                    break;
                default:
                    break;
            }
        }else{
            var pick=getRandomInt(0,possiblePath.length-1);

            this.cible={
                x:possiblePath[pick][0],
                y:possiblePath[pick][1],
                type:'path',
                fastRoad:this.getFastRoad(possiblePath[pick][0],possiblePath[pick][1])
            };
        }
    }
    isInImpasse(){
        var x=this.pos.x,
            y=this.pos.y;
        var issue=4;
        if(this.game.getMap()[y][x-1]==-1){
            issue-=1;
        }
        if(this.game.getMap()[y][x+1]==-1){
            issue-=1;
        }
        if(this.game.getMap()[y-1][x]==-1){
            issue-=1;
        }
        if(this.game.getMap()[y+1][x]==-1){
            issue-=1;
        }
        if(issue==1){
            return true;
        }
        return false;
    }
    getVision2(){
        var x=this.pos.x,
            y=this.pos.y;
        
        var vision=[];
        var map=this.game.getMap();

        while(map[y][x]!=-1){
            vision.push([x,y]);
            if(this.direction=='top'||this.direction=='bottom'){
                vision.push([x+1,y]);
                vision.push([x-1,y]);
            }else{
                vision.push([x,y+1]);
                vision.push([x,y-1]);
            }
            switch (this.direction) {
                case 'left':
                    x-=1;
                    break;
                case 'right':
                    x+=1;
                    break;
                case 'top':
                    y-=1;
                    break;
                case 'bottom':
                    y+=1;
                    break;
                default:
                    break;
            }
        }
        vision.push([x,y]);
        if(this.direction=='top'||this.direction=='bottom'){
            vision.push([x+1,y]);
            vision.push([x-1,y]);
        }else{
            vision.push([x,y+1]);
            vision.push([x,y-1]);
        }
        return vision;
    }
    getVision(){
    //Récupère les coordonnées de chaque bloque du champs de vision
        var x=this.pos.x,
            y=this.pos.y;
        
        var vision=[];

        switch (this.direction) {
            case 'top':
                for(var i=0;i<6;i++){
                    if(y-i<0){
                        break;
                    }
                    vision.push([x,y-i]);
                    for(var j=i*(-1);j<0;j++){
                        if(x+j<0){
                            continue;
                        }
                        vision.push([x+j,y-i]);
                    }
                    for(var j=1;j<i;j++){
                        if(x+j>this.game.getSize()[0]-1){
                            break;
                        }
                        vision.push([x+j,y-i]);
                    }
                }
                break;
            case 'bottom':
                for(var i=0;i<6;i++){
                    if(y+i>this.game.getSize()[1]-1){
                        break;
                    }
                    vision.push([x,y+i]);
                    for(var j=i*(-1);j<0;j++){
                        if(x+j<0){
                            continue;
                        }
                        vision.push([x+j,y+i]);
                    }
                    for(var j=1;j<i;j++){
                        if(x+j>this.game.getSize()[0]-1){
                            break;
                        }
                        vision.push([x+j,y+i]);
                    }
                }
                break;
            case 'right':
                for(var i=0;i<6;i++){
                    if(x+i>this.game.getSize()[0]-1){
                        break;
                    }
                    vision.push([x+i,y]);
                    for(var j=i*(-1);j<0;j++){
                        if(y+j<0){
                            continue;
                        }
                        vision.push([x+i,y+j]);
                    }
                    for(var j=1;j<i;j++){
                        if(y+j>this.game.getSize()[1]-1){
                            break;
                        }
                        vision.push([x+i,y+j]);
                    }
                }
                break;
            case 'left':
                for(var i=0;i<6;i++){
                    if(x-i<0){
                        break;
                    }
                    vision.push([x-i,y]);
                    for(var j=i*(-1);j<0;j++){
                        if(y+j<0){
                            continue;
                        }
                        vision.push([x-i,y+j]);
                    }
                    for(var j=1;j<i;j++){
                        if(y+j>this.game.getSize()[1]-1){
                            break;
                        }
                        vision.push([x-i,y+j]);
                    }
                }
                break;
        
            default:
                break;
        }
        return vision;
    }
    getFastRoad(x,y){
        for(var i in this.game.getMap()){
            for(var j in this.game.getMap()[i]){
                if(this.game.getMap()[i][j]>=0){
                    this.game.getMap()[i][j]=0;
                }
            }
        }
        var distance=1;
        var x2=this.pos.x,
            y2=this.pos.y;

        this.game.game.map.map[y2][x2]=1;

        var temp=[];

        while(this.game.getMap()[y][x]==0){

            temp=this.game.getMap()
            distance++;

            for(var i=1;i<(this.game.getSize()[1]-1);i++){
                for(var j=1;j<this.game.getSize()[0]-1;j++){
                    if(
                        this.game.getMap()[i][j]==0 &&
                        (
                            this.game.getMap()[i+1][j]==distance-1 ||
                            this.game.getMap()[i-1][j]==distance-1 ||
                            this.game.getMap()[i][j+1]==distance-1 ||
                            this.game.getMap()[i][j-1]==distance-1
                        )
                    ){
                        temp[i][j]=distance;
                    }
                }
            }
            this.game.game.map.map=temp;
        }
        var top,left,bottom,right;
        var fastRoad=[];

        while(this.game.getMap()[y][x]!=1){
            top=this.game.getMap()[y-1][x];
            if(top<=0){
                top=500;
            }
            bottom=this.game.getMap()[y+1][x];
            if(bottom<=0){
                bottom=500;
            }
            left=this.game.getMap()[y][x-1];
            if(left<=0){
                left=500;
            }
            right=this.game.getMap()[y][x+1];
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
    thereIsRobot(direction){
        var x=this.pos.x,
            y=this.pos.y;

        if(this.id==0){
            var xRobot=this.game.getSupremVue().robot1.x,
                yRobot=this.game.getSupremVue().robot1.y;
        }else{
            var xRobot=this.game.getSupremVue().robot0.x,
                yRobot=this.game.getSupremVue().robot0.y;
        }

        switch (direction) {
            case 'left':
                if(x-1==xRobot && y==yRobot){
                    return true;
                }
                break;
            case 'right':
                if(x+1==xRobot && y==yRobot){
                    return true;
                }
                break;
            case 'top':
                if(x==xRobot && y-1==yRobot){
                    return true;
                }
                break;
            case 'bottom':
                if(x==xRobot && y+1==yRobot){
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    }
    setSpeed(speed){
        this.speed=speed;
        clearInterval(this.game.gameloop[`robot${this.id}`]);
        this.game.gameloop[`robot${this.id}`]=setInterval(()=>{
            this.robotStart();
        },this.speed*1000);
    }
    fire(){
        this.game.addLaser(
            new Laser(this.game,this.pos.x,this.pos.y,this.direction)
        );
    }
    robotStart(){
        var x,y;
        var supremVue=this.game.getSupremVue(),
            cibles=[];
        var vision=this.getVision2();
        
        //Vérifie si des cibles sont dans le champs de vision
        for(var i=1;i<vision.length;i++){
            x=vision[i][0];
            y=vision[i][1];
            for(var key in supremVue){
                if(this.id!=supremVue[key].id && x==supremVue[key].x && y==supremVue[key].y){
                    cibles.push({
                        x:supremVue[key].x,
                        y:supremVue[key].y,
                        type:supremVue[key].type,
                        fastRoad:this.getFastRoad(x,y)
                    });
                }
            }
        }

        //Sélection de la cible la plus proche
        if(cibles.length>0){
            this.cible=cibles[0];
            for(var i=1;i<cibles.length;i++){
                if(cibles[i].fastRoad.length==this.cible.fastRoad.length){
                    if(this.cible.type==='robot'){
                        this.cible=cibles[i];
                    }
                }else if(cibles[i].fastRoad.length<this.cible.fastRoad.length){
                    this.cible=cibles[i];
                }
            }
        }else if(this.cible){
            this.cible.fastRoad=this.getFastRoad(this.cible.x,this.cible.y);
        }

        if(this.cible){
            //si c'est un robot on s'arrête une case avant sa position
            switch (this.cible.type) {
                case 'robot':
                    if(this.cible.fastRoad.length===1){
                        console.log(`[robot ${this.id}]:arrivé sur l'ennemi`);
                        return;
                    }
                    break;
                case 'path':
                    if(this.pos.x==this.cible.x && this.pos.y==this.cible.y){
                        this.choosePath();
                        if(!this.cible){
                            return;
                        }
                    }
                    break;
                default:
                    break;
            }
            this.move(this.cible.fastRoad[this.cible.fastRoad.length-1]);
        }else{
            this.choosePath();
            if(!this.cible){
                return;
            }
            this.move(this.cible.fastRoad[this.cible.fastRoad.length-1]);
        }
    }
}