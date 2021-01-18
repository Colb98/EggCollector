// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameGlobal from "../GameGlobal";
import Packet from "../Packet";
import Server from "./Server";

const {ccclass, property} = cc._decorator;

class PacketQueueElement {
    packet: Packet;
    timeInQueue: number;

    constructor (packet : Packet){
        this.packet = packet;
        this.timeInQueue = performance.now();
    }
}

// @ccclass
export default class MockServer extends Server {
    client : GameGlobal;
    lastTickTime: number;
    realTime : boolean = false;

    // Fake network latency by using a queue (maintain the packets' order)
    outPacketQueue: PacketQueueElement[] = [];

    constructor (gameClient : GameGlobal) {
        super();
        this.client = gameClient;
        this.lastTickTime = performance.now();
        setInterval(this.tick.bind(this), 1000/60);

        if(!this.realTime){
            // Mock latency
            setInterval(this.mockLatency.bind(this), 1);
        }
    }

    fakeReceivePacket (packet : Packet) {
        this.packetQueue.push(packet);
    }

    sendPacket (packet : Packet){
        // cc.log("send packet", performance.now());
        if(this.realTime){
            this.client.onReceivePacket(packet);
        }
        else{
            this.outPacketQueue.push(new PacketQueueElement(packet));
        }
    }

    tick () {
        const curTime = performance.now();
        const dt = (curTime - this.lastTickTime)/1000;
        super.onTick(dt);
        this.lastTickTime = curTime;

        if(this.lastTickTime % 3 < dt)
            this.AIAutoMove();
    }

    AIAutoMove () {
        for(let i=1;i<this.game.players.length;i++){
            const ai = this.game.players[i];
            ai.direction.x = Math.floor(Math.random()*3 - 1);
            ai.direction.y = Math.floor(Math.random()*3 - 1);
        }
    }

    mockLatency () {
        if(this.outPacketQueue.length == 0) return;
        const curTime = performance.now();
        // If packet in queue for x ms (x is 0.1 ~ 0.5) then it should be sent to client
        const x = Math.random() * 0.4 + 0.1;
        
        let i = 0;
        while((curTime - this.outPacketQueue[i].timeInQueue)/1000 > x){
            // cc.log("send real packet", curTime);
            this.client.onReceivePacket(this.outPacketQueue.shift().packet);
            if(this.outPacketQueue.length == 0) break;
        }
    }
}
