import React from 'react'

interface PreGameProps {
    setPreGameOver: (value: boolean) => void;
    gameLength: number;
    setGameLength: (value: number) => void;
    needBot: boolean;
    setNeedBot: (value: boolean) => void;
    botDifficulty: number;
    setBotDifficulty: (value: number) => void;
    botSign : "X" | "O",
    setBotSign : (value : "X" | "O") => void
}

export const PreGame:React.FC<PreGameProps> = ({setPreGameOver , gameLength, setGameLength, needBot, setNeedBot, botDifficulty, setBotDifficulty , botSign, setBotSign}) => {
  return (
    <div className='w-full h-screen text-center justify-center items-center border flex flex-col gap-8'>
        <h1 className='text-4xl'>
            Nouvelle partie:
        </h1>
        <div className='flex flex-col gap-3'>
            <label className='text-xl'>Taille de la grille ? </label>
            <input type='number' value={gameLength} onChange={(e) => setGameLength(+(e.target.value))}  className='bg-black border border-blue-500 p-4 rounded-xl text-center' min={"3"}/>
            <p className='text-red-800'>{gameLength < 3 && "Taille minimum de la grille = 3"}</p>
        </div>
        <div className='flex flex-col gap-3'>
            <label className='text-xl'>Adversaire :</label>
            <div className='flex gap-5'>
            <button className={'text-black rounded-xl p-4 '+( needBot ? 'bg-blue-500' : "bg-white" )} onClick={() => setNeedBot(true)}>Robot</button>
            <button className={'text-black rounded-xl p-4 '+( !needBot ? 'bg-blue-500' : "bg-white" )} onClick={() => setNeedBot(false)}>Joueur</button>
            </div>
        </div>
        {needBot &&(
            <>
            
            <div className='flex flex-col gap-3'>
                <label className='text-xl'>Difficulté du robot ? (0 à 12)</label>
                <input type='number' value={botDifficulty} onChange={(e) => setBotDifficulty(+(e.target.value))}  className='bg-black border border-blue-500 p-4 rounded-xl text-center' min={"0"} max={12}/>
                <p className='text-red-800'>{(botDifficulty < 0 || botDifficulty > 12 ) && "Difficulter entre 0 et 12"}</p>
            </div>
            <div className='flex flex-col gap-3'>
                <label className='text-xl'>Le robot joue :</label>
                <div className='flex gap-5'>
                <button className={'text-black rounded-full w-16 h-16 p-4 '+( botSign == "X" ? 'bg-blue-500' : "bg-white" )} onClick={() => setBotSign("X")}>X</button>
                <button className={'text-black rounded-full  w-16 h-16 p-4 '+( botSign != "X" ? 'bg-blue-500' : "bg-white" )} onClick={() => setBotSign("O")}>O</button>
                </div>
            </div>
            </>
        )}
        <div>
            <button className='text-3xl bg-red-800 p-4 rounded-xl' onClick={() => setPreGameOver(true)}>JOUER !</button>
        </div>

    </div>
  )
}
