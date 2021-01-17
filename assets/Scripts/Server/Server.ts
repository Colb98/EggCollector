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
        packet.setField("players", players);
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
                this.sendPacket(new Packet(PacketIDs.NEW_GAME));
                break;
        }
    }

    sendPacket (packet : Packet){
        // Send the packet
    }
}