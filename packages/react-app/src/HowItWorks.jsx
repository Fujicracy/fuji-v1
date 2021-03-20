import React from "react";
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <fieldset className="hiw">
      <legend className="hiw-title">
        <span className="hiw-title-content">
          <span className="icon">
            <InfoOutlinedIcon />
          </span>
          <Typography variant="h3">How it works</Typography>
        </span>
      </legend>

      <Typography variant="body2">
        Please enter the amount of <span className="bold">DAI</span> you'd like to borrow and the amount of
        <span className="bold"> ETH</span> to provide as collateral.
        The minimum required amout of collateral is suggested.
      </Typography>
    </fieldset>
  );
}

export default HowItWorks;
