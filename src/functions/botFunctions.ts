import { gameArrayType } from "../types"
import CheckWin from "./checkWin";

export function scanPossibilities(
    botDifficulty: number,
    newArray: gameArrayType,
    botSign: "X" | "O",
    sign: "X" | "O",
    functionCount = 1,
    bestMovesHistoric: Array<{ col: number; line: number }> = [],
    intialMove : {col : number, line : number} | null = null
): { score: number; moves?: Array<{ col: number; line: number }> }{
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