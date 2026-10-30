import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/LanguageContext.jsx';

/** An image that fades in once loaded and shows fallback text on error. */
export default function FadeImage({ src, alt, className = '' }) {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // a cached image may have loaded before onLoad was attached
    const img = imgRef.current;
    setLoaded(Boolean(img?.complete && img.naturalWidth));
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return <div className={`flex items-center justify-center text-sm text-slate-400 ${className}`}>{t.ui.noImage}</div>;
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} object-contain transition duration-500 ease-out ${loaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
    />
  );
}
