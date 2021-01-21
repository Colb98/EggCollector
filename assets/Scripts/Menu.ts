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
export default class Menu extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.AudioClip)
    bgm : cc.AudioClip = null;
    @property(cc.AudioClip)
    coin : cc.AudioClip = null;
    @property(cc.AudioClip)
    win : cc.AudioClip = null;
    @property(cc.AudioClip)
    lose : cc.AudioClip = null;

    @property(cc.Node)
    optionUI : cc.Node = null;

    // onLoad () {}

    start () {
        GameGlobal.getInstance().initAudioClips(this.bgm, this.coin, this.win, this.lose);
    }

    startGame () {
        GameGlobal.getInstance().startGame();
    }
    // update (dt) {}

    openOption () {
        this.optionUI.active = true;
    }
}
