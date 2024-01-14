import React from "react";
import Div from "../Div";
import ContactInfoWidget from "../Widget/ContactInfoWidget";
import MenuWidget from "../Widget/MenuWidget";
import SocialWidget from "../Widget/SocialWidget";
import TextWidget from "../Widget/TextWidget";
import RecentPostFooter from "../Widget/RecentPostFooter";

export default function Footer({ copyrightText, logoSrc, logoAlt, text }) {
  const copyrightLinks = [
    {
      title: "Conditions d’utilisation",
      href: "/conditions-utilisation",
    },
    {
      title: "Politique de confidentialité",
      href: "/politique-confidentialite",
    },
    {
      title: "Politique de cookies",
      href: "/politique-cookies",
    },
  ];

  const serviceMenu = [
    {
      title: "Gestion des droits d’auteur",
      href: "/service/droits-auteur",
    },
    {
      title: "Gestion des droits voisins",
      href: "/service/droits-voisins",
    },
    {
      title: "Gestion administrative et éditoriale",
      href: "/service/gestion-administrative-et-editoriale",
    },
    {
      title: "Gestion de la distribution physique et digitale",
      href: "/service/gestion-distribution",
    },
    {
      title: "Gestion des oeuvres en sous-édition",
      href: "/service/sous-edition",
    },
    {
      title: "Gestion des dossiers de subvention",
      href: "/service/dossier-subvention",
    },
  ];

  const firstTwoPosts = [
    {
      title: "Comment protéger votre musique?",
      href: "/blog/comment-proteger-musique",
      date: "2021-02-11",
      thumb: "/images/recent_post_1.jpeg",
      slug: "comment-proteger-musique",
    },
    {
      title: "Comment protéger votre musique?",
      href: "/blog/comment-proteger-musique",
      date: "2021-02-11",
      thumb: "/images/recent_post_1.jpeg",
      slug: "comment-proteger-musique",
    },
  ];

  return (
    <footer className="cs-fooer">
      <Div className="cs-fooer_main">
        <Div className="container">
          <Div className="row">
            <Div className="col-lg-3 col-sm-6">
              <Div className="cs-footer_item">
                <TextWidget
                  logoSrc="/images/footer_logo.svg"
                  logoAlt="Logo"
                  text="Protégeons et valorisons votre créativité dans le monde de la musique."
                />
                <SocialWidget />
              </Div>
            </Div>
            <Div className="col-lg-3 col-sm-6">
              <Div className="cs-footer_item">
                <MenuWidget menuItems={serviceMenu} menuHeading="Expertises" />
              </Div>
            </Div>
            <Div className="col-lg-3 col-sm-6">
              <Div className="cs-footer_item">
                <ContactInfoWidget title="Contact" />
              </Div>
            </Div>
            <Div className="col-lg-3 col-sm-6">
              <Div className="cs-footer_item">
                <RecentPostFooter title="Articles Récents" data={firstTwoPosts} />
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
      <Div className="container">
        <Div className="cs-bottom_footer">
          <Div className="cs-bottom_footer_left">
            <Div className="cs-copyright">Copyright © 2023 yodev</Div>
          </Div>
          <Div className="cs-bottom_footer_right">
            <MenuWidget menuItems={copyrightLinks} variant=" cs-style2" />
          </Div>
        </Div>
      </Div>
    </footer>
  );
}
