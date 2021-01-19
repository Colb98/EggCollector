import GameConst from "../GameConst";
import Egg from "./ServerEgg";

export default class Player {
    id : number;
    position : cc.Vec2;
    direction : cc.Vec2 = cc.v2(0, 0);
    score : number = 0;
    aiming : Egg = null;
    speed : number = GameConst.PLAYER_SPEED;
    // Though using a pool for egg in map. 
    // We shouldn't worry about aiming into a disappeared egg
    // Because eggs are removed after being created. 
    // So there is no chance an egg is removed and recycled in one frame
    

    constructor (id : number){
        this.id = id;
        this.score = 0;
    }

    setPosition (position : cc.Vec2){
        this.position = position;
    }

    onCollectEgg () {
        this.score += 1;
        this.aiming = null;
    }

    setSpeed (val){
        this.speed = val;
    }

    update (dt : number){
        let v = cc.v2(this.direction.x, this.direction.y);
        v.normalizeSelf();
        this.position.x += v.x * this.speed * dt;
        this.position.y += v.y * this.speed * dt;

        this.position.x = Math.min(GameConst.MAP_WIDTH, Math.max(0, this.position.x));
        this.position.y = Math.min(GameConst.MAP_HEIGHT, Math.max(0, this.position.y));

        // cc.log("Player %d has pos (%f, %f)", this.id, this.position.x, this.position.y);
    }
}