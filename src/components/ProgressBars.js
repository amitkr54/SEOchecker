/**
 * Progress Bars Component
 * Horizontal progress bars for test results (failed/warnings/passed)
 */

export function createProgressBars(results) {
  const total = results.failed + results.warnings + results.passed;
  const failedWidth = total > 0 ? (results.failed / total) * 100 : 0;
  const warningsWidth = total > 0 ? (results.warnings / total) * 100 : 0;
  const passedWidth = total > 0 ? (results.passed / total) * 100 : 0;

  return `
    <div class="results-summary">
      <div class="result-row result-failed">
        <span class="result-count">${results.failed} Failed</span>
        <div class="result-bar">
          <div class="result-fill" style="width: ${failedWidth}%"></div>
        </div>
      </div>
      
      <div class="result-row result-warning">
        <span class="result-count">${results.warnings} Warnings</span>
        <div class="result-bar">
          <div class="result-fill" style="width: ${warningsWidth}%"></div>
        </div>
      </div>
      
      <div class="result-row result-passed">
        <span class="result-count">${results.passed} Passed</span>
        <div class="result-bar">
          <div class="result-fill" style="width: ${passedWidth}%"></div>
        </div>
      </div>
    </div>
  `;
}

export const progressBarsStyles = `
  <style>
  .results-summary {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .result-row {
    margin: 0;
  }
  
  .result-count {
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
    font-size: 1.25rem;
    color: #111;
  }
  
  .result-bar {
    height: 12px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
  }
  
  .result-fill {
    height: 100%;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 4px;
  }
  
  .result-failed .result-fill { background: #ff4d4d; }
  .result-warning .result-fill { background: #ffaa00; }
  .result-passed .result-fill { background: #2ecc71; }
  </style>
`;
