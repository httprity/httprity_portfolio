import { useEffect } from 'react';

/**
 * One shared IntersectionObserver that adds `.is-visible` to every `.reveal`
 * element as it enters the viewport. Cheap, CSS-driven, and a no-op when
 * the user prefers reduced motion (CSS already shows everything).
 */
export function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root.current ?? document;
    const nodes = scope.querySelectorAll<HTMLElement>('.reveal');
    if (nodes.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [root]);
}
