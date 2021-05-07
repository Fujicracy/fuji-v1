import React from "react";
import { useSpring, animated, config } from 'react-spring'
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {

  const props = useSpring({
    from: { factor: 1, opacity: 0 },
    to: { factor: 150, opacity: 1 },
    config: { duration: 800, ...config.molasses},
  });

  return (
    <div>
      <animated.div style={props} className="home-container">
        <div className="home-content">
          <div className="home-cta">
            <a
              href="https://docs.fujidao.org/"
              className="second-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn
            </a>
            <Link to="/dashboard" className="main-action">App</Link>
          </div>
        </div>
      </animated.div>

      <div className="home-footer">
        <nav>
          <ul>
            <li>
              <a href="https://twitter.com/FujiFinance" target="_blank" rel="noopener noreferrer">
                <img className="footer-icon" alt="twitter" src="/twitter.svg" />
              </a>
            </li>

            <li>
              ·
            </li>

            <li>
              <a href="https://t.me/joinchat/U4cKWMsxuUG0JOGV" target="_blank" rel="noopener noreferrer">
                <img className="footer-icon" alt="telegram" src="/telegram.svg" />
              </a>
            </li>

            <li>
              ·
            </li>

            <li>
              <a href="https://discord.com/invite/dnvJeEMeDJ" target="_blank" rel="noopener noreferrer">
                <img className="footer-icon" alt="discord" src="/discord.svg" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
   );
}

export default Home;
