import React from "react";
import Image from "next/image";
import Link from "next/link";

const ClickableImageGrid = ({ labels }) => {
  return (
    <div className={"container grid"}>
      {labels.map((label, index) => (
        <Link key={index} href={label.href} className={"imageLink"} passHref>
          <div className={"imageWrapper"}>
            <Image src={label.src} alt={label.name} width={0} height={0} sizes="100vw" className="labelImage" />
            <div className={"overlay"}>See more</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ClickableImageGrid;
