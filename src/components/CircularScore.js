export function createCircularScore(score, total = 100, label = 'SEO Score') {
  const circumference = 2 * Math.PI * 75; // radius = 75
  const percentage = (score / total) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  // Green color as seen in the reference
  let strokeColor = '#27ae60';
  if (percentage < 50) strokeColor = '#e74c3c'; // red
  else if (percentage < 75) strokeColor = '#f39c12'; // orange

  return `
    <div class="score-card">
      <div class="circular-svg-container">
        <svg class="circular-progress" width="180" height="180" viewBox="0 0 180 180">
          <circle class="progress-bg" cx="90" cy="90" r="75"></circle>
          <circle class="progress-fill" cx="90" cy="90" r="75" 
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${offset}"
            style="stroke: ${strokeColor};"></circle>
        </svg>
        <div class="score-content">
          <div class="score-label">${label}</div>
          <div class="score-value">${score}/${total}</div>
        </div>
      </div>
      <div class="score-average-badge">
        <span>Average SEO score of top 100 sites: 75%</span>
        <span class="info-icon">ⓘ</span>
      </div>
    </div>
  `;
}

export const circularScoreStyles = `
  <style>
  .score-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 10px;
  }
  
  .circular-svg-container {
    position: relative;
    width: 180px;
    height: 180px;
    margin-bottom: 2rem;
  }
  
  .circular-progress {
    transform: rotate(-90deg);
  }
  
  .progress-bg {
    fill: none;
    stroke: #f8fafc;
    stroke-width: 8;
  }
  
  .progress-fill {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .score-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
  }
  
  .score-label {
    font-size: 0.95rem;
    color: #94a3b8;
    margin-bottom: 6px;
    font-weight: 500;
  }
  
  .score-value {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1;
  }
  
  .score-average-badge {
    padding: 10px 20px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #64748b;
    font-weight: 500;
    font-size: 0.95rem;
    white-space: nowrap;
  }
  
  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: #cbd5e1;
    color: white;
    border-radius: 50%;
    font-size: 11px;
    font-style: normal;
  }
  
  @media (max-width: 400px) {
    .score-value {
      font-size: 2rem;
    }
  }
  </style>
`;
