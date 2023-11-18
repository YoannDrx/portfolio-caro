import parse from "html-react-parser";
// import WaterWave from 'react-water-wave';
import Div from "../Div";
import VerticalLinks from "../VerticalLinks";
import dynamic from "next/dynamic";

const WaterWave = dynamic(
  () => {
    return import("react-water-wave");
  },
  { ssr: false }
);
export default function Hero3({ title, subtitle, socialLinksHeading, heroSocialLinks, bgImageUrl }) {
  return (
    <Div className="cs-hero cs-style1 cs-type2" id="home">
      <WaterWave className="cs-hero_bg cs-bg cs-ripple_version cs-center" imageUrl={bgImageUrl}>
        {() => (
          <Div className="container">
            <Div className="cs-hero_text text-center">
              <h1 className="cs-hero_title">{parse(title)}</h1>
              <h4 className="subtitle">
                <i>{subtitle}</i>
              </h4>
            </Div>
          </Div>
        )}
      </WaterWave>
      <VerticalLinks data={heroSocialLinks} title={socialLinksHeading} variant="cs-left_side" />
    </Div>
  );
}
