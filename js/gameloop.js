var canvas=document.getElementById('map');
var ctx=canvas.getContext("2d");
var img=document.getElementById('robot');
var map=new Map([21,17]);
var robot1=new Robot(map,0);
var robot2=new Robot(map,1);

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //Création de la map :
    pos=[0,0]
    for(var i in map.getMap()){
        for(var j in map.getMap()[i]){
            if(map.getMap()[i][j]==-1){
                ctx.fillStyle = "black";
            }else{
                ctx.fillStyle = "white";
            }
            ctx.fillRect(pos[0], pos[1], 40, 40);
            ctx.fillStyle = "black";
            ctx.strokeText(robot1.map.map[i][j],pos[0]+20,pos[1]+20);
            pos[0]+=40;
        }
        pos[1]+=40;
        pos[0]=0;
    }

    //Placement du robot :
    ctx.drawImage(img,robot1.pos[1]*40,robot1.pos[0]*40,40,40)
    ctx.drawImage(img,robot2.pos[1]*40,robot2.pos[0]*40,40,40)
}

function robotAI(robot,cible) {
    var move=robot.getFastRoad([cible.pos[0],cible.pos[1]]);
    robot.move(move[move.length-1]);
}