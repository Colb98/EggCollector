// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameConst from "../GameConst";
import Player from "./ServerPlayer";
import Egg from "./ServerEgg";

const {ccclass, property} = cc._decorator;

export default class ServerGame {
    private timeElapsed: number = 0;
    private started: boolean = false;
    private ended: boolean = false;

    players: Player[] = [];
    eggs: Egg[] = [];
    eggsPool: Egg[] = [];
    curTickCollected: number[] = [];

    eggLastGenTimeElapsed: number = 0;
    lastEggId: number = 0;
    winner: number = -1;
    AISpeedMultiplier: number = 1;

    reset () {
        this.started = false;
        this.ended = false;
        this.timeElapsed = 0;
        this.players.length = 0;
        this.lastEggId = 0;
        this.winner = -1;
    }

    start () {
        cc.log("Server start game");
        this.started = true;
        for(let i=0;i<GameConst.PLAYER_MAX;i++){
            this.players.push(new Player(i));
            if(i != 0)
                this.players[i].setSpeed(GameConst.PLAYER_SPEED * this.AISpeedMultiplier);
            this.players[i].setPosition(cc.v2((i + 0.5) * GameConst.MAP_WIDTH/GameConst.PLAYER_MAX, GameConst.MAP_HEIGHT/2));
        }
    }

    setHandicapForAI (val){
        this.AISpeedMultiplier = val;
    }

    getWinner (){
        return this.winner;
    }

    canPlay () : boolean {
        return this.started && !this.ended;
    }

    movePlayer (pId : number, direction : cc.Vec2){
        if(!this.canPlay()) return;
        this.players[pId].direction = direction;
        // cc.log("Player %d has moved with direction (%d, %d)", pId, direction.x, direction.y);
    }

    // Pool
    getEgg () : Egg{
        if(this.eggsPool.length > 0){
            const egg = this.eggsPool.shift();
            egg.active = true;
            egg.setId(++this.lastEggId);
            return egg;
        }
        const egg = new Egg();
        egg.setId(++this.lastEggId);
        return egg;
    }

    putEgg (egg : Egg) {
        egg.active = false;
        this.eggsPool.push(egg);
        this.eggs.splice(this.eggs.indexOf(egg), 1);
    }

    checkAllPlayerCannotPick (eggPosition : cc.Vec2){
        const pickRadius2 = GameConst.EGG_PICK_RADIUS * GameConst.EGG_PICK_RADIUS;
        for(let i=0;i<this.players.length;i++){
            const distSqr = cc.Vec2.squaredDistance(this.players[i].position, eggPosition);
            if(distSqr <= pickRadius2)
                return false;
        }
        return true;
    }

    generateEggRandom () {
        const nEggs = Math.floor(Math.random() * GameConst.EGG_MAX_PER_GEN + 1);
        for(let i=0;i<nEggs;i++){
            const egg = this.getEgg();
            // TODO: Poisson generating
            let pos = cc.v2(Math.random() * GameConst.MAP_WIDTH, Math.random() * GameConst.MAP_HEIGHT);
            while(!this.checkAllPlayerCannotPick(pos)){
                pos = cc.v2(Math.random() * GameConst.MAP_WIDTH, Math.random() * GameConst.MAP_HEIGHT);
            }
            egg.setPosition(pos);
            this.eggs.push(egg);
        }
    }

    flushCurTickCollectedEgg () {
        this.curTickCollected.length = 0;
    }

    onGameOver () {
        cc.log("GAME OVER SERVER");
        let idMax = 0;
        for(let i=1;i<this.players.length;i++){
            if(this.players[i].score > this.players[idMax].score){
                idMax = i;
            }
        }
        this.winner = idMax;
    }

    update (dt : number) {
        if(!this.canPlay()) return;
        this.timeElapsed += dt;
        this.eggLastGenTimeElapsed += dt;
        if(this.timeElapsed >= GameConst.GAME_TIME){
            this.ended = true;
            this.onGameOver();
            return;
        }

        if(this.eggLastGenTimeElapsed > GameConst.EGG_GEN_TIME){
            this.eggLastGenTimeElapsed = 0;
            this.generateEggRandom();
        }

        for(let i=0;i<this.players.length;i++){
            this.players[i].update(dt);
            for(let j=0;j<this.eggs.length;j++){
                const egg = this.eggs[j];
                if(egg.active && egg.checkCanPick(this.players[i].position)){
                    this.putEgg(egg);
                    this.players[i].onCollectEgg();
                    this.curTickCollected.push(egg.id);
                    cc.log("player %d got egg %d", i, egg.id);

                }
            }
        }
    }
}


