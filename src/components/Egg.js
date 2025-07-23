import React, { useState, useEffect, useRef } from "react";

function Egg({ eggState, setEggState, pomodoroCount, setPomodoroCount }) {
  const allPets = ["chick", "blob", "dino", "bear", "cat", "dragon"];

  const [collectedPets, setCollectedPets] = useState(() => {
    const saved = localStorage.getItem("collectedPets");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPet, setCurrentPet] = useState(() => {
    const saved = localStorage.getItem("currentPet");
    return saved || null;
  });

  const [showTrophy, setShowTrophy] = useState(false);
  const trophySound = useRef(new Audio("/sounds/trophy.mp3"));

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("collectedPets", JSON.stringify(collectedPets));
  }, [collectedPets]);

  useEffect(() => {
    localStorage.setItem("currentPet", currentPet ?? "");
  }, [currentPet]);

  // Play trophy sound once
  useEffect(() => {
    if (showTrophy) {
      trophySound.current.play().catch(err => {
        console.warn("Trophy sound failed:", err);
      });
    }
  }, [showTrophy]);

  function getRandomPet() {
    const remaining = allPets.filter(p => !collectedPets.includes(p));
    if (remaining.length === 0) return;

    const newPet = remaining[Math.floor(Math.random() * remaining.length)];

    setCollectedPets(prev => {
      const updated = [...prev, newPet];
      if (updated.length === allPets.length) {
        setTimeout(() => setShowTrophy(true), 5000);
      }
      return updated;
    });

    setCurrentPet(newPet);
  }

  useEffect(() => {
    switch (pomodoroCount) {
      case 2:
        setEggState("cracked");
        break;
      case 4:
        setEggState("hatched");
        if (!currentPet && collectedPets.length < allPets.length) {
          getRandomPet();
        }
        break;
      default:
        break;
    }
  }, [pomodoroCount, setEggState]);

  const getPetImage = () => {
    switch (eggState) {
      case "unhatched":
        return "/assets/egg-unhatched.png";
      case "cracked":
        return "/assets/egg-cracked.png";
      case "hatched":
        return currentPet ? `/assets/${currentPet}.png` : "/assets/egg-unhatched.png";
      default:
        return "/assets/egg-unhatched.png";
    }
  };

  const resetEgg = () => {
    setEggState("unhatched");
    setPomodoroCount(0);
    setCurrentPet(null);
    setShowTrophy(false);
  };

  const fullReset = () => {
    setCollectedPets([]);
    setCurrentPet(null);
    setEggState("unhatched");
    setPomodoroCount(0);
    setShowTrophy(false);
    localStorage.removeItem("collectedPets");
    localStorage.removeItem("currentPet");
  };

  return (
    <>
      {showTrophy ? (
        <div className="egg-container">
          <p>Congratulations! You collected all pets!</p>
          <section className="collected-pets">
            <div className="pet-icons">
              {collectedPets.map((pet, index) => (
                <img
                  key={index}
                  src={`/assets/${pet}.png`}
                  alt={pet}
                  className="pet-icon"
                />
              ))}
            </div>
          </section>
          <img src="/assets/trophy.png" alt="Trophy" />
          <button onClick={fullReset}>Reset All</button>
        </div>
      ) : (
        <div className="egg-container">
          <section className="collected-pets">
            Collected Pets:
            <div className="pet-icons">
              {collectedPets.length > 0 ? (
                collectedPets.map((pet, index) => (
                  <img
                    key={index}
                    src={`/assets/${pet}.png`}
                    alt={pet}
                    className="pet-icon"
                  />
                ))
              ) : (
                <span>None</span>
              )}
            </div>
          </section>
          <img src={getPetImage()} alt="pet" />
          <button onClick={resetEgg}>Reset Egg</button>
        </div>
      )}
    </>
  );
}

export default Egg;
