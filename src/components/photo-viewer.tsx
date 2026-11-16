'use client';
import Image, { type ImageProps } from 'next/image';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

type Photo = { src: ImageProps['src']; alt: string };
const PhotoContext = createContext<(photo: Photo) => void>(() => {});
export function PhotoViewer({ children }: { children: React.ReactNode }) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = useCallback((next: Photo) => setPhoto(next), []);
  const value = useMemo(() => open, [open]);
  useEffect(() => {
    if (!photo) { dialog.current?.close(); return; }
    dialog.current?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, [photo]);
  return <PhotoContext.Provider value={value}>{children}<dialog ref={dialog} className="photo-dialog" aria-label="Photo viewer" onCancel={() => setPhoto(null)} onClose={() => setPhoto(null)} onClick={event => { if (event.target === event.currentTarget) setPhoto(null); }}>
    <div className="photo-dialog-top"><span className="eyebrow">THROUGH OUR LENS</span><button aria-label="Close photo viewer" onClick={() => setPhoto(null)}><X size={23} /></button></div>
    {photo && <><div className="photo-dialog-image"><Image src={photo.src} alt={photo.alt} fill sizes="95vw" unoptimized /></div><p>{photo.alt}</p></>}
  </dialog></PhotoContext.Provider>;
}
export function PhotoImage({ zoomable = true, className = '', alt, ...props }: ImageProps & { zoomable?: boolean }) {
  const open = useContext(PhotoContext);
  return <><Image {...props} alt={alt} className={`photo-image ${className}`} />{zoomable && <button className="photo-open" type="button" aria-label={`View photo: ${alt}`} onClick={() => open({ src: props.src, alt })}><span><Maximize2 size={15} /><span>VIEW PHOTO</span></span></button>}</>;
}
