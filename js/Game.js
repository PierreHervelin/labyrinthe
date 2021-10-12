class Game {
    game;
    canvas;
    ctx;
    imgs;
    gameloop;
    reveal=false;
    constructor(canvas){
        this.game={state:'stopped'};
        this.canvas=document.getElementById(canvas);
        this.idLaser=0;
    }
    _init(){
        this.game={
            robot:[],
            map:new Map([31,21]),
            obj:{},
            laser:[],
            state:'init',
            startTime:new Date(),
            pauseTime:0
        };

        //INIT robots
        this.game.robot.push(
            new Robot(this,0),
            new Robot(this,1)
        );

        this.reveal=false;

        this.game.obj.weapons={
            gun:new Arme(2.5,8,'ranged'),
            katana:new Arme(4,1,'melee')
        };

        //placement des armes sur la map
        for(var i in this.getObj('weapons')){
            var x=getRandomInt(1,this.getSize()[0]-2),
                y=getRandomInt(1,this.getSize()[1]-2);
            
            while(
                    this.getMap()[y][x]==-1 &&
                    !(getIndex(this.getSupremVue(),[x,y]))
                ){
                x=getRandomInt(1,this.getSize()[0]-2),
                y=getRandomInt(1,this.getSize()[1]-2);
            }
            this.getWeapon(i).pos={x,y};
        }

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
            balle:document.getElementById('img-balle'),
            dead:document.getElementById('img-dead'),
            gun:document.getElementById('img-gun'),
            katana:document.getElementById('img-katana')
        }
    }
    start(){
        if(this.game.state=='paused'){
            this.game.pauseTime+=this.game.gameInPauseTime;
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
        if(this.game.state=='stopped' || this.game.state=='finished'){
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
            for(var i in this.game.laser){
                clearInterval(this.gameloop.laser[i]);
            }
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
            for(var i in this.game.laser){
                clearInterval(this.gameloop.laser[i]);
            }
        }
    }
    finish(){
        if(this.game.state=='started'){
            this.game.state='finished';
            Object.keys(this.gameloop).map((key)=>{
                clearInterval(this.gameloop[key]);
            });
            for(var i in this.game.laser){
                clearInterval(this.gameloop.laser[i]);
            }
        }
    }
    revealMap(){
        this.reveal=true;
    }
    hideMap(){
        this.reveal=false;
    }
    setTime(){
        var time=(this.game.currentTime.getTime()-this.game.pauseTime)-this.game.startTime.getTime();
        var ms=time%1000;
        time=(time-ms)/1000;
        var secs=time%60;
        time=(time-secs)/60;
        var mins=time%60;

        if(mins===1&&secs<=5){
            this.revealMap();
            document.querySelector('.time').classList.add('blinkRed');
        }else{
            document.querySelector('.time').classList.remove('blinkRed');
            this.hideMap();
        }

        if(secs<10){
            secs=`0${secs}`;
        }
        if(mins<10){
            mins=`0${mins}`;
        }

        document.querySelector('.time').innerHTML=`${mins}:${secs}`;
    }
    loop(){
        this.ctx.clearRect(
            0,0,
            this.canvas.width,
            this.canvas.height
        );

        if(this.getState()==='paused'){
            this.game.gameInPauseTime=new Date().getTime()-this.game.currentTime.getTime();
        }else{
            this.game.currentTime=new Date();
            this.setTime();
        }

        //Génération de la map :
        for(var i in this.getMap()){
            for(var j in this.getMap()[i]){
                if(this.getRobot(0).isDead||this.getRobot(1).isDead||this.reveal){
                    if(this.getMap()[i][j]==-1){
                        this.ctx.fillStyle = "#333";
                    }else{
                        this.ctx.fillStyle = "#fdd371";
                    }
                    this.ctx.fillRect(j*30,i*30,30,30);

                    //placement des armes sur la map
                    for(var key in this.getObj('weapons')){
                        var xWeapon=this.getSupremVue()[key].x,
                            yWeapon=this.getSupremVue()[key].y;
                        if(xWeapon==j && yWeapon==i){
                            this.ctx.drawImage(
                                this.imgs[key],
                                j*30+2,i*30+2,
                                25,25
                            );
                        }
                    }
                }else{
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

                                //placement des armes si elles sont dans le champs de vision :
                                for(var key in this.getObj('weapons')){
                                    var xWeapon=this.getSupremVue()[key].x,
                                        yWeapon=this.getSupremVue()[key].y;
                                    if(xWeapon==j && yWeapon==i){
                                        this.ctx.drawImage(
                                            this.imgs[key],
                                            j*30+2,i*30+2,
                                            25,25
                                        );
                                    }
                                }
                            }
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
            if(this.getRobot(i).isDead){
                this.ctx.drawImage(
                    this.imgs.dead,
                    this.getSupremVue()['robot'+i].x*30,
                    this.getSupremVue()['robot'+i].y*30,
                    30,30
                );
            }else{
                this.ctx.drawImage(
                    this.imgs[`robot${i}`],
                    this.getSupremVue()['robot'+i].x*30,
                    this.getSupremVue()['robot'+i].y*30,
                    30,30
                );
            }
        }
        if(this.getState()=='paused'){
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        }
        //Actualisation des barres de vies :
        var health0=document.getElementById('health0'),
            health1=document.getElementById('health1');
        
        health0.style.width=`${this.getRobot(0).health*10}%`;
        health1.style.width=`${this.getRobot(1).health*10}%`;

        if(this.getRobot(0).isDead||this.getRobot(1).isDead){
            this.finish();
        }
    }
    getSupremVue(){
    //return la position de chaque éléments sur la map
        var supremVue={
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
            }
        };
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
        supremVue.laser=laser;
        for(var key in this.getObj('weapons')){
            supremVue[key]={
                x:this.getWeapon(key).pos.x,
                y:this.getWeapon(key).pos.y,
                type:'weapon',
                id:key
            };
        }
        return supremVue;
    }
    addLaser(laser){
        this.game.laser.push(laser);
        this.gameloop.laser.push(
            setInterval(() => {
                laser.move();
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
    getWeapon(weapon){
        return this.game.obj.weapons[weapon];
    }
    getState(){
        return this.game.state;
    }
}