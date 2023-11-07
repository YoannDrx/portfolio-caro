import Head from 'next/head';
import React from 'react';
import Cta from '../../components/Cta';
import Div from '../../components/Div';
import Layout from '../../components/Layout';
import PageHeading from '../../components/PageHeading';
import SectionHeading from '../../components/SectionHeading';
import Spacing from '../../components/Spacing';
import Team from '../../components/Team';

export default function LabelPage() {
  const teamData = [
    {
      memberImage: '/images/member_1.jpeg',
      memberName: 'Melon Bulgery',
      memberDesignation: 'Product Designer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_2.jpeg',
      memberName: 'Olinaz Fushi',
      memberDesignation: 'Product Designer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_3.jpeg',
      memberName: 'David Elone',
      memberDesignation: 'React Developer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_4.jpeg',
      memberName: 'Melina Opole',
      memberDesignation: 'WP Developer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_3.jpeg',
      memberName: 'David Elone',
      memberDesignation: 'React Developer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_4.jpeg',
      memberName: 'Melina Opole',
      memberDesignation: 'WP Developer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_1.jpeg',
      memberName: 'Melon Bulgery',
      memberDesignation: 'Product Designer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
    {
      memberImage: '/images/member_2.jpeg',
      memberName: 'Olinaz Fushi',
      memberDesignation: 'Product Designer',
      memberSocial: {
        linkedin: '/',
        twitter: '/',
        youtube: '/',
        facebook: '/',
      },
    },
  ];
  return (
    <>
      <Head>
        <title>Team</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading
          title="Les Labels"
          bgSrc="images/team_hero_bg.jpeg"
          pageLinkText="Labels"
        />
        <Spacing lg="145" md="80" />
        <Div className="container">
          <SectionHeading
            title="Découvrez <br/> de nouveaux talents."
            subtitle="Our Team"
            variant="cs-style1 text-center"
          />
          <Spacing lg="90" md="45" />
          <Div className="row">
            {teamData.map((item, index) => (
              <Div key={index} className="col-lg-3 col-sm-6">
                <Team
                  memberImage={item.memberImage}
                  memberName={item.memberName}
                  memberDesignation={item.memberDesignation}
                  memberSocial={item.memberSocial}
                />
                <Spacing lg="80" md="30" />
              </Div>
            ))}
          </Div>
          <Spacing lg="70" md="50" />
          <Div className="container">
            <Cta
              title="Let’s disscuse make <br />something <i>cool</i> together"
              btnText="Apply For Meeting"
              btnLink="/contact"
              bgSrc="/images/cta_bg.jpeg"
            />
          </Div>
        </Div>
      </Layout>
    </>
  );
}