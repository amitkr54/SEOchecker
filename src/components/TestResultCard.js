/**
 * Test Result Card Component
 * Individual test result display with icon, name, and details
 */

export function createTestResultCard(test) {
  let iconClass = 'test-neutral';
  let icon = '○';

  if (test.status === 'pass') {
    iconClass = 'test-success';
    icon = '✓';
  } else if (test.status === 'error' || test.status === 'fail') {
    iconClass = 'test-error';
    icon = '✕';
  } else if (test.status === 'warning' || test.status === 'neutral') {
    // High priority warnings or specific 'neutral' warnings are treated as failures (Red)
    if (test.priority === 'high') {
      iconClass = 'test-error';
      icon = '✕';
    } else {
      // Medium/Low priority warnings are warnings (Orange)
      iconClass = 'test-warning';
      icon = '!';
    }
  }

  return `
    <div class="test-card" ${test.id ? `id="${test.id}"` : ''}>
      <div class="test-icon ${iconClass}">${icon}</div>
      <div class="test-info">
        <h3 class="test-name">${test.name}</h3>
        <p class="test-rate">${test.passRate || '0'}% of top 100 sites passed</p>
      </div>
      <div class="test-details">
        <p>${test.description}</p>
        ${test.contentBox ? `
          <div class="test-content-box">
            ${test.contentBox}
          </div>
        ` : ''}
        
        ${test.howToFix ? `
          <div class="fix-container">
            <button class="btn-how-to-fix" onclick="const guide = this.parentElement.querySelector('.fix-guide'); guide.style.display = guide.style.display === 'block' ? 'none' : 'block';">
              How to fix
            </button>
            <div class="fix-guide" style="display: none;">
              <div class="fix-guide-inner">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #111827;">Instructions:</h4>
                <div style="color: #4B5563; font-size: 13.5px; line-height: 1.6;">
                  ${test.howToFix}
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export const testResultCardStyles = `
  <style>
  .test-card {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    margin-bottom: 1rem;
    align-items: center;
    background: white;
    transition: all 0.2s ease;
  }
  
  .test-card:hover {
    border-color: #D1D5DB;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  .test-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .test-success {
    background: #10B981;
    color: white;
  }
  
  .test-error {
    background: #FF4D4D; /* Brighter Red like reference */
    color: white;
  }
  
  .test-warning {
    background: #F59E0B;
    color: white;
  }
  
  .test-neutral {
    background: #9CA3AF;
    color: white;
  }
  
  .test-info {
    min-width: 220px;
  }
  
  .test-name {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: #111827;
    letter-spacing: -0.01em;
  }
  
  .test-rate {
    font-size: 13px;
    color: #9CA3AF;
    margin: 2px 0 0;
  }
  
  .test-details {
    color: #4B5563;
    font-size: 15px;
    line-height: 1.6;
  }
  
  .test-details p {
    margin: 0;
  }
  
  .test-content-box {
    margin: 0.75rem 0;
    padding: 1rem;
    background: #F9FAFB;
    border: 1px solid #F3F4F6;
    border-radius: 8px;
    font-size: 13.5px;
  }

  /* Fix Button Styles */
  .fix-container {
    margin-top: 0.75rem;
  }

  .btn-how-to-fix {
    background: #FF4D4D;
    color: white;
    border: none;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-how-to-fix:hover {
    background: #E63939;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 77, 77, 0.2);
  }

  .fix-guide {
    margin-top: 1rem;
    background: #FFF5F5;
    border: 1px solid #FEE2E2;
    border-radius: 8px;
    overflow: hidden;
  }

  .fix-guide-inner {
    padding: 1.25rem;
  }
  
  @media (max-width: 768px) {
    .test-card {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1.5rem;
    }
    
    .test-icon {
      margin: 0;
    }
    
    .test-info {
      text-align: left;
    }
  }
  </style>
`;
