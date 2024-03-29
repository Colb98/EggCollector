// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import GameConst from "./GameConst";
import GameGlobal from "./GameGlobal";
import ManualController from "./ManualController";
import Packet, { PacketIDs } from "./Packet";
import PlayerController from "./PlayerController";

const {ccclass, property} = cc._decorator;

enum Direction {
    Up,
    Down,
    Left,
    Right,
};


@ccclass
export default class Player extends cc.Component {
    // @property
    speed: number = GameConst.PLAYER_SPEED;
    
    // 0: down, 1: up, 2: left, 3: right
    facing: Direction = Direction.Down;
    score: number = 0;
    logicPosition: cc.Vec2 = cc.v2(0,0);
    id: number = 0;

    lastUpdateFacing: number = 0;
    animationStopped: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onPickEggSuccessful () {
        this.score += 1;
        const action = cc.repeat(cc.sequence(cc.tintTo(0.1, 0, 0, 0), cc.tintTo(0.1, 255, 255, 255)), 5);
        // this.node.runAction(action);
        cc.tween(this.node)
        .repeat(5, 
            cc.tween()
            .to(0.1, {color: cc.color(0,0,0)})
            .to(0.1, {color: cc.color(255,255,255)}))
        .start();

        const audioSource = this.node.getComponent(cc.AudioSource);
        if(audioSource){
            audioSource.play();
        }
        
    }

    isManual (){
        return this.getComponent(PlayerController) instanceof ManualController;
    }

    update (dt) {
        const direction = this.getComponent(PlayerController).direction;
        var dx = direction.y - direction.x;
        var dy = direction.w - direction.z;
        var v = cc.v2(dx, dy);
        v.normalizeSelf();

        // this.logicPosition.x += v.x * this.speed * dt;
        // this.logicPosition.y += v.y * this.speed * dt;

        // this.logicPosition.x = Math.min(GameConst.MAP_WIDTH, Math.max(0, this.logicPosition.x));
        // this.logicPosition.y = Math.min(GameConst.MAP_HEIGHT, Math.max(0, this.logicPosition.y));

        if(this.isManual()){
            const movePacket = new Packet(PacketIDs.MOVE);
            movePacket.setField("pId", 0);
            movePacket.setField("direction", cc.v2(dx, dy));
            GameGlobal.getInstance().sendPacket(movePacket);
            // cc.log("Client: has position (%f, %f)", this.logicPosition.x, this.logicPosition.y);
        }

        this.node.x = this.logicPosition.x * Game.playableSize.width/GameConst.MAP_WIDTH;
        this.node.y = this.logicPosition.y * Game.playableSize.height/GameConst.MAP_HEIGHT;
        this.updateFacing(v);
    }

    setSpeed (speed) {
        this.speed = speed;
    }

    setScore (score : number) {
        if(score > this.score){
            this.onPickEggSuccessful();
        }
        this.score = score;
    }

    setLogicPosition (pos : cc.Vec2) {
        this.logicPosition = pos;
    }

    setDirection (dir : cc.Vec2){
        this.updateFacing(dir);
    }

    setColorRing (color : cc.Color){
        this.node.getChildByName("LightRing").color = color;
    }

    updateFacing (direction : cc.Vec2) {
        var dx = direction.x;
        var dy = direction.y;
        var newFacing : Direction = null;
        var animator = this.node.getChildByName("Player").getComponent(cc.Animation);

        if(dy != 0){
            if(direction.y > 0) newFacing = Direction.Up;
            else newFacing = Direction.Down;
        }
        else if(dx != 0){
            if(direction.x > 0) newFacing = Direction.Right;
            else newFacing = Direction.Left;
        }
        else {
            // at least 0.4s with no direction update => stop animation
            if(!this.isManual() && (Date.now() - this.lastUpdateFacing > 300)){
                animator.setCurrentTime(0);
                animator.stop();
                this.animationStopped = true;
            }
            else if(this.isManual()){
                animator.setCurrentTime(0);
                animator.stop();
                this.animationStopped = true;
            }
        }

        if((this.animationStopped || newFacing != this.facing) && newFacing != null){
            switch(newFacing){
                case Direction.Up: animator.play("PlayerWalkBackward", 0.25); break;
                case Direction.Down: animator.play("PlayerWalkForward", 0.25); break;
                case Direction.Left: animator.play("PlayerWalkLeft", 0.25); break;
                case Direction.Right: animator.play("PlayerWalkRight", 0.25); break;
            }

            this.facing = newFacing;
            this.lastUpdateFacing = Date.now();
            this.animationStopped = false;
        }
        else if(newFacing == this.facing){
            this.lastUpdateFacing = Date.now();
        }

    }
}
