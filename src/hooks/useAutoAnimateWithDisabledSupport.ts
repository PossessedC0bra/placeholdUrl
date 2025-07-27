import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCallback, useRef } from "react";

/**
 * Custom hook that provides auto-animate functionality while preserving disabled button states.
 * This hook ensures that disabled buttons maintain their opacity and interaction states
 * even during auto-animate transitions.
 */
export function useAutoAnimateWithDisabledSupport<T extends HTMLElement>(
  config?: Parameters<typeof useAutoAnimate>[0]
) {
  const [parent, enable] = useAutoAnimate<T>({
    duration: 250,
    easing: 'ease-out',
    ...config,
  });

  const elementRef = useRef<T | null>(null);

  const preserveDisabledStates = useCallback((element: T | null) => {
    if (!element) return;

    // Find all disabled elements within the animated container
    const disabledElements = element.querySelectorAll(':disabled, [disabled], .disabled');
    
    disabledElements.forEach((disabledEl) => {
      // Ensure disabled elements maintain their proper styling
      if (disabledEl instanceof HTMLElement) {
        disabledEl.style.setProperty('opacity', '0.5', 'important');
        disabledEl.style.setProperty('pointer-events', 'none', 'important');
        disabledEl.style.setProperty('cursor', 'not-allowed', 'important');
      }
    });
  }, []);

  // Enhanced ref callback that combines auto-animate ref with our custom logic
  const enhancedRef = useCallback((element: T | null) => {
    // Store reference for our own use
    elementRef.current = element;
    
    // Call the original auto-animate ref
    if (typeof parent === 'function') {
      parent(element);
    }

    if (element) {
      // Initial preservation of disabled states
      preserveDisabledStates(element);

      // Set up a MutationObserver to watch for changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' || mutation.type === 'childList') {
            preserveDisabledStates(element);
          }
        });
      });

      observer.observe(element, {
        attributes: true,
        attributeFilter: ['disabled', 'class'],
        childList: true,
        subtree: true,
      });

      // Also preserve states during animation events
      const handleAnimationStart = () => {
        setTimeout(() => preserveDisabledStates(element), 0);
      };

      const handleAnimationEnd = () => {
        preserveDisabledStates(element);
      };

      element.addEventListener('animationstart', handleAnimationStart);
      element.addEventListener('animationend', handleAnimationEnd);

      // Cleanup function - we'll store it on the element for later cleanup
      const cleanup = () => {
        observer.disconnect();
        element.removeEventListener('animationstart', handleAnimationStart);
        element.removeEventListener('animationend', handleAnimationEnd);
      };

      // Store cleanup function on the element
      (element as any).__autoAnimateCleanup = cleanup;
    } else if (elementRef.current) {
      // Cleanup when element is removed
      const cleanup = (elementRef.current as any).__autoAnimateCleanup;
      if (cleanup) {
        cleanup();
      }
    }
  }, [parent, preserveDisabledStates]);

  return [enhancedRef, enable] as const;
}

/**
 * Configuration object for auto-animate that avoids opacity conflicts
 */
export const disabledButtonFriendlyConfig = {
  duration: 250,
  easing: 'ease-out' as const,
  // Custom keyframes that are more careful with opacity
  keyframes: (phase: 'add' | 'remove' | 'remain') => {
    if (phase === 'add') {
      return [
        { 
          transform: 'scale(0.96) translateY(-4px)',
          opacity: 0.8
        },
        { 
          transform: 'scale(1) translateY(0)',
          opacity: 1
        }
      ];
    }
    
    if (phase === 'remove') {
      return [
        { 
          transform: 'scale(1) translateY(0)',
          opacity: 1
        },
        { 
          transform: 'scale(0.96) translateY(-4px)',
          opacity: 0
        }
      ];
    }
    
    // For moving elements, avoid opacity changes
    return [
      { transform: 'translateY(var(--auto-animate-start-transform, 0))' },
      { transform: 'translateY(0)' }
    ];
  }
};