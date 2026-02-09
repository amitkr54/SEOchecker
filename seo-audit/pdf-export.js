/**
 * PDF Export Utility for SEO Audit Reports
 * Uses jsPDF library for client-side PDF generation
 */

// Load jsPDF from CDN
function loadjsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve(window.jspdf.jsPDF);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve(window.jspdf.jsPDF);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function exportToPDF(auditor) {
    try {
        const jsPDF = await loadjsPDF();
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPos = margin;

        // Helper to add new page if needed
        const checkPageBreak = (needed = 20) => {
            if (yPos + needed > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
                return true;
            }
            return false;
        };

        // Header
        doc.setFontSize(24);
        doc.setTextColor(13, 148, 136); // Teal
        doc.text('SEO Audit Report', margin, yPos);
        yPos += 15;

        // URL and Date
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Website: ${auditor.url}`, margin, yPos);
        yPos += 7;
        doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
        yPos += 15;

        // Score Box
        doc.setDrawColor(13, 148, 136);
        doc.setLineWidth(2);
        doc.rect(margin, yPos, 60, 30);
        doc.setFontSize(36);
        doc.setTextColor(13, 148, 136);
        doc.text(`${auditor.score}`, margin + 15, yPos + 22);
        doc.setFontSize(14);
        doc.text('/100', margin + 40, yPos + 22);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('SEO Score', margin + 12, yPos + 27);
        yPos += 40;

        // Summary
        const failed = auditor.results.filter(r => r.status === 'warning' || r.status === 'error').length;
        const passed = auditor.results.filter(r => r.status === 'pass').length;
        const warnings = auditor.results.filter(r => r.status === 'neutral').length;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Tests: ${auditor.results.length}`, margin, yPos);
        yPos += 7;
        doc.setTextColor(16, 185, 129);
        doc.text(`✓ Passed: ${passed}`, margin, yPos);
        yPos += 7;
        doc.setTextColor(220, 53, 69);
        doc.text(`✗ Failed: ${failed}`, margin, yPos);
        yPos += 7;
        doc.setTextColor(245, 158, 11);
        doc.text(`⚠ Warnings: ${warnings}`, margin, yPos);
        yPos += 15;

        // Issues to Fix
        checkPageBreak(30);
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Critical Issues', margin, yPos);
        yPos += 10;

        const criticalIssues = auditor.results
            .filter(r => r.priority === 'high' && r.status !== 'pass')
            .slice(0, 10);

        doc.setFontSize(10);
        criticalIssues.forEach((issue, index) => {
            checkPageBreak(15);
            doc.setFillColor(254, 226, 226);
            doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 10, 'F');
            doc.setTextColor(220, 53, 69);
            doc.text(`${index + 1}. ${issue.name}`, margin + 2, yPos + 3);
            yPos += 10;

            doc.setTextColor(60, 60, 60);
            const descLines = doc.splitTextToSize(issue.description, pageWidth - 2 * margin - 4);
            descLines.forEach(line => {
                checkPageBreak();
                doc.text(line, margin + 4, yPos);
                yPos += 5;
            });
            yPos += 3;
        });

        // Test Results
        checkPageBreak(30);
        yPos += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Detailed Test Results', margin, yPos);
        yPos += 10;

        doc.setFontSize(9);
        auditor.results.slice(0, 30).forEach((result, index) => {
            checkPageBreak(12);

            // Status icon
            if (result.status === 'pass') {
                doc.setTextColor(16, 185, 129);
                doc.text('✓', margin, yPos);
            } else if (result.status === 'warning') {
                doc.setTextColor(220, 53, 69);
                doc.text('✗', margin, yPos);
            } else {
                doc.setTextColor(156, 163, 175);
                doc.text('○', margin, yPos);
            }

            doc.setTextColor(0, 0, 0);
            doc.text(`${result.name}`, margin + 5, yPos);
            yPos += 5;
        });

        // Footer
        const totalPages = doc.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
            doc.text('Generated by AuditBreeze', margin, pageHeight - 10);
        }

        // Save the PDF
        const filename = `seo-audit-${new URL(auditor.url).hostname}-${Date.now()}.pdf`;
        doc.save(filename);

        return true;
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to generate PDF. Please try again.');
        return false;
    }
}
