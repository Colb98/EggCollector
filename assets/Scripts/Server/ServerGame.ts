// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameConst from "../GameConst";

const {ccclass, property} = cc._decorator;

export default class ServerGame {
    private timeElapsed: number = 0;
    private started: boolean = false;
    private ended: boolean = false;

    players: Player[] = [];

    reset () {
        this.started = false;
        this.ended = false;
        this.timeElapsed = 0;
        this.players.length = 0;
    }

    start () {
        cc.log("Server start game");
        this.started = true;
        this.players.push(new Player(0));
        this.players[0].setPosition(cc.v2(0.5 * GameConst.MAP_WIDTH/GameConst.PLAYER_MAX, GameConst.MAP_HEIGHT/2));
    }

    canPlay () : boolean {
        return this.started && !this.ended;
    }

    movePlayer (pId : number, direction : cc.Vec2){
        if(!this.canPlay()) return;
        this.players[pId].direction = direction;
        // cc.log("Player %d has moved with direction (%d, %d)", pId, direction.x, direction.y);
    }

    update (dt : number) {
        if(!this.canPlay()) return;
        this.timeElapsed += dt;
        if(this.timeElapsed >= GameConst.GAME_TIME){
            this.ended = true;
        }

        for(let i=0;i<this.players.length;i++){
            this.players[i].update(dt);
        }
    }
}

class Player {
    id : number;
    position : cc.Vec2;
    direction : cc.Vec2 = cc.v2(0, 0);
    score : number;

    constructor (id : number){
        this.id = id;
    }

    setPosition (position : cc.Vec2){
        this.position = position;
    }

    onCollectEgg () {
        this.score += 1;
    }

    update (dt : number){
        let v = cc.v2(this.direction.x, this.direction.y);
        v.normalizeSelf();
        this.position.x += v.x * GameConst.PLAYER_SPEED * dt;
        this.position.y += v.y * GameConst.PLAYER_SPEED * dt;

        this.position.x = Math.min(GameConst.MAP_WIDTH, Math.max(0, this.position.x));
        this.position.y = Math.min(GameConst.MAP_HEIGHT, Math.max(0, this.position.y));

        // cc.log("Player %d has pos (%f, %f)", this.id, this.position.x, this.position.y);
    }
}