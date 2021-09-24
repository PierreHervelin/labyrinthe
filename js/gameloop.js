var canvas=document.getElementById('map');
var ctx=canvas.getContext("2d");
var img=document.getElementById('robot');
var map=new Map([31,21]);
var robot1=new Robot(map,0);
var robot2=new Robot(map,1);

var sword=new Arme(2,5,1);

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //Création de la map :
    pos=[0,0];
    for(var i in map.getMap()){
        for(var j in map.getMap()[i]){
            if(map.getMap()[i][j]==-1){
                ctx.fillStyle = "black";
            }else{
                ctx.fillStyle = "white";
            }
            ctx.fillRect(pos[0], pos[1], 30, 30);
            var vision1=robot1.vision,
                vision2=robot2.vision;
            var isOnVision=false;
            for(var k in vision1){
                var x1=vision1[k][0];
                var y1=vision1[k][1];
                if(i==y1 && j==x1){
                    isOnVision=true;
                }
            }
            for(var k in vision2){
                var x1=vision2[k][0];
                var y1=vision2[k][1];
                if(i==y1 && j==x1){
                    isOnVision=true;
                }
            }
            if(!isOnVision){
                ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                ctx.fillRect(pos[0],pos[1],30,30);
            }
            pos[0]+=30;
        }
        pos[1]+=30;
        pos[0]=0;
    }

    //Placement du robot :
    ctx.drawImage(img,robot1.pos[1]*30,robot1.pos[0]*30,30,30);
    ctx.drawImage(img,robot2.pos[1]*30,robot2.pos[0]*30,30,30);
}

var temp=[];

function robotAI(robot,cible) {
    var x1=robot.pos[1],
        x2=cible.pos[1],
        y1=robot.pos[0],
        y2=cible.pos[0];
    
    for(var i in robot.vision){
        if(x2==robot.vision[i][0] && y2==robot.vision[i][1]){
            robot.lastCiblePosition=[robot.vision[i][1],robot.vision[i][0]];
        }
    }
    if(robot.getFastRoad()){
        var move=robot.getFastRoad([cible.pos[0],cible.pos[1]]);
        if(cible instanceof Robot){
            switch(move[move.length-1]){
                case 'top':
                    if(y1-1==y2 && x1==x2){
                        return -1
                    }
                    break;
                case 'bottom':
                    if(y1+1==y2 && x1==x2){
                        return -1
                    }
                    break;
                case 'left':
                    if(y1==y2 && x1-1==x2){
                        return -1
                    }
                    break;
                case 'right':
                    if(y1==y2 && x1+1==x2){
                        return -1
                    }
                    break; 
                default:
                    break;
            }
        }
        robot.move(move[move.length-1]);
    }else{
        robot.randomMove();
    }
    robot.getVision();
}