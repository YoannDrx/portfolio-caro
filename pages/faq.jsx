import { Icon } from '@iconify/react';
import Head from 'next/head';
import React from 'react';
import Accordion from '../components/Accordion';
import Button from '../components/Button';
import Cta from '../components/Cta';
import Div from '../components/Div';
import Layout from '../components/Layout';
import PageHeading from '../components/PageHeading';
import Spacing from '../components/Spacing';

export default function Faq() {
  return (
    <>
      <Head>
        <title>FAQ - Droits d'Auteur et Production</title>
        <meta name="description" content="Foire aux questions sur la gestion des droits d'auteur et la production" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading
          title="Foire Aux Questions"
          bgSrc="/images/about_hero_bg.jpeg"
          pageLinkText="FAQ"
        />
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Div className="row">
            <Div className="col-lg-4">
              <Div className="cs-faq_nav cs-radius_15">
                <h2 className="cs-faq_nav_title cs-m0">Catégories de FAQ</h2>
                <Div className="cs-height_30 cs-height_lg_30" />
                <ul className="cs-list cs-style1 cs-mp0">
                  <li>
                    <Button
                      variant="cs-type2"
                      btnLink="/faq"
                      btnText="Gestion des droits d'auteur"
                      icon={
                        <Icon icon="material-symbols:content-copy-outline-rounded" />
                      }
                    />
                  </li>
                  <li>
                    <Button
                      variant="cs-type2"
                      btnLink="/faq"
                      btnText="Tarification"
                      icon={
                        <Icon icon="material-symbols:content-copy-outline-rounded" />
                      }
                    />
                  </li>
                  <li>
                    <Button
                      variant="cs-type2"
                      btnLink="/faq"
                      btnText="Livraison de projet"
                      icon={
                        <Icon icon="material-symbols:content-copy-outline-rounded" />
                      }
                    />
                  </li>
                  <li>
                    <Button
                      variant="cs-type2"
                      btnLink="/faq"
                      btnText="Documentation et contrats"
                      icon={
                        <Icon icon="material-symbols:content-copy-outline-rounded" />
                      }
                    />
                  </li>
                </ul>
              </Div>
            </Div>
            <Div className="col-lg-7 offset-lg-1">
              <Spacing lg="0" md="40" />
              <Accordion />
            </Div>
          </Div>
        </Div>
        <Spacing lg="150" md="80" />
        {/* Start CTA Section */}
        <Div className="container">
          <Cta
            title="Discutons de votre projet <br />ensemble"
            btnText="Prendre un rendez-vous"
            btnLink="/contact"
            bgSrc="/images/cta_bg.jpeg"
          />
        </Div>
        {/* End CTA Section */}
      </Layout>
    </>
  );
}