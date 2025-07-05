import React from 'react';
import { Link } from 'react-router-dom';

const team = [
  {
    name: 'Ayesha Khan',
    role: 'Founder & CEO',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Visionary leader with a passion for quality and customer happiness.'
  },
  {
    name: 'Ali Raza',
    role: 'Head of Operations',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Ensures every order is delivered on time and with care.'
  },
  {
    name: 'Sara Malik',
    role: 'Lead Designer',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Creates beautiful, functional products for our customers.'
  },
  {
    name: 'Bilal Ahmed',
    role: 'Customer Success',
    img: 'https://randomuser.me/api/portraits/men/44.jpg',
    bio: 'Always ready to help and support our valued customers.'
  },
];

const About = () => {
  return (
    <div className="about-page min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80')`}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">About Us</h1>
          <div className="text-sm flex justify-center gap-2 items-center">
            <span className="opacity-80"><Link to="/" className="hover:text-yellow-400 transition">Home</Link></span>
            <span className="mx-1">&gt;</span>
            <span className="font-semibold">About Us</span> 
          </div>
        </div>
      </div>

      {/* Company Story with Images */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Founded in 2022, WatchStore was born from a passion for timeless style and quality craftsmanship. What started as a small online shop has grown into a trusted destination for watch lovers across the globe.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is to make luxury and everyday watches accessible, affordable, and enjoyable for everyone. We believe that everyone deserves to own a piece of timeless elegance.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://i1.t4s.cz//products/dr2615-007/nike-invincible-3-757880-dr2615-012-960.webp" 
              alt="Luxury watches collection" 
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To inspire confidence and self-expression by offering exceptional products and outstanding customer service that exceeds expectations.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To be the most loved and trusted watch retailer, known for innovation, integrity, and a personal touch that makes every customer feel valued.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">💝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Customer First</h3>
              <p className="text-gray-600">We go above and beyond for our customers, ensuring every interaction is memorable.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quality</h3>
              <p className="text-gray-600">Only the best products make it to our store, curated with care and attention to detail.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Integrity</h3>
              <p className="text-gray-600">Honesty and transparency in everything we do, building trust with every transaction.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Innovation</h3>
              <p className="text-gray-600">Always improving, always evolving to meet the changing needs of our customers.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community</h3>
              <p className="text-gray-600">Giving back and making a positive impact in the communities we serve.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Excellence</h3>
              <p className="text-gray-600">Striving for excellence in every aspect of our business and customer experience.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        {/* <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div key={member.name} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                <div className="relative mb-6">
                  <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full object-cover shadow-lg" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{member.name}</h3>
                <div className="text-yellow-600 text-sm font-semibold mb-3 bg-yellow-50 px-3 py-1 rounded-full">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Gallery Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80" 
                alt="Luxury shoes" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80" 
                alt="Classic shoes" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80" 
                alt="Sport shoes" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default About;