'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from 'next/navigation'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import ModalContent from '../components/commonComponents/ModalContent';
import Translator from '../components/commonComponents/Translator';
import ModalPortal from '../components/commonComponents/ModalPortal';
import { useLanguage } from '../components/context/LanguageContext';
import useModalsPreload from '@/hooks/useModalsPreload';
import type { ModalData } from '@/type/types';

export default function AboutPageContent() {
  const { language } = useLanguage();
  const { modals, loading } = useModalsPreload();
  
  // State for Modal Data AND Modal Image
  const [activeModal, setActiveModal] = useState<ModalData | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  const pathname = usePathname();
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({ duration: 800, once: false });
    }
  }, []);

  // 1. Force Close on Route Change
  useEffect(() => {
    closeModal();
  }, [pathname]);

  // 2. SCROLL LOCK EFFECT
  useEffect(() => {
    if (activeModal) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add('modal-open');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
    };
  }, [activeModal]);

  const handleViewMore = (modalId: string, imageFileName: string) => {
    const key = modalId.replace('#', '').replace('Modal', '');
    if (modals[key]) {
      setActiveModal(modals[key]);
      setActiveImage(imageFileName);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveImage(null);
  };

  return (
    <>
      <div className="min-vh-100 bg-[#fcfaf8]" ref={containerRef}>
        <motion.div 
          className="fixed-top" 
          style={{ scaleX: scrollYProgress, height: '4px', background: '#ff5722', transformOrigin: '0%', zIndex: 1020 }} 
        />

        {/* --- Header --- */}
        <header className="about-hero position-relative overflow-hidden">
          <div className="hero-parallax-bg"></div>
          <div className="hero-glass-overlay"></div>
          
          <div className="container position-relative z-2 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="display-3 fw-bold mb-3">
                <Translator text="Journey Through Maharashtra" targetLang={language} />
              </h1>
              <p className="lead fs-4 opacity-75">
                <Translator text="Exploring the legacy and spirit of the Great Land" targetLang={language} />
              </p>
            </motion.div>
          </div>
        </header>

        {/* --- Timeline Section --- */}
        <section className="container py-5 position-relative">
          <div className="timeline-wrapper">
            <div className="timeline-track d-none d-md-block">
              <motion.div className="timeline-progress" style={{ scaleY }} />
            </div>

            {timelineItems.map((item, i) => (
              <div key={i} className={`timeline-row mb-5 ${i % 2 === 0 ? 'row-left' : 'row-right'}`}>
                <div className="row g-0 align-items-center w-100">
                  <div className={`col-md-5 timeline-card-col ${i % 2 === 0 ? 'order-1' : 'order-3'}`}>
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.01 }}
                      className="timeline-glass-card shadow-sm"
                      data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
                    >
                      {/* Timeline Card Image */}
                      <div className="timeline-image-container">
                        <img 
                          src={`/assets/images/bannerImages/${item.image}`} 
                          alt={item.title} 
                          className="timeline-card-img"
                        />
                      </div>

                      <div className="timeline-year-badge">
                          <Translator text={item.year} targetLang={language} />
                      </div>

                      <div className="card-inner-content p-4 p-lg-5 pt-4">
                        <h3 className="fw-bold h4 mb-3 text-dark">
                          <Translator text={item.title} targetLang={language} />
                        </h3>
                        <p className="text-muted mb-4 card-description">
                          <Translator text={item.description} targetLang={language} />
                        </p>
                        <button
                          className="btn-read-more"
                          onClick={() => handleViewMore(item.modalId, item.image)}
                        >
                          <Translator text="Read More" targetLang={language} />
                          <i className="fas fa-chevron-right ms-2 arrow-icon"></i>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                  <div className="col-md-2 d-none d-md-flex justify-content-center z-3 order-2">
                     <div className="timeline-outer-node shadow-sm">
                        <div className="timeline-inner-node"></div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- MODAL PORTAL --- */}
      <ModalPortal>
        {activeModal && (
          <>
            <div 
              className="modal-backdrop fade show" 
              style={{ zIndex: 5001 }}
              onClick={closeModal}
            ></div>

            <div 
              className="modal fade show" 
              id="dynamicModal" 
              tabIndex={-1} 
              aria-modal="true" 
              role="dialog"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()} 
              onTouchMove={(e) => e.stopPropagation()}
              style={{ 
                display: 'block', 
                zIndex: 5002,
                overflowX: 'hidden', 
                overflowY: 'auto',  
                position: 'fixed',  
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overscrollBehavior: 'contain'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
              }}
            >
              <div 
                className="modal-dialog modal-dialog-centered modal-xl"
                style={{
                  margin: '1.75rem auto',
                  pointerEvents: 'none'
                }}
              >
                <div 
                  className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="modal-header border-0 bg-transparent position-absolute top-0 end-0 z-3 p-3">
                    <button 
                      type="button" 
                      className="btn-close btn-close-white shadow-none" 
                      onClick={closeModal}
                      aria-label="Close"
                      style={{ filter: 'invert(1) grayscale(100%) brightness(200%)' }}
                    ></button>
                  </div>
                  
                  <div className="modal-body p-0">
                      {loading ? (
                        <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>
                      ) : (
                        <div className="p-0"> 
                           {/* Passing the activeImage prop to the ModalContent */}
                           <ModalContent modal={activeModal} image={activeImage} />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </ModalPortal>

      <style jsx global>{`
        .about-hero { height: 70vh; display: flex; align-items: center; justify-content: center; }
        
        .hero-parallax-bg {
          position: absolute; inset: 0;
          background: url('/assets/images/bannerImages/about_8.jpg') center/cover no-repeat fixed;
          z-index: 0;
        }

        .hero-glass-overlay {
          position: absolute; inset: 0;
          background: rgba(0, 0, 0, 0.4); 
          backdrop-filter: blur(5px); 
          -webkit-backdrop-filter: blur(5px);
          z-index: 1;
        }

        .timeline-track { position: absolute; left: 50%; transform: translateX(-50%); width: 4px; height: 100%; background: #e9ecef; z-index: 1; top:0; }
        .timeline-progress { width: 100%; height: 100%; background: #ff5722; transform-origin: top; }
        .timeline-glass-card { background: #ffffff; border-radius: 25px; position: relative; border: 1px solid rgba(0,0,0,0.03); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow: hidden; }
        .row-left .timeline-glass-card { text-align: right; margin-right: 25px; }
        .row-right .timeline-glass-card { text-align: left; margin-left: 25px; }
        
        .timeline-image-container { width: 100%; height: 220px; overflow: hidden; }
        .timeline-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .timeline-glass-card:hover .timeline-card-img { transform: scale(1.05); }

        .timeline-year-badge { position: absolute; top: 15px; background: #ff5722; color: white; padding: 6px 20px; border-radius: 50px; font-weight: 700; font-size: 0.8rem; box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3); z-index: 5; }
        .row-left .timeline-year-badge { right: 30px; }
        .row-right .timeline-year-badge { left: 30px; }
        
        .timeline-outer-node { width: 44px; height: 44px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid #ff5722; z-index: 10; }
        .timeline-inner-node { width: 14px; height: 14px; background: #007bff; border-radius: 50%; }
        .btn-read-more { border: none; background: transparent; color: #ff5722; font-weight: 700; padding: 0; transition: 0.3s; display: inline-flex; align-items: center; }
        .btn-read-more:hover .arrow-icon { transform: translateX(5px); }
        .card-description { line-height: 1.7; font-size: 0.95rem; }
        
        @media (max-width: 768px) {
          .timeline-track { display: none; }
          .timeline-glass-card { text-align: left !important; margin: 0 10px 40px 10px !important; }
          .timeline-year-badge { left: 20px !important; right: auto !important; }
        }
      `}</style>
    </>
  );
}

// Updated with Historically Accurate Content
const timelineItems = [
  { 
    year: '2nd BCE – 10th CE', 
    title: 'Ancient Heritage', 
    description: 'The awe-inspiring Ajanta & Ellora Caves were carved from solid rock, standing as timeless symbols of ancient Indian art and spirituality.', 
    modalId: '#ancientModal',
    image: 'about_1.jpg' 
  },
  { 
    year: '6th – 14th Century', 
    title: 'Chalukya & Yadava Era', 
    description: 'A golden age of art and culture, witnessing the rise of magnificent Hindu temples, literature, and flourishing trade across the Deccan.', 
    modalId: '#yadavaModal',
    image: 'about_2.jpg' 
  },
  { 
    year: '17th Century', 
    title: 'Maratha Empire', 
    description: 'Chhatrapati Shivaji Maharaj established the Maratha Empire, unifying the region and igniting the spirit of Swarajya (Self-Rule).', 
    modalId: '#marathaModal',
    image: 'about_3.jpg' 
  },
  { 
    year: '1818 – 1947', 
    title: 'British Era', 
    description: 'Following the fall of the Peshwas, the region became part of the Bombay Presidency, becoming a hub for education and social reform.', 
    modalId: '#britishModal',
    image: 'about_4.jpg' 
  },
  { 
    year: '1947', 
    title: 'Independence', 
    description: 'Maharashtra played a pivotal role in India’s freedom struggle, notably hosting the launch of the historic Quit India Movement in 1942.', 
    modalId: '#independenceModal',
    image: 'about_5.jpg' 
  },
  { 
    year: '1960', 
    title: 'State Formation', 
    description: 'The modern state of Maharashtra was born on May 1st, 1960, following the Samyukta Maharashtra Movement’s fight for a linguistic state.', 
    modalId: '#formationModal',
    image: 'about_6.jpg' 
  },
  { 
    year: '1990s', 
    title: 'Financial & Industrial Hub', 
    description: 'Post-liberalization, Mumbai cemented its status as India’s financial capital, driving a massive wave of industrial and economic growth.', 
    modalId: '#industrialModal',
    image: 'about_7.jpg' 
  },
  { 
    year: '2000s – Present', 
    title: 'Tourism & IT Growth', 
    description: 'Maharashtra has evolved into a global destination, blending its rich heritage tourism with booming IT hubs in Pune and Mumbai.', 
    modalId: '#tourismModal',
    image: 'about_8.jpg' 
  }
];