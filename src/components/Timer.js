import { useState, useEffect } from "react";

function Timer ({ setPomodoroCount }) { 
	const [timer, setTimer] = useState(1500); // The Timer, 1500s = 25 minutes
  const [isRunning, setIsRunning] = useState(false); // Check if running, if so, changes the "start" button to "stop" 
  const [timerState, setTimerState] = useState("pomodoro"); // State to track the type of timer (pomodoro, short break, long break) 
  
  const timeUpSound = new Audio("/sounds/timeup.mp3")

  // Functions to start, stop, and reset the timer
  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimer(1500);
    setTimerState("pomodoro");
  };
  const shortBreak = () => {
    setIsRunning(false);  
    setTimerState("short break");
    setTimer(300);
  }

  const longBreak = () =>{ 
    setIsRunning(false);
    setTimerState("long break");
    setTimer(600);
  } 

  const pomodoro = () => {
    setIsRunning(false);
    setTimerState("pomodoro");
    setTimer(1500);
  }
  const switchButton =() => {
    if (isRunning) {  
      return <button onClick={stopTimer}>Stop</button>;
    } 
    return <button onClick={startTimer}>Start</button>;
  }

  // Function to format the time in MM:SS
  function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } 
  
  // Effect to handle the timer countdown
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 0) {
            if (timerState === "pomodoro") {
              setPomodoroCount(prev => prev + 1);
            }
            // Stop timer for all modes
            timeUpSound.play();
            setTimerState("rest"); // Reset to pomodoro after any break
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, setPomodoroCount, timerState]); 

  useEffect(() => {
  document.title = `${formatTime(timer)} | Egg-odoro`;
  }, [timer]);


  // Display the timer and buttons <button onClick={stopTimer}>Stop</button>
	return (
  <div className="timer-wrapper"> 
    <div className="timer-section">
      <div className="timer-container">   
        <div className="button-group"> 
          <button onClick={pomodoro}>Pomodoro</button>
          <button onClick={shortBreak}>Short Break</button>
          <button onClick={longBreak}>Long Break</button>
        </div>
        <div className="timer-display">
          {formatTime(timer)}
        </div>
        <div className="button-group"> 
          {switchButton()}
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
    </div>
  </div>
	);
}

export default Timer;