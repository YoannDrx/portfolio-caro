import React from "react";
import Div from "./Div";
import Spacing from "./Spacing";

const ImageAndTextLeft = ({ title, imagePath, altText, children }) => {
  return (
    <Div className="container">
      <Div className="">
        <h2 className="text-center" style={{ color: "#ff4b17", marginBlock: "50px", marginTop: "50px" }}>
          {title}
        </h2>
        <Div className="image-container-right">
          {imagePath ? <img src={imagePath} alt={altText} className="cs-radius_15 w-100" /> : null}
        </Div>
        <Div className="cs-post cs-style2">{children}</Div>
      </Div>
      <Spacing lg="50" md="20" />
    </Div>
  );
};

export default ImageAndTextLeft;
