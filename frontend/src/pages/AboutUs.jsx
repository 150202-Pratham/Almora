import React from 'react';

const AboutUs = () => {
  const values = [
    {
      icon: '🎨',
      title: 'Authenticity',
      description: 'Preserving traditional techniques and cultural heritage with every product'
    },
    {
      icon: '🌿',
      title: 'Sustainability',
      description: 'Eco-friendly practices and responsible sourcing for a better future'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Supporting artisan communities and ensuring fair trade practices'
    },
    {
      icon: '⭐',
      title: 'Quality',
      description: 'Maintaining highest standards in craftsmanship and materials'
    }
  ];

  const teamMembers = [
    { name: 'Founder & Vision', role: 'Craftsmanship Expert', emoji: '👔' },
    { name: 'Artisan Relations', role: 'Community Manager', emoji: '🤝' },
    { name: 'Quality Assurance', role: 'Heritage Curator', emoji: '✨' }
  ];

  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent mb-6">About Almora</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between traditional artisan craftsmanship and modern fashion through authentic, sustainable, and beautifully crafted pieces
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                Founded in 2025, Almora was born from a passion for preserving the exquisite craftsmanship and rich heritage of traditional artisans.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our journey began with a simple mission: to bridge the gap between traditional artisan communities and the modern world, ensuring their exceptional work reaches customers who truly appreciate the artistry behind each piece.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We work directly with skilled artisans, eliminating middlemen to ensure fair trade practices and maintaining the highest quality standards. Every product tells a story of heritage, dedication, and timeless craftsmanship.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 via-yellow-50 to-primary/5 rounded-2xl p-12 border-2 border-primary/20">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🏛️</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Heritage</h3>
                  <p className="text-gray-600">Honoring centuries of artisan traditions</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">🌍</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Global Reach</h3>
                  <p className="text-gray-600">Connecting artisans with worldwide customers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">💚</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Impact</h3>
                  <p className="text-gray-600">Creating sustainable livelihoods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
          <p className="text-lg text-gray-600">The principles that guide everything we do</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-primary/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-12 lg:p-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-gray-300 text-lg">Passionate professionals dedicated to artisan support</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-6xl mb-4 flex justify-center">{member.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-gray-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary via-yellow-500 to-primary rounded-2xl p-12 lg:p-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Join Our Artisan Community</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Discover the story behind every piece and support artisans creating timeless fashion
          </p>
          <button className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-300 transform hover:scale-105">
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;