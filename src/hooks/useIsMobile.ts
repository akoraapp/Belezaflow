import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 640;

function computeIsMobile() {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

// Detects the real device viewport width so the app can switch between the
// full-bleed phone layout and the centered desktop layout automatically.
// There is no manual toggle for this in the shipped app — it always reflects
// the actual window size, live, via the resize listener below.
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(computeIsMobile);

  useEffect(() => {
    const onResize = () => setIsMobile(computeIsMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}
