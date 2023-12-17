import React from "react";
import Link from "next/link";

const ComposerCard = ({ composer }) => {
  // Récupérer tous les liens disponibles
  const links = Object.entries(composer.links || {});

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      <img
        src={composer.compoImg}
        alt={composer.name}
        style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
      />
      <div>
        <div>{composer.name}</div>
        {links.length > 0 && <span> (</span>}
        {links.map(([key, value], index) => (
          <span key={key}>
            {index > 0 && ", "}
            <Link href={value} style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer" className="link">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Link>
          </span>
        ))}
        {links.length > 0 && <span>)</span>}
      </div>
    </div>
  );
};

export default ComposerCard;
