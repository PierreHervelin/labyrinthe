class Laser{
    speed=0.05;
    damage=1;
    pos;
    dir;
    game;
    isDead=false;
    constructor(game,x,y,dir){
        this.pos={x,y};
        this.dir=dir;
        this.game=game;
    }
    move(){
        var x=this.pos.x,
            y=this.pos.y;

        var map=this.game.getMap(),
            size=this.game.getSize();

        switch (this.dir) {
            case 'left':
                if(
                    x-1>0 && map[y][x-1]!=-1 &&
                    !(this.thereIsRobot())
                ){
                    this.pos.x-=1;
                    return
                }
                break;
            case 'right':
                if(
                    x+1<size[0]-1 && map[y][x+1]!=-1 &&
                    !(this.thereIsRobot())
                ){
                    this.pos.x+=1;
                    return
                }
                break;
            case 'top':
                if(
                    y-1>0 && map[y-1][x]!=-1 &&
                    !(this.thereIsRobot())
                ){
                    this.pos.y-=1;
                    return
                }
                break;
            case 'bottom':
                if(
                    y+1<size[1]-1 && map[y+1][x]!=-1 &&
                    !(this.thereIsRobot())
                ){
                    this.pos.y+=1;
                    return
                }
                break;
            default:
                break;
        }
        this.isDead=true;
    }
    thereIsRobot(){
        var x=this.pos.x,
            y=this.pos.y;

        var supremVue=this.game.getSupremVue();

        switch (this.dir) {
            case 'left':
                if(
                    (x-1==supremVue.robot1.x && y==supremVue.robot1.y) || 
                    (x-1==supremVue.robot0.x && y==supremVue.robot0.y)
                ){
                    return true;
                }
                break;
            case 'right':
                if(
                    (x+1==supremVue.robot1.x && y==supremVue.robot1.y) || 
                    (x+1==supremVue.robot0.x && y==supremVue.robot0.y)
                ){
                    return true;
                }
                break;
            case 'top':
                if(
                    (x==supremVue.robot1.x && y-1==supremVue.robot1.y) || 
                    (x==supremVue.robot0.x && y-1==supremVue.robot0.y)
                ){
                    return true;
                }
                break;
            case 'bottom':
                if(
                    (x==supremVue.robot1.x && y+1==supremVue.robot1.y) || 
                    (x==supremVue.robot0.x && y+1==supremVue.robot0.y)
                ){
                    return true;
                }
                break;
        
            default:
                break;
        }
        return false;
    }
}