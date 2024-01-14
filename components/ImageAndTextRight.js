import React from "react";
import Div from "./Div";
import Spacing from "./Spacing";

const ImageAndTextRight = ({ title, imagePath, altText, children, link }) => {
  // Fonction de rendu pour l'image avec ou sans lien
  const renderImage = () => {
    // Si un lien est fourni, utilisez le tag <a>
    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <img src={imagePath} alt={altText} className="cs-radius_15 w-100" />
          <Div className="overlay">
            <span>Voir le site →</span>
          </Div>
        </a>
      );
    }

    // Sinon, retournez simplement l'image
    return <img src={imagePath} alt={altText} className="cs-radius_15 w-100" />;
  };

  return (
    <Div className="container">
      <h2 className="text-center" style={{ color: "#ff4b17", marginBlock: "50px", marginTop: "50px" }}>
        <Spacing lg="45" md="30" />
        {title}
      </h2>
      <Div className="image-container">
        {imagePath && <Div className={`image-wrapper ${link ? "clickable" : ""}`}>{renderImage()}</Div>}
      </Div>
      <Div className="cs-post cs-style2">{children}</Div>
    </Div>
  );
};

export default ImageAndTextRight;
