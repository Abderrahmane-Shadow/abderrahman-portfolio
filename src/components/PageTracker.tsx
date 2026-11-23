import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

/**
 * Silent, non-intrusive client-side page view tracker.
 * - Automatically tracks route changes and public in-page section hash navigations.
 * - Excludes admin dashboard routes (/admin/*).
 * - Excludes authenticated administrator sessions.
 * - Debounces rapid duplicate triggers caused by React Strict Mode.
 * - Never interrupts UI navigation.
 */
export const PageTracker: React.FC = () => {
  const location = useLocation();
  const { trackPageView } = useData();
  const lastTracked = useRef<{ path: string; time: number }>({ path: '', time: 0 });

  useEffect(() => {
    const handleTracking = (path: string) => {
      // 1. Do not track admin dashboard routes
      if (path.startsWith('/admin')) {
        return;
      }

      // 2. Prevent duplicate events caused by React Strict Mode or rapid clicks within 3 seconds
      const now = Date.now();
      if (lastTracked.current.path === path && now - lastTracked.current.time < 3000) {
        return;
      }

      lastTracked.current = { path, time: now };
      trackPageView(path);
    };

    // Track on initial mount and route change
    const initialPath = location.pathname + (location.hash || '');
    handleTracking(initialPath);

    // Track when user clicks in-page section links (#projects, #about, etc.)
    const handleHashChange = () => {
      const hashPath = window.location.pathname + (window.location.hash || '');
      handleTracking(hashPath);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location.pathname, location.hash, trackPageView]);

  return null;
};
