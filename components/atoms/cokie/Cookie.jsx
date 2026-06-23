import React, { useEffect } from 'react';
import './Cookie.css'; // Asigură-te că ai stilurile CSS corect setate aici

const CookieBanner = () => {

  useEffect(() => {
    // Selectează elementul overlay
    const overlay = document.querySelector('.cky-overlay');
    const body = document.body;

    // Verificăm dacă elementul există pe pagină
    if (!overlay) return;

    // Creăm un MutationObserver pentru a monitoriza modificările din DOM
    const observer = new MutationObserver(() => {
      // Dacă overlay-ul nu are clasa 'cky-hide', blocăm scroll-ul
      if (!overlay.classList.contains('cky-hide')) {
        body.classList.add('ck-scroll-blocked');
      } else {
        // Dacă are clasa 'cky-hide', permitem scroll-ul
        body.classList.remove('ck-scroll-blocked');
      }
    });

    // Configurăm observer-ul pentru a observa schimbările din clasele elementului overlay
    observer.observe(overlay, {
      attributes: true, // Observăm modificările la atribute (inclusiv clasele)
      attributeFilter: ['class'], // Observăm doar modificările la clasa 'cky-overlay'
    });

    // Cleanup pentru a opri observer-ul când componenta se demontează
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Overlay - este injectat din API-ul cookies */}
      <div className="cky-overlay"></div>

      <div className="cky-consent-container cky-banner-bottom" tabIndex="0">
        <div className="cky-consent-bar" data-cky-tag="notice" style={{ borderColor: '#f4f4f4', backgroundColor: '#FFFFFF' }}>
          <div className="cky-notice">
            <p className="cky-title" role="heading" aria-level="1" data-cky-tag="title" style={{ color: '#212121' }}>
              Confidențialitatea datelor dvs. este importantă pentru noi
            </p>
            <div className="cky-notice-group">
              <div className="cky-notice-des" data-cky-tag="description" style={{ color: '#212121' }}>
                <p>
                  Folosim cookie-uri pentru a vă îmbunătăți experiența de navigare, pentru a vă prezenta conținut și
                  reclame personalizate și pentru a analiza traficul nostru. Făcând clic pe „Acceptă tot”, acceptați
                  utilizarea cookie-urilor.
                </p>
              </div>
              <div className="cky-notice-btn-wrapper" data-cky-tag="notice-buttons">
                <button
                  className="cky-btn cky-btn-customize"
                  aria-label="Personalizați"
                  data-cky-tag="settings-button"
                  style={{ color: '#1863dc', borderColor: '#1863dc', backgroundColor: 'transparent' }}
                >
                  Personalizați
                </button>
                <button
                  className="cky-btn cky-btn-reject"
                  aria-label="Refuzare toate"
                  data-cky-tag="reject-button"
                  style={{ color: '#FFFFFF', borderColor: '#1863dc', backgroundColor: '#1863dc' }}
                >
                  Refuzare toate
                </button>
                <button
                  className="cky-btn cky-btn-accept"
                  aria-label="Acceptare toate"
                  data-cky-tag="accept-button"
                  style={{ color: '#FFFFFF', borderColor: '#1863dc', backgroundColor: '#1863dc' }}
                >
                  Acceptare toate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
