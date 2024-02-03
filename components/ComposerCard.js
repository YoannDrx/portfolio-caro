import React from "react";
import Link from "next/link";

const ComposerCard = ({ composer }) => {
  const link = composer.links;

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      <img
        src={composer.compoImg}
        alt={composer.name}
        style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
      />
      <div>
        {link ? (
          <Link href={link} passHref style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
            {composer.name}
          </Link>
        ) : (
          <div>{composer.name}</div>
        )}
      </div>
    </div>
  );
};

export default ComposerCard;
