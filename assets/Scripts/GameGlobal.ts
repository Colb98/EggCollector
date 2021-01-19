// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import MockServer from "./Server/MockServer";
import Packet, { PacketIDs } from "./Packet";

const {ccclass, property} = cc._decorator;

export default class GameGlobal {
    private static instance: GameGlobal = null;

    curGame: Game = null;
    server: MockServer = null;

    static getInstance () {
        if(GameGlobal.instance == null){
            GameGlobal.instance = new GameGlobal;
            GameGlobal.instance.server = new MockServer(GameGlobal.instance);
        }
        return GameGlobal.instance;
    }

    toMainMenu () {
        cc.director.loadScene("MenuScene");
    }

    startGame () {
        cc.director.loadScene("GameScene", function(){
            // Send start match/find match to server and wait for a signal to start
            this.sendPacket(new Packet(PacketIDs.NEW_GAME));
        }.bind(this));
    }

    openOption () {

    }

    registerGame (game : Game){
        this.curGame = game;
    }

    onReceivePacket(packet: Packet) {
        switch(packet.id){
            case PacketIDs.UPDATE_STATE:
                const state = {
                    players : packet.getField("players"),
                    eggs : packet.getField("eggs"),
                    curTickCollected : packet.getField("curTickCollected")
                };
                if(this.curGame) this.curGame.syncState(state);
                break;
            case PacketIDs.NEW_GAME:
                const speedMultiplier = packet.getField("AISpeed");
                if(this.curGame) {
                    this.curGame.setAIHandicap(speedMultiplier);
                    this.curGame.startGame();
                }
        }
    }

    sendPacket(packet: Packet){
        // Send to server
        this.server.fakeReceivePacket(packet);
    }
}
