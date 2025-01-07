import { useEffect, useState } from "react";
import CheckWin from "../functions/checkWin";
import { gameArrayType, winingObjType } from "../types";
import isHilighted from "../functions/isHilighted";
import branchAnalysis, { choseRandomPossibility, getAllPossibilities, scanPossibilities, scanPossibilities_v2} from "../functions/botFunctions";

interface GameProps {
    gameLength: number;
    needBot: boolean;
    botDifficulty: number;
    botSign : "X" | "O";
}

export const Game: React.FC<GameProps> = ({ gameLength, needBot, botDifficulty , botSign }) => {
    const [gameArray, setGameArray] = useState<gameArrayType>(Array(gameLength).fill(Array(gameLength).fill('')));
    const [playerSign, setPlayerSIgn] = useState<"X"|"O">(botSign === "O" ? "X" : "O" )
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
        if(botSign === "X" && needBot){
            botTurns(newArray);
        }
    }, [gameLength , refresh]);

    
    function nextTurn(){
        if (!needBot){
            setPlayerSIgn(playerSign === "O" ? "X" : "O")
        }
    }
    function handleMove(position : {col : number , line :number} , sign : "X"|"O" , newArray : false |gameArrayType = false ){
        
        const usedArray = newArray ? newArray : gameArray
        const array = usedArray.map((row) =>  [...row] );
        array[position.col][position.line] = sign;
        setGameArray(array);
        return array;
    }
    function handleCheckWin(newArray : gameArrayType , sign :"X"|"O"){
        const winingObjVar = CheckWin(newArray,sign);
        if (winingObjVar.win){
            setWiningObj({...winingObjVar})
            return;
        }
        if (needBot && playerSign === sign){
            botTurns(newArray)
            return;
        }
        nextTurn();
    }
    function handleCLick(col : number, line : number){
        const value = gameArray[col][line];
        if( value != "" || winingObj.win){
            return;
        }
        const newArray = handleMove({col , line}, playerSign)
        handleCheckWin(newArray , playerSign);
        
    }
    const botTurns = (newArray : gameArrayType) => {
        let possibilities = getAllPossibilities(newArray)
        if (botDifficulty !== 0){
            const scan = scanPossibilities_v2(botDifficulty,newArray,botSign,botSign);
            possibilities = scan.length > 0 ? scan : possibilities
        }
        const chosenPlay : {col:number , line:number} | null = possibilities.length === 1 ? possibilities[0] : choseRandomPossibility(possibilities);
        if (chosenPlay === null){
            setWiningObj( {...winingObj , win : true, winner : "" });
            return;
        }
        const array = handleMove(chosenPlay, botSign , newArray);
        handleCheckWin(array , botSign)
        
    }
   


    return (
        <div className=" text-white w-full flex flex-col gap-6  my-20">
            <div className="h-30">
                <div className="flex">C'est à {playerSign} de jouer</div>
                {winingObj.win && (
                    <h1 className={"text-4xl text-center underline font-bold " + (winingObj.winner==="" ? "text-red-800" : "text-green-500")}>{winingObj.winner === "" ? "Personne n'à gagnés :(" : winingObj.winner + " a gagnés la partie !"}</h1>
                )}
            </div>
            <div
                className="flex flex-col self-center"
                style={{
                    height: "500px", 
                    width: "500px",  
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
