// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Egg from "./Egg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EggsPool extends cc.Component {

    eggs: cc.Node[] = [];

    eggPrefab: cc.Prefab = null;

    start () {

    }

    init (prefab : cc.Prefab){
        this.eggPrefab = prefab;
    }

    put (egg : cc.Node) {
        this.eggs.push(egg);
        egg.removeFromParent();
    }
    
    get () : cc.Node {
        if(this.eggs.length > 0){
            return this.eggs.shift();
        }
        if(this.eggPrefab){
            return cc.instantiate(this.eggPrefab);
        }
    }
}
