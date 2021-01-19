// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Packet, { PacketIDs } from "../Packet";
import ServerGame from "./ServerGame";

const {ccclass, property} = cc._decorator;

// @ccclass
export default class Server {
    packetQueue : Packet[];
    game : ServerGame;

    constructor (){
        this.packetQueue = [];
        this.game = new ServerGame;
        this.game.setHandicapForAI(1.2);
    }

    // Should be call by a scheduler
    onTick (dt : number) {
        // Simple implement without multithread
        for(let i=0;i<this.packetQueue.length;i++){
            const packet = this.packetQueue[i];
            this.handlePacket(packet);
        }
        // Flush the queue after tick
        this.packetQueue.length = 0;
        if(this.game){
            this.game.update(dt);
            if(this.game.canPlay()) this.sendGameState();
        }

    }

    sendGameState (){
        const packet = new Packet(PacketIDs.UPDATE_STATE);
        const players = [];
        for(let i=0;i<this.game.players.length;i++){
            const player = this.game.players[i];
            players.push({
                id: player.id,
                pos: player.position,
                dir: player.direction,
                score: player.score
            });
        }
        const eggs = [];
        for(let i=0;i<this.game.eggs.length;i++){
            const egg = this.game.eggs[i];
            eggs.push({
                id: egg.id,
                pos: egg.position
            })
        }
        packet.setField("players", players);
        packet.setField("eggs", eggs);
        // cc.log("HI %s", JSON.stringify(this.game.curTickCollected));
        packet.setField("curTickCollected", [...this.game.curTickCollected]); // Clone the array
        this.game.flushCurTickCollectedEgg();
        // cc.log("YEP %s", JSON.stringify(packet.getField("curTickCollected")));
        this.sendPacket(packet);
    }

    handlePacket (packet : Packet) {
        switch(packet.id){
            case PacketIDs.MOVE:
                this.game.movePlayer(packet.getField("pId"), packet.getField("direction"));
                break;
            case PacketIDs.NEW_GAME:
                this.game.reset();
                this.game.start();
                const newGame = new Packet(PacketIDs.NEW_GAME);
                newGame.setField("AISpeed", this.game.AISpeedMultiplier);
                this.sendPacket(packet);
                break;
        }
    }

    sendPacket (packet : Packet){
        // Send the packet
    }
}