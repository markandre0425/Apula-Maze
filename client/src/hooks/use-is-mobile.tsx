import { useState, useEffect } from 'react';

/**
 * Detect if the device is running Android
 */
function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
}

/**
 * Detect if the device is a mobile device based on user agent
 */
function isMobileDevice(): boolean {
  return typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Hook to detect if the current device is a mobile device
 * @returns boolean indicating if the device is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 || isMobileDevice() : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || isMobileDevice());
    };

    // Check on mount
    checkMobile();

    // Re-check when window is resized
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}

/**
 * Hook to detect if the current device is an Android device
 * @returns boolean indicating if the device is Android
 */
export function useIsAndroid() {
  const [isAndroidDevice, setIsAndroidDevice] = useState<boolean>(
    typeof window !== 'undefined' ? isAndroid() : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsAndroidDevice(isAndroid());
  }, []);

  return isAndroidDevice;
}

/**
 * Hook to detect if the current device has touch capability
 * @returns boolean indicating if the device supports touch
 */
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasTouchCapability = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      // @ts-ignore
      (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);
    
    setIsTouchDevice(hasTouchCapability);
  }, []);

  return isTouchDevice;
}