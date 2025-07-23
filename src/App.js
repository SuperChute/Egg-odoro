import React, { useState, useEffect } from "react";
import Timer from './components/Timer';  
import Egg from './components/Egg';  

function App() { 
  // Load from localStorage or use default
  const [eggState, setEggState] = useState(() => localStorage.getItem("eggState") || "unhatched");
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    const saved = localStorage.getItem("pomodoroCount");
    return saved ? Number(saved) : 0;
  });

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("eggState", eggState);
  }, [eggState]); 

  useEffect(() => {
    localStorage.setItem("pomodoroCount", pomodoroCount);
  }, [pomodoroCount]);

  return (
    <>
    <div> 
      Egg-odoro
    </div>
    <div className='app-divider'> 
      <section className='timer-section'> 
        <Timer 
          setPomodoroCount={setPomodoroCount} 
        />
      </section>
      <section className='egg-section'> 
        <Egg 
          eggState={eggState}
          setEggState={setEggState}
          pomodoroCount={pomodoroCount}
          setPomodoroCount={setPomodoroCount}
        />
      </section>
    </div>
    </>
  );
}

export default App;
