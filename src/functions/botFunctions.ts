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

interface ScanPossibilitiesArgs_v2 {
    botDifficulty: number;
    newArray: gameArrayType;
    botSign: "X" | "O";
    sign: "X" | "O";
    branchMemory? : {
        initialMove : { col: number; line: number },
        branchDepth : number,
        gameState : gameArrayType
    } | null;
    bestMovesHistoric?: { score : number , possibilities : Array<{ col: number; line: number }>};
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
    botSign : "X" | "O",
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



export function scanPossibilities({
    botDifficulty,
    newArray,
    botSign,
    sign,
    functionCount = 1,
    bestMovesHistoric = [],
    intialMove = null,
}: ScanPossibilitiesArgs): { score: number; moves?: Array<{ col: number; line: number }> }{
    const allPossibilities = getAllPossibilities(newArray);
    
    if (allPossibilities.length === 0){
        // Match null
        return {score : 10000};
    }
    let bestScore = 9999; // Plus le score est faible, moins il faut de coup pour obtenir la victoire
    let bestMoves:Array< { col: number; line: number }> = [...bestMovesHistoric];

    allPossibilities.forEach((value) => {
        const testArray = [...newArray.map((row) => [...row])];
        testArray[value.col][value.line] = sign;
        const winingObj = CheckWin(testArray,sign);
        if (winingObj.win){
            let score = 9999; // Score de match null
            if (winingObj.winner === botSign){
                // Le bot Gagne => Arreter la recursion
                score = functionCount;
            }
            else if (winingObj.winner !== ""){
                // Le joueur gagne, arreter la recursion
                if (functionCount === 2){
                    // Veut dire qu'au prochain coup, le joueurs gagne, hors on veut en priorité l'éviter
                    score = -1;
                }
            }
            if (score < bestScore) {
                bestScore = score;
                bestMoves = [{ col: value.col, line: value.line }];
            } else if (score === bestScore) {
                bestMoves.push({ col: value.col, line: value.line });
            }
        }
        else{
            if (functionCount <= botDifficulty){
                const nextSign = sign === "X" ? "O" : "X";
                const result = scanPossibilities(botDifficulty,testArray,botSign,nextSign,functionCount + 1 , bestMoves , intialMove ? intialMove : { col: value.col, line: value.line });
                bestMoves = result.moves ? result.moves : bestMoves
                const score = result.score;
                if (score < bestScore) {
                    bestScore = score;
                    bestMoves = [{ col: value.col, line: value.line }, ...(result.moves || [])];
                    // bestMoves = [{ col: value.col, line: value.line }, ...(result.moves || [])];
                } else if (result.score === bestScore) {
                    bestMoves.push(...(result.moves || []));
                }
                
            }
            else{
                // Aucun coup gagnant, on retient les coups avec le score 9999
                if (functionCount >= botDifficulty || intialMove === null) {
                    bestScore = 9999;
                    const saveMove = intialMove ? intialMove : { col: value.col, line: value.line }
                    bestMoves.push(saveMove)
                }
            }
            
        }
    })
    return {score : bestScore , moves : bestMoves}
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
        //Que faire ??
        return null;
    }
    const index = Math.floor(Math.random() * possibilities.length) // Entre 0 et length-1
    return possibilities[index]
}