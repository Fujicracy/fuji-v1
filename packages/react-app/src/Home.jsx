import React, { useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import "./Home.css";

function Home({ address, loadWeb3Modal }) {

  return (
    <div>
      <div className="home-container">
        <div className="home-content">
          <div className="home-cta">
            <a href="about" className="second-action">Learn</a>
            <a href="dashboard" className="main-action">App</a>
          </div>
        </div>
      </div>

      <div className="home-footer">
        <nav>
          <ul>
            <li>
              <a href="https://twitter.com/FujiFinance" target="_blank">
                <img src="https://assets.codepen.io/194136/Twitter.svg" />
              </a>
            </li>

            <li>
              ·
            </li>

            <li>
              <a href="https://t.me/joinchat/U4cKWMsxuUG0JOGV" target="_blank">
                <img src="https://assets.codepen.io/194136/Telegram.svg" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
   );
}

export default Home;