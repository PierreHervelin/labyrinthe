class Robot{
    id; //id du robot (0 ou 1)
    health=10.0;
    damage=0.5;
    reach=1;
    speed=0.5;
    attack_speed=0.8;
    armor=0;
    agility=1; //chances d'esquives (ici 1/100)
    isDead=false;
    hand={
        weapon:undefined,
        type:'melee',
        damage:0,
        reach:0
    };
    body={
        item:undefined,
        armor:0,
        speed:0
    };
    pos; //object {x,y}
    game;
    direction='bottom';
    moveBackup=[]; //4 derniers chemins
    moveHistory=[];
    impasses=[]; //les impasses sont gardées en mémoire ici
    cible=undefined;
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
                    return undefined;
                }else{
                    this.direction='left';
                }
                break;
            case 'right':
                if(x+1<this.game.getSize()[0]-1 && this.game.getMap()[y][x+1]!=-1 && !(this.thereIsRobot('right'))){
                    this.pos.x+=1;
                    this.direction='right';
                    return undefined;
                }else{
                    this.direction='right';
                }
                break;
            case 'top':
                if(y-1>0 && this.game.getMap()[y-1][x]!=-1 && !(this.thereIsRobot('top'))){
                    this.pos.y-=1;
                    this.direction='top';
                    return undefined;
                }else{
                    this.direction='top';
                }
                break;
            case 'bottom':
                if(y+1<this.game.getSize()[1]-1 && this.game.getMap()[y+1][x]!=-1 && !(this.thereIsRobot('bottom'))){
                    this.pos.y+=1;
                    this.direction='bottom';
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
    getPossiblePath(){
        //return tous les chemins possible
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

        var indices=[];
        for(var i in possiblePath){
            var isIn=this.isPathIn(this.impasses,possiblePath[i]);
            var isIn2=this.isPathIn(this.moveBackup,possiblePath[i]);
            if(isIn){
                indices.push(isIn-1);
            }else if(isIn2 && possiblePath.length>1){
                indices.push(isIn2-1);
            }
        }
        for(var i in indices){
            possiblePath.splice(indices[i],1);
        }

        if(possiblePath.length==0){
            //s'il n'y a pas de chemin possible -> demi-tour
            if(this.cible){
                this.impasses.push([this.cible.x,this.cible.y]);
            }else{
                //si le spawn est dans une impasse
                this.impasses.push([this.pos.x,this.pos.y]);
            }
            this.cible=undefined;
            this.turnBack();
            
        }else{
            //les nouveaux chemins sont prioritaires
            var newPath=this.getNewPath();
            if(newPath.length>0){
                possiblePath=newPath;
            }
            var pick=getRandomInt(0,possiblePath.length-1);

            this.moveBackup.push(possiblePath[pick]);
            this.moveHistory.push(possiblePath[pick]);

            if(this.moveBackup.length>4){
                this.moveBackup.shift();
            }
            this.cible={
                x:possiblePath[pick][0],
                y:possiblePath[pick][1],
                type:'path',
                fastRoad:this.getFastRoad(possiblePath[pick][0],possiblePath[pick][1])
            };
        }
    }
    turnBack(){
        switch (this.direction) {
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
    }
    isPathIn(tab,path){
        for(var i in tab){
            if(
                path[0]==tab[i][0] &&
                path[1]==tab[i][1]
            ){
                return i+1;
            }
        }
    }
    getNewPath(){
        var possiblePath=this.getPossiblePath();
        var newPath=[];

        for(var i in possiblePath){
            if(!(this.isPathIn(this.moveHistory,possiblePath[i]))){
                newPath.push(possiblePath[i]);
            }
        }
        return newPath;
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
    thereIsRobotInView(){
        //thereIsRobot amélioré
        var x=this.pos.x,
            y=this.pos.y;

        if(this.id==0){
            var xRobot=this.game.getSupremVue().robot1.x,
                yRobot=this.game.getSupremVue().robot1.y;
        }else{
            var xRobot=this.game.getSupremVue().robot0.x,
                yRobot=this.game.getSupremVue().robot0.y;
        }

        var map=this.game.getMap();

        while(map[y][x]!=-1){
            if(x==xRobot && y==yRobot){
                if(this.direction=='top'||this.direction=='bottom'){
                    return Math.abs(this.pos.y-y);
                }else{
                    return Math.abs(this.pos.x-x);
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
        return false;
    }
    setSpeed(speed){
        if(speed!=this.speed){
            this.speed=speed;
            clearInterval(this.game.gameloop[`robot${this.id}`]);
            this.game.gameloop[`robot${this.id}`]=setInterval(()=>{
                this.robotStart();
            },this.speed*1000);
        }
    }
    takeDamage(damage){
        if(this.cible && this.cible.type!='robot'){
            this.turnBack();
        }
        damage-=this.armor;

        var pick1=getRandomInt(this.agility,100),
            pick2=getRandomInt(this.agility,100);
        
        if(pick1===pick2){
            //dodge
            return;
        }
        this.health-=damage;
        if(this.health<=0){
            this.health=0;
            this.isDead=true;
        }
    }
    fire(){
        if(this.hand.type=='ranged'){
            this.game.addLaser(
                new Laser(this.game,this.pos.x,this.pos.y,this.direction,this.getDamage())
            );
        }
    }
    hit(){
        if(this.hand.type=='melee'){
            if(this.id==0){
                this.game.getRobot(1).takeDamage(this.getDamage());
            }else{
                this.game.getRobot(0).takeDamage(this.getDamage());
            }
        }
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
                    if(supremVue[key].type=='weapon'&&this.hand.weapon){
                        continue;
                    }
                    cibles.push({
                        x:supremVue[key].x,
                        y:supremVue[key].y,
                        type:supremVue[key].type,
                        id:supremVue[key].id,
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
            switch (this.cible.type) {
                case 'robot':
                    if(this.thereIsRobotInView() && this.thereIsRobotInView()<=this.getReach()){
                        switch (this.hand.type) {
                            case 'ranged':
                                this.fire();
                                return;
                                break;
                            case 'melee':
                                this.hit();
                                return;
                                break;
                            default:

                                break;
                        }
                    }else if(this.cible.fastRoad.length===0){
                        this.cible=undefined;
                        return;
                    }
                    break;
                case 'path':
                    if(this.pos.x===this.cible.x && this.pos.y===this.cible.y){
                        this.choosePath();
                        if(!this.cible){
                            return;
                        }
                    }
                    break;
                case 'weapon':
                    if(this.cible.fastRoad.length===0){
                        this.hand.weapon=this.cible.id;
                        this.hand.damage=this.game.weapons[this.cible.id].damage;
                        this.hand.reach=this.game.weapons[this.cible.id].reach;
                        this.hand.type=this.game.weapons[this.cible.id].type;

                        delete this.game.weapons[this.cible.id];
                        this.cible=undefined;
                        return;
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
    //get
    getDamage(){
        if(this.hand.weapon){
            return this.hand.damage;
        }
        return this.damage;
    }
    getReach(){
        if(this.hand.weapon){
            return this.hand.reach;
        }
        return this.reach;
    }
    getArmor(){
        return this.armor+this.body.armor;
    }
    getSpeed(){
        return this.speed+this.body.speed;
    }
}