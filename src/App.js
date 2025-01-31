import "./App.css";
import "./index.css";
import "./reports/instrument";
import log from "loglevel";
import UserPage from "./component/UserPage";
import {useEffect, useState} from "react";

function App() {

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();

      if (!window.Telegram.WebApp.isExpanded) {
        window.Telegram.WebApp.expand();
      }

      // Initialize Telegram Web App API
      setUser(tg.initData?.user || tg.initDataUnsafe?.user || null);
      setTheme(tg.colorScheme);

      // Cleanup
      return () => {
        tg.MainButton.offClick();
      };
    } else {
      log.warn("Telegram Web App running outside Telegram.");
    }
  }, []);

  return (
      <div className={`App ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
        <div>
          <h1>Telegram Web App</h1>
          {user ? (<p>
            Hello, {user.first_name} {user.last_name || ""}!
          </p>) : (<p>
            Running locally. Open this app inside Telegram for full
            functionality.
          </p>)}
        </div>
        <UserPage/>
      </div>);
}

export default App;
