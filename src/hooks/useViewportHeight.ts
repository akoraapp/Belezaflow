import { useEffect, useState } from 'react';

function computeHeight() {
  if (typeof window === 'undefined') return 800;
  // visualViewport tracks the actually-visible area on mobile Chrome/Safari,
  // shrinking when the on-screen keyboard or the browser's own address bar
  // is showing — window.innerHeight (and CSS 100vh/100dvh) can lag a beat
  // behind that, which is what let the bottom nav render below the fold and
  // become unreachable (see App.tsx's use of this hook).
  return window.visualViewport?.height ?? window.innerHeight;
}

// Live pixel height of the real visible viewport, kept in sync via
// visualViewport's resize/scroll events (falling back to window resize on
// browsers without visualViewport support). Used instead of a pure CSS
// vh/dvh height for the one container that pins content (the bottom nav) to
// its bottom edge, since a CSS unit that's even briefly wrong there hides
// the nav rather than just leaving a harmless gap.
export function useViewportHeight(): number {
  const [height, setHeight] = useState(computeHeight);

  useEffect(() => {
    const onChange = () => setHeight(computeHeight());
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', onChange);
      vv.addEventListener('scroll', onChange);
      return () => {
        vv.removeEventListener('resize', onChange);
        vv.removeEventListener('scroll', onChange);
      };
    }
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }, []);

  return height;
}
