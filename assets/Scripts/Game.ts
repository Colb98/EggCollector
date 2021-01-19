// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Egg from "./Egg";
import EggsPool from "./EggsPool";
import GameConst from "./GameConst";
import GameGlobal from "./GameGlobal";
import Player from "./Player";
import ScoreBoard from "./ScoreBoard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    eggPrefab: cc.Prefab = null;
    @property([cc.Prefab])
    playerPrefabs: cc.Prefab[] = [];
    @property(cc.Prefab)
    scoreUIPrefab: cc.Prefab = null;
    // @property
    numberOfPlayers: number = GameConst.PLAYER_MAX;
    // @property
    gameTime: number = GameConst.GAME_TIME;

    eggsPool: EggsPool = null;
    eggs: Egg[] = [];
    players: Player[] = [];
    scoreBoards: ScoreBoard[] = [];

    private timeElapsed: number = 0;
    private started: boolean = false;
    private ended: boolean = false;
    private AISpeedMultiplier: number = 1;


    onLoad () {
        this.eggsPool = new EggsPool;
        this.eggsPool.init(this.eggPrefab);
    }

    start () {
        this.generatePlayers();

        GameGlobal.getInstance().registerGame(this);
    }

    generatePlayers () {
        if(this.playerPrefabs.length == 0) return;
        for(let i=0;i<this.numberOfPlayers;i++){
            // The first prefab is only for manual player, others is for AI
            let prefab = this.playerPrefabs[Math.floor(Math.random() * (this.playerPrefabs.length-1)) + 1];
            if(i == 0) {
                prefab = this.playerPrefabs[0];
            }

            var pos = cc.v2((i + 0.5) * GameConst.MAP_WIDTH/this.numberOfPlayers, GameConst.MAP_HEIGHT/2);
            var newPlayer = cc.instantiate(prefab);
            this.node.addChild(newPlayer);
            const player = newPlayer.getComponent(Player);
            player.setLogicPosition(pos);
            player.id = i;
            if(i != 0)
                player.setSpeed(this.AISpeedMultiplier);
            this.players.push(player);

            let scoreBoard = cc.instantiate(this.scoreUIPrefab);
            scoreBoard.setPosition((i%3 + 0.5) * 300 + 10, cc.winSize.height - 100 * Math.floor(i/3) - 10);
            this.node.addChild(scoreBoard);
            this.scoreBoards.push(scoreBoard.getComponent(ScoreBoard));
            this.scoreBoards[i].initPlayer(i+1);
            scoreBoard.zIndex = 1;
        }
    }

    // instantiateEggRandom () {
    //     const winSize = cc.winSize;
    //     if(this.eggPrefab != null){
    //         const numEggGen = Math.random() * 4 + 1;
    //         for(let i=0;i<numEggGen;i++){
    //             let pos = cc.v2(Math.random()*GameConst.MAP_WIDTH, Math.random()*GameConst.MAP_HEIGHT);
    //             let newEgg = this.eggsPool.get();
    //             newEgg.getComponent(Egg).setLogicPosition(pos);
    //             this.node.addChild(newEgg);
    //             this.eggs.push(newEgg.getComponent(Egg));
    //         }
    //     }
    // }

    syncState (state){
        for(let i=0;i<state.players.length;i++){
            const data = state.players[i];
            const player = this.players[data.id];
            player.setLogicPosition(data.pos);
            player.setDirection(data.dir);
            player.setScore(data.score);
        }
        for(let i=0;i<state.eggs.length;i++){
            const data = state.eggs[i];
            let egg = this.getEgg(data.id);
            if(!egg){
                const eggNode = this.eggsPool.get();
                egg = eggNode.getComponent(Egg);
                egg.setId(data.id);
                egg.setLogicPosition(data.pos);
                this.node.addChild(eggNode);
                this.eggs.push(egg);
            }
        }
        for(let i=0;i<state.curTickCollected.length;i++){
            const data = state.curTickCollected[i];
            let egg = this.getEgg(data);
            if(egg == undefined){
                cc.log("Cannot find egg with id", data);
                continue;
            }
            this.eggs.splice(this.eggs.indexOf(egg), 1);
            this.eggsPool.put(egg.node);
        }

        this.updateScores();
    }

    getEgg (id : number){
        return this.eggs.find(egg => egg.id == id);
    }

    updateScores () {
        for(let i=0;i<this.players.length;i++){
            this.scoreBoards[i].setScore(this.players[i].score);
        }
    }

    // pauseGame () {
    //     this.isPaused = true;
    // }

    exitToMainMenu () {
        if(GameGlobal.getInstance() != null){
            GameGlobal.getInstance().toMainMenu();
        }
    }

    startGame () {
        cc.log("Client start game");
        this.started = true;
    }

    setAIHandicap (val){
        // this.AISpeedMultiplier = val;
    }

    canPlay () {
        return this.started && !this.ended;
    }

    update (dt) {
        if(!this.canPlay()) return;
        this.timeElapsed += dt;

        if(this.timeElapsed >= this.gameTime){
            cc.log("GAME OVER");
            this.ended = true;
            return;
        }

        // Server side
        // if(this.timeElapsed % GameConst.EGG_GEN_TIME < dt){
        //     this.instantiateEggRandom();
        // }

        // for(let i=0;i<this.players.length;i++){
        //     for(let j=0;j<this.eggs.length;j++){
        //         if(this.eggs[j].node.active){
        //             const distance = this.players[i].node.getPosition().sub(this.eggs[j].node.getPosition());
        //             if(distance.len() < this.eggs[j].pickRadius){
        //                 this.eggs[j].pick(this.players[i]);
        //                 this.eggsPool.put(this.eggs[j].node);
        //                 //TODO: refactor
        //                 this.scoreBoards[i].setScore(this.players[i].score);
        //             }
        //         }
        //     }
        // }
    }
}
