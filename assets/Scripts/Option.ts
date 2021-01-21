// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameConst from "./GameConst";
import GameGlobal from "./GameGlobal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    speedMultiplier : cc.EditBox = null;
    @property(cc.EditBox)
    playerNum : cc.EditBox = null;
    @property(cc.EditBox)
    eggGenTime : cc.EditBox = null;
    @property(cc.EditBox)
    eggPerGen : cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    hide () {
        this.node.active = false;
    }

    toggleMusic (){
        GameGlobal.getInstance().toggleMusic();
    }

    resetDefault (){
        this.speedMultiplier.string = "1.2";
        this.playerNum.string = "4";
        this.eggGenTime.string = "1.5";
        this.eggPerGen.string = "10";

        this.saveConfig();
    }

    saveConfig () {
        const speed = Math.max(0.1, Math.min(3.0, parseFloat(this.speedMultiplier.string) || 1.2));
        const playerNumber = Math.max(2, Math.min(8, parseFloat(this.playerNum.string) || 4));
        const eggGenerateTime = parseFloat(this.eggGenTime.string) || 1.5;
        const eggPerGen = parseFloat(this.eggPerGen.string) || playerNumber * 2.5;
        
        GameConst.EGG_GEN_TIME = eggGenerateTime;
        GameConst.EGG_MAX_PER_GEN = eggPerGen;
        GameConst.PLAYER_MAX = playerNumber;
        
    }
    // update (dt) {}
}
