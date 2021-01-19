import GameConst from "../GameConst";

export default class Egg {
    position : cc.Vec2;
    pickRadius : number = GameConst.EGG_PICK_RADIUS;
    active : boolean = true;
    id : number;

    setPosition (pos : cc.Vec2){
        this.position = pos;
    }

    setId (id : number){
        this.id = id;
    }

    checkCanPick (pos : cc.Vec2){
        // cc.log("POS %s %s", JSON.stringify(pos), JSON.stringify(this.position));
        // cc.log("distance %f %f", cc.Vec2.squaredDistance(pos, this.position), this.pickRadius * this.pickRadius);
        return cc.Vec2.squaredDistance(pos, this.position) <= this.pickRadius * this.pickRadius;
    }
}