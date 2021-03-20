import React from "react";
import "./ProtocolStats.css";

function ProtocolStats() {

  return (
    <div className="protocol-stats">
      <div className="dark-block">
        <span className="title">Fuji total borrows:</span>
        <span className="number">$ 1 239 223</span>
      </div>

      <div className="dark-block">
        <span className="title">Fuji all positions:</span>
        <span className="number">$ 1 239 223</span>
      </div>
    </div>
  );
}

export default ProtocolStats;
