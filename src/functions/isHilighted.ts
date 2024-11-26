import { gameArrayType, winingObjType } from "../types";

const isHilighted = (gameArray: gameArrayType  , winingObj : winingObjType , position : {col : number, line : number}) => {
    if (!winingObj.win){
        return false;
    }
    const char = gameArray[position.col][position.line]
    if(char !== winingObj.winner){
        return false;
    }
    if (winingObj.col === position.col || winingObj.line === position.line){
        return true; // Fait partie de la ligne ou de la collone gagnante
    }
    if (winingObj.diag && position.col === position.line){
        return true; // Fait partie de la diag 
    }
    if (winingObj.oppositDiag && (position.col + position.line === (gameArray.length - 1))){
        return true; // Fait partie de la diag opposée
    }
    return false;
}

export default isHilighted;