import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguagePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem('vibe_lang_selected');
    const lang = localStorage.getItem('vibe_lang');
    if (!selected) {
      setShow(true);
    } else if (lang === 'bn') {
      enableBangla();
    }
  }, []);

  const enableBangla = () => {
      document.cookie = 'googtrans=/en/bn; path=/';
      document.cookie = 'googtrans=/en/bn; path=/; domain=' + window.location.hostname;
      
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
        #google_translate_element { display: none !important; }
        #google_translate_element_global { display: none !important; }
        font { background: transparent !important; color: inherit !important; box-shadow: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      `;
      document.head.appendChild(style);

      // Inject translation script
      if (!document.getElementById('google-translate-script')) {
        (window as any).googleTranslateElementInit = function () {
          new (window as any).google.translate.TranslateElement({ 
              pageLanguage: 'en',
              autoDisplay: false
          }, 'google_translate_element');
        };
        
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
      }
  };

  const handleSelect = (lang: string) => {
    localStorage.setItem('vibe_lang_selected', 'true');
    localStorage.setItem('vibe_lang', lang);
    setShow(false);
    
    if (lang === 'bn') {
      document.cookie = 'googtrans=/en/bn; path=/';
      document.cookie = 'googtrans=/en/bn; path=/; domain=' + window.location.hostname;
    } else {
      document.cookie = 'googtrans=/en/en; path=/';
      document.cookie = 'googtrans=/en/en; path=/; domain=' + window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    }
    
    window.location.reload(); 
  };

  if (!show) return <div id="google_translate_element" className="hidden"></div>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl flex flex-col items-center relative z-[10000]"
          >
            <h2 className="text-2xl font-bold mb-2 text-center text-zinc-900 dark:text-zinc-100">Select Language</h2>
            <p className="text-zinc-500 mb-8 text-center text-sm">Please choose your preferred language for the website.</p>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => handleSelect('bn')}
                className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold transition-all active:scale-95 text-lg"
              >
                বাংলা (Bengali)
              </button>
              
              <button
                onClick={() => handleSelect('en')}
                className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-2xl font-semibold transition-all active:scale-95 text-lg"
              >
                English
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}
