import React from "react";
import Div from "./Div";

const ImageAndTextLeft = ({ title, imagePath, altText, children }) => {
  return (
    <Div className="container">
      <Div className="">
        <h2 className="text-center" style={{ color: "#ff4b17", marginBlock: "50px", marginTop: "50px" }}>
          {title}
        </h2>
        <Div className="image-container-right">
          <img src={imagePath} alt={altText} className="cs-radius-15" />
        </Div>
        <Div>{children}</Div>
      </Div>
    </Div>
  );
};

export default ImageAndTextLeft;
