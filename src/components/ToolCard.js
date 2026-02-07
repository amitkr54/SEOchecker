/**
 * ToolCard Component
 * Card component for displaying tools on homepage
 */

/**
 * Creates a tool preview card
 * @param {Object} tool - Tool information
 * @returns {string} HTML for tool card
 */
export function createToolCard(tool) {
    const { title, description, icon, link, category, features = [] } = tool;

    return `
    <div class="tool-card card">
      <div class="tool-icon">${icon}</div>
      <div class="tool-content">
        ${category ? `<span class="tool-category badge badge-success">${category}</span>` : ''}
        <h3 class="tool-title">${title}</h3>
        <p class="tool-description">${description}</p>
        ${features.length > 0 ? `
          <ul class="tool-features">
            ${features.map(feature => `<li>✓ ${feature}</li>`).join('')}
          </ul>
        ` : ''}
        <a href="${link}" class="btn btn-primary tool-btn">
          Try Now →
        </a>
      </div>
    </div>
  `;
}

// Tool card styles
export const toolCardStyles = `
<style>
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-icon {
  font-size: 3rem;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3));
  transition: transform var(--transition-base);
}

.tool-card:hover .tool-icon {
  transform: scale(1.1) rotateY(180deg);
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.tool-category {
  align-self: flex-start;
  font-size: 0.75rem;
}

.tool-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.tool-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.tool-features {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tool-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tool-features li::before {
  content: '✓';
  color: var(--accent);
  font-weight: bold;
}

.tool-btn {
  margin-top: auto;
  width: 100%;
}

@media (max-width: 640px) {
  .tool-icon {
    font-size: 2.5rem;
  }
  
  .tool-title {
    font-size: 1.25rem;
  }
}
</style>
`;
