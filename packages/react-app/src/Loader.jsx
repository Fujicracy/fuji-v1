import React from "react";
import * as LottiePlayer from "@lottiefiles/lottie-player";

function Loader() {
  return (
    <lottie-player
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "56px",
        height: "auto",
      }}
      src="/loader.json"
      speed="1"
      loop
      autoplay
    ></lottie-player>
  )
}

export default Loader;
