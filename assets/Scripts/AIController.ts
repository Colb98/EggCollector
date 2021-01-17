// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerController from "./PlayerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AIController extends PlayerController {
    timeElapsed: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        // if(this.timeElapsed % 2 < dt){
        //     this.direction.x = Math.floor(Math.random()*2);
        //     this.direction.y = Math.floor(Math.random()*2);
        //     this.direction.z = Math.floor(Math.random()*2);
        //     this.direction.w = Math.floor(Math.random()*2);
        // }
        // this.timeElapsed += dt;
    }
}
