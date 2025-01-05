import { gameArrayType } from "../types"
import CheckWin from "./checkWin";

interface ScanPossibilitiesArgs {
    botDifficulty: number;
    newArray: gameArrayType;
    botSign: "X" | "O";
    sign: "X" | "O";
    functionCount?: number;
    bestMovesHistoric?: Array<{ col: number; line: number }>;
    intialMove?: { col: number; line: number } | null;
}


type branchMemoryType = {
    [depth:number] : number
}
export default function branchAnalysis(
    
    branchDepth: number,
    gameState : gameArrayType,
    botDifficulty : number,
    sign :"X" | "O",
    move : { col: number; line: number },
    branchMemory : branchMemoryType,
    
){

    const newGameState = [...gameState.map((row) => [...row])];
    newGameState[move.col][move.line] = sign;
    // console.log({move,newGameState});
    
    const checkWin = CheckWin(newGameState,sign);
    const branchMemoryClone = {...branchMemory};
    if (!branchMemoryClone[branchDepth]){
        branchMemoryClone[branchDepth] = 0
    }
    if (checkWin.win){
        // console.log("Gagnant !");
        
        // console.log(checkWin)
        if (checkWin.winner !== ""){
            // Les branches impaire sont des défaite, et paire sont des victoire
            branchMemoryClone[branchDepth] += 1
          
        }
    }
    else{
        // Pas de gagnant ni de nule
        if (branchDepth+1 > botDifficulty){
            //
            return branchMemoryClone;
        }
        const allPossibilities = getAllPossibilities(newGameState);
        allPossibilities.forEach((value) => {
            const subBranchMemory = branchAnalysis(branchDepth + 1 ,newGameState,botDifficulty, (sign === "X" ? "O" : "X"),value,branchMemoryClone);
            // console.log({value , subBranchMemory , branchDepth})
            Object.keys(subBranchMemory).forEach((key) => {
                const depthKey = parseInt(key , 10);
                if (!branchMemoryClone[depthKey]) {
                    branchMemoryClone[depthKey] = 0;
                }
                branchMemoryClone[depthKey] += subBranchMemory[depthKey];
            })
        })
    }
    return branchMemoryClone;


}


export function scanPossibilities_v2(
    botDifficulty : number,
    newArray : gameArrayType,
    sign :"X" | "O",
    
){
    console.log("difficulty : "+botDifficulty)
    const allPossibilities = getAllPossibilities(newArray);
    const results : Array<{move : {col:number,line:number},checkBranch : branchMemoryType}> = [];
    const bestMoves : Array<{col:number, line:number}> = [];
    allPossibilities.forEach((value) => {
        const checkBranch = branchAnalysis(0,newArray,botDifficulty, sign,value,{});
        console.log("CheckBranch n°" + value.col + "," + value.line)
        console.log(checkBranch);
        results.push({move : value , checkBranch })
    })

    let exitFor = false;
    for (let i = 0; i <= botDifficulty; i++){
        results.forEach(obj => {
            
            if (obj.checkBranch[i]> 0){
                console.log(obj.checkBranch[i]);
                exitFor = true
            }
        });
        if (exitFor){
            
            console.log("------------------------------------------------------------------------------");
            console.log("Tris sur la profondeur : " + (i));
            const sortedRes = [...results].sort((a, b) => {
                const aValue = a.checkBranch[i] || 0;
                const bValue = b.checkBranch[i] || 0;
                if(i%2 === 0){
                    // On cherche les plus grand
                    return bValue - aValue;
                }
                // Sinon on cherche le plus petit
                return aValue - bValue
            });
            console.log(sortedRes)
            let index = 0
            while (index < sortedRes.length && sortedRes[index].checkBranch[i] === sortedRes[0].checkBranch[i]){
                bestMoves.push(sortedRes[index].move)
                index++
            }
            return bestMoves
        }
    }
    return bestMoves


}

export function getAllPossibilities(gameArray:gameArrayType ){
    const possibilities : Array<{col:number, line: number}> = [];
    gameArray.forEach((lineArray, colI) => {
        lineArray.forEach((value,lineI) => {
            if (value === ""){
                possibilities.push({col : colI , line : lineI})
            }
        })
    })
    return possibilities;
}

export function choseRandomPossibility(possibilities : Array<{col:number, line: number} | null>){
    if (possibilities.length === 0){
        return null;
    }
    const index = Math.floor(Math.random() * possibilities.length) // Entre 0 et length-1
    return possibilities[index]
}