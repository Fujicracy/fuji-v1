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
        With Fuji you reduce your loan expenses by <span className="bold">~10%</span>.<br/>
        The protocol constantly <span className="bold">monitors</span> borrow markets
        and automatically <span className="bold">refinances</span> its debt positions at the best available rates.
      </Typography>
    </fieldset>
  );
}

export default HowItWorks;
