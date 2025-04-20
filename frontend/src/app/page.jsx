import React from 'react';
import './homePage.css'; // Your enhanced styles

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <h1 className="unitalking-title">Unitalking</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content-div">
          <h2>Connecting the World through Conversations</h2>
          <p>Chat, translate, and meet new people across the globe in a language you understand.</p>
          <a href="/pages/login" className="cta-button hero-button">Join Unitalking Now</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Why Unitalking?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Live Chatting</h3>
            <p>Engage in real-time conversations with friends and strangers alike.</p>
          </div>
          <div className="feature-item">
            <h3>Message Translation</h3>
            <p>Automatically translate messages into the language of your choice for seamless communication.</p>
          </div>
          <div className="feature-item">
            <h3>Create Groups & Chats</h3>
            <p>Build your own groups, add users, and meet new people in a single click.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to start your global conversations?</h2>
        <a href="/pages/login" className="cta-button">Sign Up for Free</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Unitalking. All Rights Reserved.</p>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
