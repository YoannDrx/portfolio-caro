import React from "react";
import Div from "./Div";
import Spacing from "./Spacing";

const ImageAndTextRight = ({ title, imagePath, altText, children, link }) => {
  return (
    <Div className="container">
      <Div className="">
        <h2 className="text-center" style={{ color: "#ff4b17", marginBlock: "50px", marginTop: "50px" }}>
          {title}
        </h2>
        <Div className="image-container">
          {imagePath && (
            <Div className="image-wrapper">
              <a href={link || "#"} target={link ? "_blank" : "_self"} rel="noopener noreferrer">
                <img src={imagePath} alt={altText} className="cs-radius_15 w-100" />
                {link && (
                  <Div className="overlay">
                    <span>Voir le site →</span>
                  </Div>
                )}
              </a>
            </Div>
          )}
        </Div>
        <Div className="cs-post cs-style2">{children}</Div>
      </Div>
      <Spacing lg="30" md="50" />
    </Div>
  );
};

export default ImageAndTextRight;
