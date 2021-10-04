class Game {
    game;
    canvas;
    ctx;
    imgs;
    gameloop;
    idLaser;
    constructor(canvas){
        this.game={state:'stopped'};
        this.canvas=document.getElementById(canvas);
        this.idLaser=0;
    }
    _init(){
        this.game={
            robot:[],
            map:new Map([31,21]),
            obj:[],
            laser:[],
            state:'init'
        };

        //INIT robots
        this.game.robot.push(
            new Robot(this,0),
            new Robot(this,1)
        );
        
        //nombre de tours joués
        this.game.round=0;

        /*
            init:jeu en phase d'initialisation
            paused:jeu en pause
            stopped:jeu à l'arrêt
            started:jeu en cours d'execution
            finished:jeu fini
        */
        this.game.state='stopped';

        this.ctx=this.canvas.getContext("2d");

        this.imgs={
            robot0:document.getElementById('img-robot0'),
            robot1:document.getElementById('img-robot1'),
            balle:document.getElementById('img-balle')
        }
    }
    start(){
        if(this.game.state=='paused'){
            this.game.state='started';
            this.gameloop.robot0=setInterval(()=>{
                this.getRobot(0).robotStart();
            },this.getRobot(0).speed*1000);

            setTimeout(() => {
                this.gameloop.robot1=setInterval(() => {
                    this.getRobot(1).robotStart();
                    this.game.round+=1;
                }, this.getRobot(1).speed*1000);
            }, this.getRobot(1).speed*1000);
        }
        if(this.game.state=='stopped'){
            this._init();
            this.game.state='started';
            this.gameloop={
                main:setInterval(()=>{
                    this.loop();
                },1000/30),
                laser:[],
                robot0:setInterval(()=>{
                    this.getRobot(0).robotStart();
                },this.getRobot(0).speed*1000)
            }
            setTimeout(() => {
                this.gameloop.robot1=setInterval(() => {
                    this.getRobot(1).robotStart();
                    this.game.round+=1;
                }, this.getRobot(1).speed*1000);
            }, this.getRobot(1).speed*1000);
        }
    }
    pause(){
        if(this.game.state=='started'){
            this.game.state='paused';
            Object.keys(this.gameloop).map((key)=>{
                if(key!='main'){
                    clearInterval(this.gameloop[key]);
                }
            });
        }
    }
    stop(){
        if(this.game.state=='started'){
            this.game.state='stopped';
            Object.keys(this.gameloop).map((key)=>{
                clearInterval(this.gameloop[key]);
            });
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        }
    }
    loop(){
        this.ctx.clearRect(
            0,0,
            this.canvas.width,
            this.canvas.height
        );
        //Génération de la map :
        for(var i in this.getMap()){
            for(var j in this.getMap()[i]){
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(j*30, i*30, 30, 30);
                for(var robot in this.getAllRobot()){
                    for(var k in this.getRobot(robot).getVision2()){
                        var x=this.getRobot(robot).getVision2()[k][0],
                            y=this.getRobot(robot).getVision2()[k][1];
                        if((i==y && j==x)){
                            if(this.getMap()[i][j]==-1){
                                this.ctx.fillStyle = "#333";
                            }else{
                                this.ctx.fillStyle = "#fdd371";
                            }
                            this.ctx.fillRect(j*30,i*30,30,30);
                        }
                    }
                }
            }
        }
        //Placement des laser :
        var indices=[]
        for(var i in this.getSupremVue().laser){
            if(!this.game.laser[i].isDead){
                this.ctx.drawImage(
                    this.imgs.balle,
                    this.getSupremVue().laser[i].x*30+8,
                    this.getSupremVue().laser[i].y*30+8,
                    15,15
                )
            }else{
                indices.push(i);
            }
        }
        for(var i in indices){
            this.game.laser.splice(indices[i],1);
            clearInterval(this.gameloop.laser[indices[i]]);
            this.gameloop.laser.splice(indices[i],1);
        }

        //Placement des robots :
        for(var i in this.getAllRobot()){
            this.ctx.drawImage(
                this.imgs[`robot${i}`],
                this.getSupremVue()['robot'+i].x*30,
                this.getSupremVue()['robot'+i].y*30,
                30,30
            );
        }
        if(this.getState()=='paused'){
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        }
    }
    getSupremVue(){
    //return la position de chaque éléments sur la map
    
        var laser=[];
        if(this.game.laser.length>0){
            for(var i in this.game.laser){
                laser.push({
                    x:this.game.laser[i].pos.x,
                    y:this.game.laser[i].pos.y,
                    type:'laser',
                    owner:`robot${this.game.laser[i].robot}`
                });
            }
        }
        return {
            robot0:{
                x:this.getRobot(0).pos.x,
                y:this.getRobot(0).pos.y,
                type:'robot',
                id:0
            },
            robot1:{
                x:this.getRobot(1).pos.x,
                y:this.getRobot(1).pos.y,
                type:'robot',
                id:1
            },
            laser:laser
        };
    }
    addLaser(laser){
        this.game.laser.push(laser);
        this.gameloop.laser.push(
            setInterval(() => {
                laser.move();
                console.log('oui');
            }, laser.speed*1000)
        )
    }
    getMap(){
        return this.game.map.map;
    }
    getSize(){
        return this.game.map.size;
    }
    getSpawns(){
        return this.game.map.spawns;
    }
    getRobot(indice){
        return this.game.robot[indice];
    }
    getAllRobot(){
        return this.game.robot;
    }
    getObj(indice){
        return this.game.obj[indice];
    }
    getAllObj(){
        return this.game.obj;
    }
    getState(){
        return this.game.state;
    }
}