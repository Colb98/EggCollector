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
            newPlayer.getComponent(Player).setLogicPosition(pos);
            this.players.push(newPlayer.getComponent(Player));

            let scoreBoard = cc.instantiate(this.scoreUIPrefab);
            scoreBoard.setPosition((i%3 + 0.5) * 300 + 10, cc.winSize.height - 100 * Math.floor(i/3) - 10);
            this.node.addChild(scoreBoard);
            this.scoreBoards.push(scoreBoard.getComponent(ScoreBoard));
            this.scoreBoards[i].initPlayer(i+1);
            scoreBoard.zIndex = 1;
        }
    }

    instantiateEggRandom () {
        const winSize = cc.winSize;
        if(this.eggPrefab != null){
            const numEggGen = Math.random() * 4 + 1;
            for(let i=0;i<numEggGen;i++){
                let pos = cc.v2(Math.random()*GameConst.MAP_WIDTH, Math.random()*GameConst.MAP_HEIGHT);
                let newEgg = this.eggsPool.get();
                newEgg.getComponent(Egg).setLogicPosition(pos);
                this.node.addChild(newEgg);
                this.eggs.push(newEgg.getComponent(Egg));
            }
        }
    }

    syncState (state){
        for(let i=0;i<state.length;i++){
            const player = this.players[state[i].id];
            player.setLogicPosition(state[i].pos);
            player.setDirection(state[i].dir);
            // player.setScore(state[i].score);
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
        if(this.timeElapsed % 2 < dt){
            this.instantiateEggRandom();
        }

        //TODO: split the screen to multiple area to optimize performance
        for(let i=0;i<this.players.length;i++){
            for(let j=0;j<this.eggs.length;j++){
                if(this.eggs[j].node.active){
                    const distance = this.players[i].node.getPosition().sub(this.eggs[j].node.getPosition());
                    if(distance.len() < this.eggs[j].pickRadius){
                        this.eggs[j].pick(this.players[i]);
                        this.eggsPool.put(this.eggs[j].node);
                        //TODO: refactor
                        this.scoreBoards[i].setScore(this.players[i].score);
                    }
                }
            }
        }
    }
}
