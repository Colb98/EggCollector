// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export default class GameConst {
    static readonly MAP_WIDTH : number = 480;
    static readonly MAP_HEIGHT : number = 320;
    static readonly PLAYER_MAX : number = 4;

    // Pixels per second
    static readonly PLAYER_SPEED : number = 90;
    static readonly GAME_TIME : number = 60;
    static readonly EGG_PICK_RADIUS : number = 30;
    static readonly EGG_GEN_TIME : number = 1.5;
    static readonly EGG_MAX_PER_GEN : number = 9;
}
