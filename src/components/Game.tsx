import { useEffect, useState } from "react";
import CheckWin from "../functions/checkWin";
import { gameArrayType, winingObjType } from "../types";
import isHilighted from "../functions/isHilighted";
import {botTurns} from "../functions/botTurns";

interface GameProps {
    gameLength: number;
    needBot: boolean;
    botDifficulty: number;
    botSign : "X" | "O";
}

export const Game: React.FC<GameProps> = ({ gameLength, needBot, botDifficulty , botSign }) => {
    const [gameArray, setGameArray] = useState<gameArrayType>(Array(gameLength).fill(Array(gameLength).fill('')));
    const [isXturn, setIsXturn] = useState(true)
    const [refresh, setRefresh] = useState(1)
    const [winingObj, setWiningObj] = useState<winingObjType>({
        winner : "",
        win : false,
        col: -1,
        line : -1,
        diag : false,
        oppositDiag : false
    })

    useEffect(() => {
        const newArray = Array(gameLength).fill(Array(gameLength).fill(''));
        setGameArray(newArray);
        setWiningObj({
            winner : "",
            win : false,
            col: -1,
            line : -1,
            diag : false,
            oppositDiag : false
        })
        console.log(newArray);
    }, [gameLength , refresh]);
    function nextTurn(){
        setIsXturn(() => !isXturn)
    }
    function handleCLick(col : number, line : number){
        const value = gameArray[col][line];
        console.log({col,line})
        if( value != "" || winingObj.win){
            return;
        }
        const newArray = gameArray.map((row) =>  [...row] );
        newArray[col][line] = isXturn ? 'X' : 'O';
        setGameArray(newArray);
        const winingObjVar = CheckWin(newArray,isXturn);
        if (winingObjVar.win){
            setWiningObj({...winingObjVar})
            return;
        }
        if (!needBot){
            nextTurn();
            return;
        }
        botTurns(botDifficulty , gameArray , botSign )
    }



    return (
        <div className=" text-white w-full flex flex-col gap-6  my-20">
            <div className="h-30">
                <div className="flex">C'est à {isXturn ? "X" : "O"} de jouer</div>
                {winingObj.win && (
                    <h1 className={"text-4xl text-center underline font-bold " + (winingObj.winner==="" ? "text-red-800" : "text-green-500")}>{winingObj.winner === "" ? "Personne n'à gagnés :(" : winingObj.winner + " a gagnés la partie !"}</h1>
                )}
            </div>
            <div
                className="flex flex-col self-center"
                style={{
                height: "800px", 
                width: "800px",  
                }}
            >
                {gameArray.map((line:Array<string>, colI) => (
                <div key={`Col-${colI}`} className="p-0 m-0 flex" style={{height: `${1 / gameLength * 100}%`,}}>
                    {line.map((value : string, lineI: number) => (
                    <input
                        key={`Line-${colI}-${lineI}`}
                        className={
                            "border-4 text-center border-blue-500 flex justify-center items-center bg-black focus-visible:outline-none caret-transparent cursor-pointer " + 
                            (isHilighted(gameArray,winingObj,{col : colI, line : lineI}) ?
                                "text-6xl bold text-green-500" :
                                "text-4xl "
                        )}
                        
                        style={{
                        height: `100%`,
                        width: `${1 / gameLength * 100}%`,
                        }}
                        value={value}
                        onClick={() => handleCLick(colI, lineI)}
                    >
                    </input>
                    ))}
                </div>
                ))}
            </div>
            <div className="self-center">
                <button className="border border-white p-2 rounded-xl" onClick={() => setRefresh((refresh) => refresh+1)}>RESTART</button>
                <p>Tentantives : {refresh}</p>
            </div>
        </div>
    );
};
