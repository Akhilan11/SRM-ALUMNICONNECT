// Simple Card component for Achievement.jsx
import React from "react";

export function Card({ children, className = "" }) {
  return (
    <article className={className}>
      {children}
    </article>
  );
}
