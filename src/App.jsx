import { useEffect, useState, useCallback } from 'react';
import { wordsList } from "./data/words";
import StartScreen from './components/StartScreen/StartScreen';
import Game from './components/game/Game';
import GameOver from './components/game/GameOver';
import "./App.css"

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWorld, setPickedWorld] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]); 
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickedWorldAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    return { category, word };
  }, [words]);

  const startGame = useCallback(() => {
    const { word, category } = pickedWorldAndCategory();
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWorld(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setGuesses(3); // Reset guesses
    setGameStage(stages[1].name);
  }, [pickedWorldAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (guessedLetters.includes(normalizedLetter) || 
        wrongLetters.includes(normalizedLetter)) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  useEffect(() => {
    if (guesses === 0) {
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore + 100);
      startGame();
    }
  }, [guessedLetters, letters, startGame]);


  return (
    <>
      <div className='App'>
        {gameStage === "start" && <StartScreen startGame={startGame} />}
        {gameStage === "game" && <Game verifyLetter={verifyLetter}
                                        pickedWorld={pickedWorld}
                                        pickedCategory={pickedCategory}
                                        letters={letters}
                                        guessedLetters={guessedLetters}
                                        wrongLetters={wrongLetters}
                                        guesses={guesses}
                                        score={score} />}
        {gameStage === "end" && <GameOver retry={retry} score={score} />}
      </div>
    </>
  );
}

export default App;
