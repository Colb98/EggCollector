// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerController from "./PlayerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManualController extends PlayerController {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {

    }

    onKeyDown (event) {
        switch(event.keyCode){
            case cc.macro.KEY.a:
                this.direction.x = 1;
                break;
            case cc.macro.KEY.d:
                this.direction.y = 1;
                break;
            case cc.macro.KEY.s:
                this.direction.z = 1;
                break;
            case cc.macro.KEY.w:
                this.direction.w = 1;
                break;
        }
    }

    onKeyUp (event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
                this.direction.x = 0;
                break;
            case cc.macro.KEY.d:
                this.direction.y = 0;
                break;
            case cc.macro.KEY.s:
                this.direction.z = 0;
                break;
            case cc.macro.KEY.w:
                this.direction.w = 0;
                break;
        }
    }

}
