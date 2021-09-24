class Arme{
    damage;
    durability;
    speed;
    constructor(damage,durability,speed){
        this.damage=damage;
        this.durability=durability;
        this.speed=speed;
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