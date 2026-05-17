import { useState, useEffect } from 'react';
import { translateText } from '../services/translate';

export const useTranslate = (text: string) => {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;
    
    if (localStorage.getItem('vibe_lang') === 'bn' && text) {
      // Small delay to avoid heavy immediate fetching
      const timer = setTimeout(() => {
          translateText(text).then(res => {
            if (isMounted) setTranslated(res);
          });
      }, 50);
      return () => { isMounted = false; clearTimeout(timer); };
    } else {
      setTranslated(text);
    }
    
    return () => { isMounted = false; };
  }, [text]);

  return translated;
};

// Component for wrapping text
export const Tr = ({ children }: { children: React.ReactNode }) => {
  const text = typeof children === 'string' ? children : String(children || '');
  const translated = useTranslate(text);
  return <>{translated}</>;
};
