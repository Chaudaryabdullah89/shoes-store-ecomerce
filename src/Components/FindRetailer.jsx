import React from 'react';
import { Link } from 'react-router-dom';

const bgStyle = {
  background: `url('https://gwath-store-newdemo.myshopify.com/cdn/shop/files/banner1_2.jpg?v=1748406501&width=100'), linear-gradient(135deg, #f5f6f7 0%, #e9eaec 100%)`,
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const mapStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  opacity: 0.18,
  pointerEvents: 'none',
};

const FindRetailer = () => (
  <section style={bgStyle} className='my-20' >
    {/* World map SVG background */}
    <div style={mapStyle} aria-hidden="true">
      <svg viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <g opacity="0.7">
          <path d="M0 400 Q 360 300 720 400 T 1440 400" stroke="#d1d5db" strokeWidth="3" fill="none"/>
          <circle cx="0" cy="400" r="8" fill="#fffbe6"/>
          <circle cx="360" cy="300" r="8" fill="#fffbe6"/>
          <circle cx="720" cy="400" r="8" fill="#fffbe6"/>
          <circle cx="1080" cy="300" r="8" fill="#fffbe6"/>
          <circle cx="1440" cy="400" r="8" fill="#fffbe6"/>
        </g>
        <g opacity="0.4">
          <ellipse cx="720" cy="250" rx="600" ry="180" fill="#e5e7eb"/>
        </g>
      </svg>
    </div>
    <div className="relative z-10 mx-auto w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-xl p-10 flex flex-col items-center text-center border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">FIND THE BEST WATCHES</h2>
      <p className="text-gray-700 mb-8 text-base md:text-lg">Find your favorite Seiko timepieces around the world. Find a store near you.</p>
      <div className=" text-white bg-[#ba7a2d] px-8 py-3 lg:lg:l-10 justify-center items-center rounded-sm transition-colors overflow-hidden relative group h-12 w-fit">
                    <div className="   flex flex-col transition-transform gap-4 duration-300 group-hover:-translate-y-[38px] h-full">
                      <Link
                        to={`/shop`}
                        className="h-12 flex items-center font-semibold font-['Montserrat']  "
                      >
                        Read More
                      </Link>
                      <Link
                        to={`/shop`}
                        className="h-12 flex items-center font-semibold font-['Montserrat'] "
                      >
                        Read More
                      </Link>
                    </div>
                  </div>   <div className=" text-[#ba7a2d] px-8 py-3 lg:lg:l-10 justify-center items-center rounded-sm transition-colors overflow-hidden relative group h-12 w-fit">
                
                  </div>    </div>
  </section>
);

export default FindRetailer; 