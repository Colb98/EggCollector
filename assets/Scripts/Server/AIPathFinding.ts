// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Egg from "./ServerEgg";
import Player from "./ServerPlayer";

const {ccclass, property} = cc._decorator;

const THRESHOLD = 100;
const GOOD_ENOUGH_DIRECTION = 6;

export default class AIPathFinding{
    static currentMapState: Egg[];

    // Find the direction that have most egg
    // If there is an egg in range (near enough) lock on it
    static findDirection (character : Player, others : Player[]) {
        if(character.aiming && character.aiming.active){
            AIPathFinding.setDirectionByAiming(character);
            return;
        }
        character.aiming = null;
        const hasDirection : boolean = character.direction.x != 0 || character.direction.y != 0;
        let nearestEgg : Egg = null;
        let nearestDist : number = 9999;
        let NE : number = 0, NW : number = 0, SE : number = 0, SW : number = 0;
        let curDirCount : number = 0;
        for(let i=0;i<AIPathFinding.currentMapState.length;i++){
            const curEgg = AIPathFinding.currentMapState[i];
            if(!curEgg.active) continue;
            const curDist = cc.Vec2.distance(curEgg.position, character.position);
            if(curDist < nearestDist){
                // if there is another player near the egg and aim on it then surrender it
                // if he is aiming at another one then can compete
                const competes = others.map(other => {
                        if(other.aiming == null || other.aiming == curEgg)
                            return cc.Vec2.distance(curEgg.position, other.position);
                        return 999;
                    });
                if(curDist < Math.min(...competes)){
                    nearestEgg = curEgg;
                    nearestDist = curDist;
                }
            }
            // Check if it's the same sign
            if(hasDirection && character.direction.x * (curEgg.position.x - character.position.x) >= 0 &&
            character.direction.y * (curEgg.position.y - character.position.y) >= 0){
                curDirCount += 1;
            }

            if(curEgg.position.x > character.position.x){
                if(curEgg.position.y > character.position.y){
                    NE += 1;
                }
                else {
                    SE += 1;
                }
            }
            else{
                if(curEgg.position.y > character.position.y){
                    NW += 1;
                }
                else {
                    SW += 1;
                }
            }
        }


        // GOOD ENOUGH 
        if((curDirCount > GOOD_ENOUGH_DIRECTION || curDirCount > AIPathFinding.currentMapState.length/5) && hasDirection) return;

        if(nearestDist < THRESHOLD){
            character.aiming = nearestEgg;
            AIPathFinding.setDirectionByAiming(character);
        }
        else {
            // If there is more other player that direction then it became less attractive
            let playerNE = 0, playerNW = 0, playerSE = 0, playerSW = 0;

            for(let i=0;i<others.length;i++){
                if(others[i].position.x > character.position.x){
                    playerNE += 0.5;
                    playerSE += 0.5;
                }
                if(others[i].position.x < character.position.x){
                    playerNW += 0.5;
                    playerSW += 0.5;
                }
                if(others[i].position.y > character.position.y){
                    playerNE += 0.5;
                    playerNW += 0.5;
                }
                if(others[i].position.y < character.position.y){
                    playerSE += 0.5;
                    playerSW += 0.5;
                }
            }
            NW *= 1.2 - (playerNW/others.length);
            NE *= 1.2 - (playerNE/others.length);
            SW *= 1.2 - (playerSW/others.length);
            SE *= 1.2 - (playerSE/others.length);

            const maxEggDirection = Math.max(NW, NE, SW, SE);
            switch(maxEggDirection){
                case NE: character.direction.x = 1; character.direction.y = 1; break;
                case NW: character.direction.x = -1; character.direction.y = 1; break;
                case SE: character.direction.x = 1; character.direction.y = -1; break;
                case SW: character.direction.x = -1; character.direction.y = -1; break;
            }
        }
    }

    static setState (eggs : Egg[]){
        AIPathFinding.currentMapState = eggs;
    }

    static setDirectionByAiming (character : Player){

        character.direction.x = character.aiming.position.x - character.position.x;
        character.direction.y = character.aiming.position.y - character.position.y;

        // Make animation work better when the AI come near the egg
        if(Math.abs(character.direction.x) > Math.abs(3*character.direction.y)){
            character.direction.y = 0;
        }
        else if(Math.abs(character.direction.y) > Math.abs(3*character.direction.x)){
            character.direction.x = 0;
        }

        // if(character.id == 1) cc.log("DIRECTION BY AIMING (%f,%f)", character.direction.x, character.direction.y);


        if(character.direction.x != 0) character.direction.x /= Math.abs(character.direction.x);
        if(character.direction.y != 0) character.direction.y /= Math.abs(character.direction.y);
        
    }
}
