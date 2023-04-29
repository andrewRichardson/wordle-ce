import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');

  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;
  const BLANK_ROWS = MAX_GUESSES - 1 - guesses.length;
  const BLANK_GUESS_SPACES = WORD_LENGTH - 1 - currentGuess.length;

  const BLANK_GUESS_SPACES_PLACEHOLDER = BLANK_GUESS_SPACES > 0 ? new Array(BLANK_GUESS_SPACES).fill('') : [];
  const BLANK_ROWS_PLACEHOLDER = BLANK_ROWS > 0 ? new Array(BLANK_ROWS).fill('') : [];
  const BLANK_WORD_SPACES_PLACEHOLDER = new Array(WORD_LENGTH).fill('');

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      setCurrentGuess(currentGuess.substring(0, currentGuess.length - 1));
    } else if (/[a-z]/i.test(e.key.toLowerCase())) {
      if (BLANK_GUESS_SPACES > 0) setCurrentGuess(currentGuess + e.key.toUpperCase());
      else {
        setGuesses([...guesses, currentGuess + e.key.toUpperCase()]);
        setCurrentGuess('');
      }
    }
  };

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center text-white bg-coolGray-800 text-3xl">
        <h1 className="mb-5 font-bold">WORDLE</h1>
        <table>
          <tbody>
            {guesses.map((guess) => (
              <tr key={uuidv4()}>
                {guess.split('').map((letter) => (
                  <td key={uuidv4()}>[{letter}]</td>
                ))}
              </tr>
            ))}
            {guesses.length < MAX_GUESSES && (
              <tr>
                {currentGuess.split('').map((letter) => (
                  <td key={uuidv4()}>[{letter}]</td>
                ))}
                <td>
                  [
                  <input
                    tabIndex={0}
                    className="w-1 bg-none"
                    name="word-input"
                    id="word-input"
                    type="text"
                    onKeyDown={handleInput}
                  />
                  ]
                </td>
                {BLANK_GUESS_SPACES_PLACEHOLDER.map(() => (
                  <td key={uuidv4()}>[ ]</td>
                ))}
              </tr>
            )}
            {BLANK_ROWS_PLACEHOLDER.map(() => (
              <tr key={uuidv4()}>
                {BLANK_WORD_SPACES_PLACEHOLDER.map(() => (
                  <td key={uuidv4()}>[ ]</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
};

export default App;
