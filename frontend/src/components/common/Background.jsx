/**
 * Background - App background component
 * Provides consistent themed background across pages using DaisyUI
 */
import React from 'react';

/**
 * LiquidChrome - Main background component using DaisyUI base colors
 */
export const LiquidChrome = () => {
  return (
    <div className="min-h-screen w-full fixed top-0 left-0 z-[-1] bg-base-200 transition-colors duration-300" />
  );
};

/**
 * Background - Alias for LiquidChrome for backward compatibility
 */
export const Background = LiquidChrome;

export default LiquidChrome;
