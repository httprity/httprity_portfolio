import { useEffect } from 'react';
import { useReducedMotion } from './useMediaQuery';

export function usePageMotion() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--read-progress', String(range > 0 ? window.scrollY / range : 0));
      root.style.setProperty('--hero-shift', Math.min(window.scrollY * 0.07, 35) + 'px');
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = (event.target as Element).closest<HTMLElement>('.xcard, .acard, .prow__link');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--pointer-x', event.clientX - rect.left + 'px');
      target.style.setProperty('--pointer-y', event.clientY - rect.top + 'px');
    };
    update();
    const observer = new ResizeObserver(scroll);
    observer.observe(document.body);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    document.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
      document.removeEventListener('pointermove', move);
      root.style.removeProperty('--read-progress'); root.style.removeProperty('--hero-shift');
    };
  }, [reduced]);
}
