/**
 * Circular Icon Badge Component
 * For feature cards with circular orange backgrounds
 */

export function createCircularIconBadge(icon, bgColor = 'var(--primary)') {
    return `
    <div class="circular-icon-badge" style="background: ${bgColor};">
      ${icon}
    </div>
  `;
}

export const circularIconStyles = `
  <style>
  .circular-icon-badge {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: white;
    margin: 0 auto 1.5rem;
    box-shadow: 0 8px 16px rgba(255, 102, 0, 0.25);
    transition: all var(--transition-base);
  }
  
  .circular-icon-badge:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(255, 102, 0, 0.35);
  }
  </style>
`;
