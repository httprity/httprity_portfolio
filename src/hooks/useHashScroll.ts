import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * react-router doesn't scroll to `#hash` targets on client-side navigation
 * (e.g. "Back to work" → /#work). Do it manually once the route has rendered.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    // next frame so the target section exists after a route change
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
}
