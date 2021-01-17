// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreBoard extends cc.Component {

    @property(cc.Label)
    pId: cc.Label = null;

    @property(cc.Label)
    pScore: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    initPlayer (playerId : number){
        this.pId.string = "P" + playerId;
        this.pScore.string = "0";
    }

    setScore (score : number){
        this.pScore.string = score.toString();
    }

    // update (dt) {}
}
