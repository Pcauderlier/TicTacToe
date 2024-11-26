import { gameArrayType } from "../types"

export const botTurns = (botDifficulty : number , gameArray : gameArrayType , botSign:"X"|"O") => {
    let possibilities : Array<{col:number, line: number} | null> = [];
    if (botDifficulty === 0){
        possibilities = getAllPossibilities(gameArray)
    }
    else{
        possibilities = scanPossibilities();
    }
    const chosenPlay : {col:number , line:number} | null = possibilities.length === 1 ? possibilities[0] : choseRandomPossibility(possibilities)
}


function scanPossibilities(){

}

function getAllPossibilities(gameArray:gameArrayType ){
    const possibilities : Array<{col:number, line: number} | null> = [];
    gameArray.forEach((lineArray, colI) => {
        lineArray.forEach((value,lineI) => {
            if (value === ""){
                possibilities.push({col : colI , line : lineI})
            }
        })
    })
    return possibilities;
}

function choseRandomPossibility(possibilities : Array<{col:number, line: number} | null>){
    if (possibilities.length === 0){
        //Que faire ??
        return null;
    }
    const index = Math.floor(Math.random() * possibilities.length) // Entre 0 et length-1
    return possibilities[index]
}