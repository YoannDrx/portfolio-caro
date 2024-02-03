import React from "react";
import parse from "html-react-parser";
import Button from "../Button";
import Spacing from "../Spacing";
import Div from "../Div";

export default function SectionHeading({ title, subtitle, btnLink, btnText, variant, children, intro }) {
  return (
    <Div className={variant ? `cs-section_heading ${variant}` : `cs-section_heading cs-style1`}>
      {subtitle ? <h3 className="cs-section_subtitle">{subtitle}</h3> : null}
      <h2 className="cs-section_title">{title}</h2>
      {intro && (
        <Div className="cs-section_intro" style={{ marginTop: "40px" }}>
          {intro}
        </Div>
      )}
      {children}
      {btnText && (
        <>
          <Spacing lg="45" md="20" />
          <Button btnLink={btnLink} btnText={btnText} />
        </>
      )}
    </Div>
  );
}
