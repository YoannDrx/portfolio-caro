import React from 'react';
import Div from '../Div';

export default function LogoList() {
  const partnerLogos = [
    {
      src: '/images/partner/logo-sacem.png',
      alt: 'Partner',
    },
    {
      src: '/images/partner/logo-scpp.png',
      alt: 'Partner',
    },
    {
      src: '/images/partner/logo-sdrm.png',
      alt: 'Partner',
    },
    {
      src: '/images/partner_4.svg',
      alt: 'Partner',
    },
    {
      src: '/images/partner_5.svg',
      alt: 'Partner',
    },
  ];
  return (
    <Div className="cs-partner_logo_wrap">
      {partnerLogos.map((partnerLogo, index) => (
        <div className="cs-partner_logo" key={index}>
          <img src={partnerLogo.src} alt={partnerLogo.alt} width={300}/>
        </div>
      ))}
    </Div>
  );
}
