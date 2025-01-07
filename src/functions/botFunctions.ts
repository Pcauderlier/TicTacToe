import { branchMemoryType, gameArrayType, resultType } from "../types"
import CheckWin from "./checkWin";




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
    
    const checkWin = CheckWin(newGameState,sign);
    const branchMemoryClone = {...branchMemory};
    if (!branchMemoryClone[branchDepth]){
        branchMemoryClone[branchDepth] = 0
    }
    if (checkWin.win){
        // console.log("Gagnant !");
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
            const subBranchMemory = branchAnalysis(branchDepth + 1 ,newGameState,botDifficulty, (sign === "X" ? "O" : "X"),value,{});
            // console.log({value , subBranchMemory , branchDepth})
            Object.keys(subBranchMemory).forEach((key) => {
                const depthKey = parseInt(key , 10);
                if (!branchMemoryClone[depthKey]) {
                    branchMemoryClone[depthKey] = 0;
                }
                if (subBranchMemory[depthKey] !== 0){
                 
                    // branchMemoryClone[depthKey] = Math.max(
                    //     branchMemoryClone[depthKey] || 0,
                    //     subBranchMemory[depthKey]
                    // );
                    branchMemoryClone[depthKey] += subBranchMemory[depthKey]
                   
                }
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
    const results : resultType = [];
    let bestMoves : Array<{col:number, line:number}> = [];

    allPossibilities.forEach((value) => {
        const checkBranch = branchAnalysis(0,newArray,botDifficulty, sign,value,{});
        console.log("CheckBranch n°" + value.col + "," + value.line)
        console.log(checkBranch);
        results.push({move : value , checkBranch })
    })

    let goodMoves : resultType = results;
    for (let i = 0; i <= botDifficulty; i++){
        goodMoves = checkBestMoves(goodMoves,i)
        // results.forEach(obj => {
            
        //     if (obj.checkBranch[i]> 0){
        //         exitFor = true
        //     }
        // });
        // if (exitFor){
            
        //     console.log("------------------------------------------------------------------------------");
        //     console.log("Tris sur la profondeur : " + (i));
        //     const sortedRes = [...results].sort((a, b) => {
        //         const aValue = a.checkBranch[i] || 0;
        //         const bValue = b.checkBranch[i] || 0;
        //         if(i%2 === 0){
        //             // On cherche les plus grand
        //             return bValue - aValue;
        //         }
        //         // Sinon on cherche le plus petit
        //         return aValue - bValue
        //     });
        //     checkBestMoves(sortedRes)
        //     let index = 0
        //     while (index < sortedRes.length && sortedRes[index].checkBranch[i] === sortedRes[0].checkBranch[i]){
        //         bestMoves.push(sortedRes[index].move)
        //         index++
        //     }
        //     // console.log("Total des branche explorées : "  + brancheCOunter)
        //     return bestMoves
        // }
        
    }
    console.log(goodMoves)
    goodMoves.forEach(element => {
        bestMoves.push(element.move)
    });
    return bestMoves
}
function checkBestMoves(results : resultType , index : number){
    const sortedRes = [...results].sort((a, b) => {
        const aValue = a.checkBranch[index] || 0;
        const bValue = b.checkBranch[index] || 0;
        if(index%2 === 0){
            // On cherche les plus grand
            return bValue - aValue;
        }
        // Sinon on cherche le plus petit
        return aValue - bValue
    });
    let ii = 0
    const bestMoves = [];
    while (ii < sortedRes.length && sortedRes[ii].checkBranch[index] === sortedRes[0].checkBranch[index]){
        bestMoves.push(sortedRes[ii])
        ii++
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