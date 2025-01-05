import { useState } from 'react'
import { Game } from './components/Game'
import { PreGame } from './components/PreGame';

function App() {
  const [preGameOver, setPreGameOver] = useState(false);
  const [gameLength, setGameLength] = useState(3);
  const [needBot, setNeedBot] = useState(false);
  const [botDifficulty, setBotDifficutly] = useState(0)
  const [botSign, setBotSign] = useState<"X" | "O">("O");

  return (
    <div className='bg-black text-white w-full' style={{height:"1200px"}}>
      {preGameOver ? (
        <>
          <button className='border border-white rounded-xl p-2 m-4' onClick={()=> setPreGameOver(false)}>Settings</button>
          <Game gameLength={gameLength} needBot={needBot} botDifficulty={botDifficulty} botSign={botSign} />
        </>

      ) : (
        <PreGame setPreGameOver={setPreGameOver} gameLength={gameLength} setGameLength={setGameLength} needBot={needBot} setNeedBot={setNeedBot} botDifficulty={botDifficulty} setBotDifficulty={setBotDifficutly} botSign={botSign} setBotSign={setBotSign} />

      )}

    </div>
  )
}

export default App
