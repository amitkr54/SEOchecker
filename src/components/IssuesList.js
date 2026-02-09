export function createIssuesList(issues) {
  const linkIcon = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2196F3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="issue-svg-icon">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
    `;

  return `
    <div class="issues-container">
      <h2 class="issues-title">Issues to fix</h2>
      <div class="issues-list">
        ${issues.map(issue => `
          <div class="issue-item">
            <div class="tag-column">
                <span class="priority-badge priority-${issue.priority}">
                ${issue.priority.toUpperCase()}
                </span>
            </div>
            <div class="icon-column">
                <a href="#${issue.anchor}" class="issue-anchor-link" title="View details">
                    ${linkIcon}
                </a>
            </div>
            <div class="text-column">
                <p class="issue-description">${issue.text}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export const issuesListStyles = `
  <style>
  .issues-container {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    border: 1px solid #eef2f6;
  }
  
  .issues-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #1e293b;
    letter-spacing: -0.01em;
  }
  
  .issues-list {
    display: flex;
    flex-direction: column;
  }
  
  .issue-item {
    display: grid;
    grid-template-columns: 100px 40px 1fr;
    align-items: center;
    padding: 1.25rem 0;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
  }
  
  .issue-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .issue-item:first-child {
    padding-top: 0;
  }

  .tag-column {
    display: flex;
    align-items: center;
  }

  .icon-column {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text-column {
    padding-left: 8px;
  }
  
  .priority-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 80px;
    height: 32px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  
  .priority-high {
    background: #fff1f2;
    color: #e11d48;
    border: 1px solid #fecdd3;
  }
  
  .priority-medium {
    background: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
  }
  
  .priority-low {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  
  .issue-description {
    color: #334155;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
  }

  @media (max-width: 600px) {
    .issue-item {
        grid-template-columns: auto auto 1fr;
        gap: 12px;
    }
    .priority-badge {
        width: 70px;
    }
  }
  </style>
`;
