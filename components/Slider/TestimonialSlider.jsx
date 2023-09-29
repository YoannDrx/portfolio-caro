import React, { useState } from 'react';
import Slider from 'react-slick';
import { Icon } from '@iconify/react';
import Testimonial from '../Testimonial';
import Div from '../Div';
import Spacing from '../Spacing';
export default function TestimonialSlider() {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const testimonialData = [
    {
      testimonialThumb: '/images/testimonial_1.jpeg',
      testimonialText:
        "Grâce à son expertise en gestion des droits d'auteur, Caroline nous avons pu sécuriser notre catalogue musical et maximiser nos revenus. Une ressource inestimable pour tout artiste ou label.",
      avatarName: 'Claire Dupont',
      avatarDesignation: 'Directrice Artistique chez MusiCorp',
      ratings: '4',
    },
    {
      testimonialThumb: '/images/testimonial_2.jpeg',
      testimonialText:
        "Son accompagnement dans le processus de subvention a été décisif. Nous avons non seulement obtenu le financement, mais aussi une meilleure compréhension des mécanismes de l'industrie.",
      avatarName: 'Jean Martin',
      avatarDesignation: 'CEO chez IndieProd',
      ratings: '5',
    },
    {
      testimonialThumb: '/images/testimonial_3.jpeg',
      testimonialText:
        "La gestion de notre production musicale n'a jamais été aussi fluide. Du début à la fin, tout a été pris en charge avec un grand professionnalisme.",
      avatarName: 'Sophie Leroux',
      avatarDesignation: 'Productrice chez StarRecords',
      ratings: '4.5',
    },
    {
      testimonialThumb: '/images/testimonial_1.jpeg',
      testimonialText:
        "Une expertise solide en droits d'auteur et une capacité à résoudre des problèmes complexes. Cependant, la communication pourrait être améliorée.",
      avatarName: 'Lucas Bernard',
      avatarDesignation: 'Artiste Indépendant',
      ratings: '3.5',
    },
  ];
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <div
      {...props}
      className={
        'slick-prev slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
    >
      <Icon icon="bi:arrow-left" />
    </div>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <div
      {...props}
      className={
        'slick-next slick-arrow' +
        (currentSlide === slideCount - 1 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
    >
      <Icon icon="bi:arrow-right" />
    </div>
  );
  return (
    <>
      <Div className="cs-gradient_bg_1 cs-shape_wrap_3 cs-parallax">
        <Spacing lg="130" md="80" />
        <Div className="cs-shape_3 cs-to_up">
          <img src="/images/shape_1.svg" alt="Shape" />
        </Div>
        <Div className="container">
          <Div className="cs-testimonial_slider">
            <Div className="cs-testimonial_slider_left">
              <Slider
                asNavFor={nav1}
                ref={slider2 => setNav2(slider2)}
                slidesToShow={3}
                swipeToSlide={true}
                focusOnSelect={true}
                centerMode={true}
                centerPadding="0px"
                arrows={false}
              >
                {testimonialData.map((item, index) => (
                  <Div className="slider-nav_item" key={index}>
                    <Div className="cs-rotate_img">
                      <Div className="cs-rotate_img_in">
                        <img src={item.testimonialThumb} alt="Thumb" />
                      </Div>
                    </Div>
                  </Div>
                ))}
              </Slider>
            </Div>
            <Div className="cs-testimonial_slider_right">
              <Slider
                asNavFor={nav2}
                ref={slider1 => setNav1(slider1)}
                prevArrow={<SlickArrowLeft />}
                nextArrow={<SlickArrowRight />}
                className="cs-arrow_style1"
              >
                {testimonialData.map((item, index) => (
                  <Div key={index}>
                    <Testimonial
                      testimonialText={item.testimonialText}
                      avatarName={item.avatarName}
                      avatarDesignation={item.avatarDesignation}
                      ratings={item.ratings}
                    />
                  </Div>
                ))}
              </Slider>
            </Div>
          </Div>
        </Div>
        <Spacing lg="130" md="80" />
      </Div>
    </>
  );
}
