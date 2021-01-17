// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameConst from "./GameConst";
import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Egg extends cc.Component {

    @property
    pickRadius: number = 50;
    
    picked: boolean = false;
    logicPosition: cc.Vec2;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    pick (player: Player) {
        if(this.picked) return;
        this.picked = true;
        this.node.active = false;
        player.onPickEggSuccessful();
    }

    reset () {
        this.picked = false;
        this.node.active = true;
    }

    setLogicPosition (pos : cc.Vec2){
        this.logicPosition = pos;
    }

    update (dt) {
        this.node.x = this.logicPosition.x * cc.winSize.width/GameConst.MAP_WIDTH;
        this.node.y = this.logicPosition.y * cc.winSize.height/GameConst.MAP_HEIGHT;
    }
}
