import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      title: 'Summer Collection 2025',
      description: 'Explore our latest arrivals for the season',
      buttonText: 'Shop Now',
      link: '/products?category=fashion',
    },
    {
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
      title: 'Traditional Crafts',
      description: 'Handcrafted with love in Almora',
      buttonText: 'Discover More',
      link: '/products?category=crafts',
    },
    {
      image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e',
      title: 'Home Decor',
      description: 'Transform your space with our collection',
      buttonText: 'View Collection',
      link: '/products?category=home',
    },
  ];

  return (
    <div className="relative">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(" + slide.image + ")" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                <div>
                  <h2 className="text-5xl font-bold mb-4 animate-fadeIn">
                    {slide.title}
                  </h2>
                  <p className="text-xl mb-8 animate-fadeIn animation-delay-200">
                    {slide.description}
                  </p>
                  <Link
                    to={slide.link}
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 animate-fadeIn animation-delay-400"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;