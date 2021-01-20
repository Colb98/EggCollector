// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum PacketIDs {
    NEW_GAME,
    MOVE,
    UPDATE_STATE,
    END_GAME
}

// @ccclass
export default class Packet {
    fields: Map<string, any> = new Map();
    id: PacketIDs;

    constructor (id : PacketIDs) {
        this.id = id;
    }

    setField (key : string, value : any) : any {
        let ret = null;
        if(this.fields.has(key)){
            ret = this.fields.get(key);
        }
        this.fields.set(key, value);
        return ret;
    }

    getField (key : string) {
        return this.fields.get(key);
    }
}