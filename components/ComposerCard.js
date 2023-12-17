import React from "react";
import Link from "next/link";

const ComposerCard = ({ composer }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      <img
        src={composer.compoImg}
        alt={composer.name}
        style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
      />
      <Link href={composer.externalLink} style={{ textDecoration: "none", color: "lightgoldenrodyellow" }}>
        {composer.name}
      </Link>
    </div>
  );
};

export default ComposerCard;
