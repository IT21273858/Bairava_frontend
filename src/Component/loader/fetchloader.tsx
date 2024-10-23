
import React from "react";
import { MoonLoader } from "react-spinners";

const FetchLoader = ({
  style,
  loadersize,
  text
}) => {
  const logo = "/logo.png";
  const Text = "Fetching datas... please hold";

  return (
    <div
      className= "w-full h-full flex flex-col justify-center items-center"
    >
      <img src={logo} className=" w-1/3 h-1/2 object-contain aspect-video" />
      <div className=" mt-3 flex gap-3 text-sm text-pageinverse items-center">
        <MoonLoader
          color="rgba(var(--pageinverse))"
          size={loadersize ? loadersize : 18}
        />
        {text}
      </div>
    </div>
  );
};

export default FetchLoader;
