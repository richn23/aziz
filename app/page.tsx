'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Brick animations from different directions
const brickFromLeft = {
  hidden: { opacity: 0, x: -100, rotate: -5 },
  visible: { opacity: 1, x: 0, rotate: 0 }
};

const brickFromRight = {
  hidden: { opacity: 0, x: 100, rotate: 5 },
  visible: { opacity: 1, x: 0, rotate: 0 }
};

const brickFromBottom = {
  hidden: { opacity: 0, y: 80, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const brickDrop = {
  hidden: { opacity: 0, y: -120, rotate: -10 },
  visible: { opacity: 1, y: 0, rotate: 0 }
};

type BrickAnimation =
  | typeof brickFromLeft
  | typeof brickFromRight
  | typeof brickFromBottom
  | typeof brickDrop;

type LegacyBrick =
  | { type: 'empty'; animation: BrickAnimation }
  | { type: 'word'; text: string; animation: BrickAnimation }
  | { type: 'stat'; number: number; label: string; animation: BrickAnimation };

// Counter component for stats
function Counter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = target / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}+</span>;
}

// Before/After Fade Component - Simple hover fade
function BeforeAfterReveal({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string }) {
  return (
    <div className="ba-reveal">
      {/* Before image (underneath) */}
      <div className="ba-reveal-before">
        <Image
          src={beforeSrc}
          alt="Before renovation"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* After image (on top, fades in on hover) */}
      <div className="ba-reveal-after">
        <Image
          src={afterSrc}
          alt="After renovation"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Labels - swap on hover */}
      <div className="ba-reveal-label before">Before</div>
      <div className="ba-reveal-label after">After</div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / docHeight) * 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form submit handler (placeholder)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add your API endpoint here
    alert('Thank you! We will contact you shortly.');
  };

  // Brick wall data with animation directions
  const brickRows: LegacyBrick[][] = [
    [
      { type: 'empty', animation: brickFromLeft },
      { type: 'stat', number: 30, label: 'Years', animation: brickDrop },
      { type: 'stat', number: 150, label: 'Projects', animation: brickDrop },
      { type: 'empty', animation: brickFromRight }
    ],
    [
      { type: 'word', text: 'Family Business', animation: brickFromLeft },
      { type: 'empty', animation: brickFromBottom },
      { type: 'word', text: 'Local Expertise', animation: brickFromRight }
    ],
    [
      { type: 'empty', animation: brickFromLeft },
      { type: 'stat', number: 500, label: 'Units', animation: brickDrop },
      { type: 'stat', number: 100, label: 'Families', animation: brickDrop },
      { type: 'word', text: 'Al Ain Based', animation: brickFromRight }
    ]
  ];

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ height: `${scrollProgress}%` }} 
      />

      {/* Navigation */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="logo">Al Ain Heritage</div>
        <ul className="nav-links">
          <li><a href="#legacy">Our Story</a></li>
          <li><a href="#transformation">Transformations</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#gallery">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <motion.div 
          className="hero-image"
          style={{ scale: heroScale }}
        >
          <Image
            src="/hero.png"
            alt="Modern apartment building in Al Ain"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </motion.div>
        <div className="hero-overlay" />
        
        <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
          <motion.div 
            className="hero-badge"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Established 1994
          </motion.div>
          
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Transforming Al Ain,<br />One Villa at a Time
          </motion.h1>
          
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Three decades of trusted villa redevelopment, creating modern living spaces from traditional homes.
          </motion.p>
        </motion.div>

        <motion.div 
          className="scroll-indicator"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span>Scroll</span>
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* Legacy Section with Brick Wall */}
      <section className="legacy" id="legacy">
        <div className="legacy-bg" />
        
        <div className="legacy-container">
          <motion.div 
            className="legacy-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ duration: 0.8 }}
          >
            <h2>Built on Trust, Delivering Excellence</h2>
            <p>
              For over 30 years, we've been transforming Al Ain's residential landscape. 
              What began as a family business has grown into the region's most trusted name 
              in villa redevelopment.
            </p>
          </motion.div>

          {/* Brick Wall - Bricks animate from different directions */}
          <div className="brick-wall">
            {brickRows.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className={`brick-row ${rowIndex === 1 ? 'offset' : ''}`}
              >
                {row.map((brick, brickIndex) => (
                  <motion.div
                    key={brickIndex}
                    className={`brick ${brick.type === 'empty' ? 'empty' : 'content'} ${brick.type}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={brick.animation}
                    transition={{ 
                      duration: 0.7, 
                      delay: rowIndex * 0.15 + brickIndex * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    {brick.type === 'stat' && (
                      <>
                        <div className="brick-number">
                          <Counter target={brick.number!} />
                        </div>
                        <div className="brick-label">{brick.label}</div>
                      </>
                    )}
                    {brick.type === 'word' && brick.text}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section - Single Showcase */}
      <section className="transformation" id="transformation">
        <motion.div 
          className="transformation-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2>See the Transformation</h2>
          <p>From dated villas to modern apartment living</p>
        </motion.div>

        <div className="before-after-container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            transition={{ duration: 0.8 }}
          >
            <BeforeAfterReveal 
              beforeSrc="/before.png"
              afterSrc="/after.png"
            />
            <p className="ba-hint">Hover to reveal transformation</p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <motion.div 
          className="services-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2>What We Do</h2>
        </motion.div>

        <div className="services-grid">
          {[
            {
              image: '/service-villa.png',
              title: 'Villa Redevelopment',
              description: 'Complete transformation of traditional villas into modern, multi-unit residential properties. We handle everything from planning to final handover.'
            },
            {
              image: '/service-apartment.png',
              title: 'Apartment Conversion',
              description: 'Expert subdivision of large properties into high-quality apartment units, maximizing your property\'s rental potential and value.'
            },
            {
              image: '/service-planning.png',
              title: 'Planning & Consultation',
              description: 'Professional assessment of your property\'s potential with detailed feasibility studies, architectural planning, and municipality approvals.'
            }
          ].map((service, index) => (
            <motion.div 
              key={index}
              className="service-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={index === 0 ? brickFromLeft : index === 2 ? brickFromRight : fadeUp}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              <div className="service-image">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section - Carousel */}
      <section className="gallery" id="gallery">
        <motion.div 
          className="gallery-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2>Our Projects</h2>
        </motion.div>

        <div className="gallery-carousel">
          {/* First set of images */}
          {[
            '/gallery-entrance.png',
            '/gallery-living1.png',
            '/gallery-living2.png',
            '/gallery-bedroom.png',
            '/gallery-detail.png'
          ].map((src, index) => (
            <div key={`first-${index}`} className="gallery-item">
              <Image
                src={src}
                alt={`Project ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {[
            '/gallery-entrance.png',
            '/gallery-living1.png',
            '/gallery-living2.png',
            '/gallery-bedroom.png',
            '/gallery-detail.png'
          ].map((src, index) => (
            <div key={`second-${index}`} className="gallery-item">
              <Image
                src={src}
                alt={`Project ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="contact-container">
          <motion.div 
            className="contact-info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={brickFromLeft}
            transition={{ duration: 0.8 }}
          >
            <h2>Let's Discuss<br />Your Property</h2>
            <p>
              Ready to unlock your villa's potential? Get in touch for a free 
              consultation and discover how we can transform your property.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <span>Phone</span>
                  <a href="tel:+97137123456">+971 3 712 3456</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24zM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <span>WhatsApp</span>
                  <a href="https://wa.me/97137123456" target="_blank" rel="noopener noreferrer">
                    +971 3 712 3456
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <span>Location</span>
                  <p>Al Ain, United Arab Emirates</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form 
            className="contact-form"
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={brickFromRight}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+971 XX XXX XXXX" required />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" />
            </div>
            
            <div className="form-group">
              <label>Tell us about your property</label>
              <textarea placeholder="Property location, size, current condition, and what you'd like to achieve..." />
            </div>
            
            <button type="submit" className="submit-btn">
              Request Free Consultation
            </button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>
          © 2024 Al Ain Heritage Developments. All rights reserved. | {' '}
          <a href="#">Privacy Policy</a>
        </p>
      </footer>
    </>
  );
}