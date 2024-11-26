import { gameArrayType, winingObjType } from "../types";

const CheckWin = (gameArray : gameArrayType , search : "X" |"O") => {
    // Pour gagner, ligne / collonne / diagonale
    const gameLength = gameArray.length
    const colOccurence = Array(gameArray.length).fill(0)
    const lineOccurence = Array(gameArray.length).fill(0)
    let diagCount = 0;
    let oppositDiagCount = 0;
    let winnable = false; // Pour voir si on peut encore jouer
    gameArray.forEach((lineArray, colI) => {
        lineArray.forEach((value, lineI) => {
            if (value == search){
                colOccurence[colI]++;
                lineOccurence[lineI]++;
                if (colI === lineI){
                    diagCount++;
                }
                if (lineI + colI === (gameLength-1)){
                    oppositDiagCount++;
                }
            }
            if (value === ""){
                winnable = true;
            }
        }
            
    )})
    const winingObj : winingObjType = {
        winner : search,
        win : false,
        col: -1,
        line : -1,
        diag : false,
        oppositDiag : false
    };
    colOccurence.forEach((value, index) => {
        if (value === gameLength){
            winingObj.col = index
            winingObj.win = true
            return
        }
    })
    lineOccurence.forEach((value, index) => {
        if (value === gameLength){
            winingObj.line = index;
            winingObj.win = true
            return
        }
    })
    if (diagCount === gameLength){
        winingObj.diag = true;
        winingObj.win = true

    }
    if (oppositDiagCount === gameLength){
        winingObj.oppositDiag = true;
        winingObj.win = true

    }
    if (winingObj.win === false && winnable === false){// Personne ne gagne sur ce coup et plus aucun coups possibles
        winingObj.win = true;
        winingObj.winner = "";
    }
    return winingObj;
}

export default CheckWin;