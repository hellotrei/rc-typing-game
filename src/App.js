import React, { useState, useRef, useEffect } from "react";
import { quotesArray, quotesArray2, allowedKeys } from "./Helper";
import "./App.css";

let interval = null;

const App = () => {
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [lang, setLang] = useState("eng");
  const [duration, setDuration] = useState(60);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [index, setIndex] = useState(0);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState(0);
  const [quote, setQuote] = useState({});
  const [input, setInput] = useState("");
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isError, setIsError] = useState(false);
  const [lastScore, setLastScore] = useState("0");

  const changeWords = () => {
    const newQuotes = [];
    for (let i = 0; i < 50; i++) {
      if (lang === "eng") {
        newQuotes.push(
          quotesArray[Math.floor(Math.random() * (2999 - 0 + 1) + 1)]
        );
      } else {
        newQuotes.push(
          quotesArray2[Math.floor(Math.random() * (2999 - 0 + 1) + 1)]
        );
      }
    }
    setQuote(newQuotes.join(" "));
    setInput(newQuotes.join(" "));
  };

  useEffect(() => {
    changeWords();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = () => {
    setEnded(true);
    setStarted(false);
    clearInterval(interval);
  };

  const setTimer = () => {
    const now = Date.now();
    const seconds = now + duration * 1000;
    interval = setInterval(() => {
      const secondLeft = Math.round((seconds - Date.now()) / 1000);
      setDuration(secondLeft);
      if (secondLeft === 0) {
        handleEnd();
      }
    }, 1000);
  };

  const handleStart = () => {
    setStarted(true);
    setEnded(false);
    setInput(quote);
    inputRef.current.focus();
    setTimer();
  };

  const handleKeyDown = (e) => {
    e.preventDefault();
    const { key } = e;
    const quoteText = quote;
    if (key === quoteText.charAt(index)) {
      setIndex(index + 1);
      const currenChar = quoteText.substring(
        index + 1,
        index + quoteText.length
      );
      setInput(currenChar);
      setCorrectIndex(correctIndex + 1);
      setIsError(false);
      outputRef.current.innerHTML += key;
    } else {
      if (allowedKeys.includes(key)) {
        setErrorIndex(errorIndex + 1);
        setIsError(true);
        outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`;
      }
    }
    const timeRemains = ((60 - duration) / 60).toFixed(2);
    const _accuracy = Math.floor(((index - errorIndex) / index) * 100);
    const _wpm = Math.round(correctIndex / 5 / timeRemains);

    if (index > 5) {
      setAccuracy(_accuracy);
      setCpm(correctIndex);
      setWpm(_wpm);
    }

    if (index + 1 === quoteText.length || errorIndex > 50) {
      handleEnd();
    }
  };

  const handleTab = (e) => {
    if (e.key === "Tab") {
      window.location.reload();
    }
  };

  const handleClickLang = () => {
    if (lang === "eng") {
      setLang("idn");
      changeWords();
    } else {
      setLang("eng");
      changeWords();
    }
  };

  useEffect(() => {
    if (ended) localStorage.setItem("wpm", wpm);
  }, [ended, wpm]);
  useEffect(() => {
    const stroedScore = localStorage.getItem("wpm");
    if (stroedScore) setLastScore(stroedScore);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left */}
        <div className="col-sm-6 col-md-2 order-md-0 px-5">
          <div className="list-item my-1 text-center">
            <h6 className="text-grey">WPM</h6>
            <h1 className="text-green">{wpm}</h1>
          </div>
          <div className="list-item my-1 text-center">
            <h6 className="text-grey">TIMERS</h6>
            <h1 className="text-green">{duration}</h1>
          </div>
        </div>
        {/* Body */}
        <div className="col-sm-12 col-md-8 order-md-1">
          <div className="container">
            <div className="text-center mt-4 header">
              <div className="control my-5">
                {ended ? (
                  <button
                    className="btn btn-outline-danger btn-circle"
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </button>
                ) : started ? (
                  <button
                    className="btn btn-outline-danger btn-circle"
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </button>
                ) : (
                  <button
                    className="btn btn-circle btn-outline-success"
                    onClick={handleStart}
                  >
                    GO!
                  </button>
                )}
                <span className="btn-circle-animation" />
              </div>
            </div>
            {ended ? (
              <div className="text-grey mono p-4 mt-5 lead rounded">
                <span>"{quote}"</span>
              </div>
            ) : started ? (
              <div
                className={`text-grey mono quotes${started ? " active" : ""}${
                  isError ? " is-error" : ""
                }`}
                tabIndex="0"
                onKeyDown={handleTab}
                onKeyPress={handleKeyDown}
                ref={inputRef}
              >
                {input}
              </div>
            ) : (
              <div
                className="mono quotes text-muted"
                tabIndex="-1"
                ref={inputRef}
              >
                {input}
              </div>
            )}

            <div
              className="p-4 mt-4 text-grey mono rounded lead"
              ref={outputRef}
            />
            <hr className="my-4" />
          </div>
        </div>

        <div className="col-sm-6 col-md-2 order-md-2 px-5">
          <div className="list-item my-1 text-center">
            <h6 className="text-grey">ACCURACY</h6>
            <h1 className="text-green">{accuracy}%</h1>
          </div>
          <div className="list-item my-1 text-center">
            <h6 className="text-grey">ERRORS</h6>
            <h1 className="text-red">{errorIndex}</h1>
          </div>
        </div>
      </div>
      <footer className="small text-muted pt-5 pb-2 footer">
        <div className="footer-info text-center">
          <div className="copyright">
            © 2021. Designed and built with
            <span role="img" aria-label="Heart">
              {" "}
              ❤️{" "}
            </span>
            by{" "}
            <a href="https://trei.me/" title="Trei">
              Trei
            </a>
          </div>
          {/* <button className="mt-4" onClick={handleClickLang}>
            {lang}
          </button> */}
        </div>
      </footer>
    </div>
  );
};

export default App;
