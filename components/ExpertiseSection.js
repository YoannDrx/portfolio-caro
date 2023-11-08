import Image from "next/image";
import Div from "./Div";
import Spacing from "./Spacing";
import Button from "./Button";

const ExpertiseSection = ({ imageSrc, altText, title, services }) => {
  return (
    <Div className="container">
      <Div className="row align-items-center">
        <Div className="col-xl-5 col-lg-6">
          <Div className="cs-radius_15 cs-shine_hover_1">
            <Image src={imageSrc} alt={altText} className="cs-radius_15 w-100" width={500} height={300} layout="responsive" />
          </Div>
          <Spacing lg="0" md="40" />
        </Div>
        <Div className="col-lg-6 offset-xl-1">
          <h2 className="cs-font_50 cs-m0">{title}</h2>
          <Spacing lg="50" md="30" />
          <Div className="row">
            {services.map((service, index) => (
              <Div className="col-lg-6" key={index}>
                <Button btnLink={service.link} btnText={service.text} variant="cs-type2" />
                <Spacing lg="20" md="10" />
              </Div>
            ))}
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default ExpertiseSection;
