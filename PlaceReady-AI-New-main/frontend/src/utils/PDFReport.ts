// PDF Export & Report Generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  finalScore: number;
  resumeScore: number;
  codingScore: number;
  linkedinScore: number;
  skills: string[];
  skillGaps: string[];
  recommendations: string[];
  achievements?: string[];
  analysisDate: string;
  userName?: string;
  industry?: string;
  benchmarks?: any;
}

export const generatePDFReport = async (data: ReportData, elementId?: string): Promise<void> => {
  try {
    // If elementId is provided, convert HTML element to PDF
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`placement-readiness-report-${new Date().toISOString().split('T')[0]}.pdf`);
        return;
      }
    }

    // Fallback: Generate PDF from data
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPos = 20;

    // Header
    pdf.setFontSize(22);
    pdf.setTextColor(79, 70, 229);
    pdf.text('Placement Readiness Report', 105, yPos, { align: 'center' });
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Generated on ${new Date(data.analysisDate).toLocaleDateString()}`, 105, yPos, { align: 'center' });
    yPos += 15;

    // Overall Score
    pdf.setFillColor(79, 70, 229);
    pdf.rect(20, yPos, 170, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(36);
    pdf.text(`${data.finalScore}%`, 105, yPos + 18, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Overall Placement Readiness Score', 105, yPos + 25, { align: 'center' });
    yPos += 40;

    // Score Breakdown
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text('Score Breakdown', 20, yPos);
    yPos += 8;

    const scores = [
      { label: 'Resume', value: data.resumeScore },
      { label: 'Coding', value: data.codingScore },
      { label: 'Profile', value: data.linkedinScore },
    ];

    scores.forEach((score, index) => {
      const xPos = 20 + (index * 57);
      pdf.setFillColor(240, 249, 255);
      pdf.rect(xPos, yPos, 52, 20, 'F');
      pdf.setFontSize(20);
      pdf.setTextColor(79, 70, 229);
      pdf.text(`${score.value}%`, xPos + 26, yPos + 10, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(score.label, xPos + 26, yPos + 16, { align: 'center' });
    });
    yPos += 30;

    // Skills
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Key Skills (${data.skills.length})`, 20, yPos);
    yPos += 8;

    let currentLine = '';
    data.skills.forEach((skill, index) => {
      const testLine = currentLine ? `${currentLine}, ${skill}` : skill;
      if (pdf.getTextWidth(testLine) < 170 && index < data.skills.length - 1) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          pdf.setFontSize(10);
          pdf.setTextColor(79, 70, 229);
          pdf.text(currentLine + (index < data.skills.length - 1 ? ',' : ''), 20, yPos);
          yPos += 6;
          currentLine = skill;
        } else {
          pdf.text(skill + (index < data.skills.length - 1 ? ',' : ''), 20, yPos);
          yPos += 6;
        }
      }
    });
    if (currentLine) {
      pdf.text(currentLine, 20, yPos);
      yPos += 10;
    }
    yPos += 5;

    // Skill Gaps
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Areas to Improve (${data.skillGaps.length})`, 20, yPos);
    yPos += 8;

    data.skillGaps.forEach((gap, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(10);
      pdf.setTextColor(180, 83, 9);
      pdf.text(`• ${gap}`, 20, yPos);
      yPos += 6;
    });
    yPos += 5;

    // Recommendations
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Recommendations', 20, yPos);
    yPos += 8;

    data.recommendations.forEach((rec, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(`• ${rec}`, 170);
      pdf.text(lines, 20, yPos);
      yPos += lines.length * 6 + 2;
    });

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Page ${i} of ${totalPages}`, 105, 287, { align: 'center' });
      pdf.text('PlaceReady AI - Confidential Report', 105, 292, { align: 'center' });
    }

    pdf.save(`placement-readiness-report-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to print
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Placement Readiness Report - ${new Date().toLocaleDateString()}</title>
        <style>
          @media print { @page { margin: 1cm; } }
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
          .score-box { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .section-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 10px; border-left: 4px solid #4f46e5; padding-left: 10px; }
          .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .score-item { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
          .score-item .value { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .score-item .label { font-size: 12px; color: #64748b; margin-top: 5px; }
          .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
          .tag { display: inline-block; background: #e0e7ff; color: #4f46e5; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
          .tag.gap { background: #fef3c7; color: #b45309; }
          ul { line-height: 1.8; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Placement Readiness Report</h1>
          <p>Generated on ${new Date(data.analysisDate).toLocaleDateString()}</p>
        </div>
        
        <div class="score-box">
          <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">${data.finalScore}%</div>
          <div style="font-size: 18px;">Overall Placement Readiness Score</div>
        </div>
        
        <div class="score-grid">
          <div class="score-item">
            <div class="value">${data.resumeScore}%</div>
            <div class="label">Resume Score</div>
          </div>
          <div class="score-item">
            <div class="value">${data.codingScore}%</div>
            <div class="label">Coding Score</div>
          </div>
          <div class="score-item">
            <div class="value">${data.linkedinScore}%</div>
            <div class="label">Profile Score</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">✅ Key Skills (${data.skills.length})</div>
          <div class="skill-tags">
            ${data.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">⚠️ Areas to Improve (${data.skillGaps.length})</div>
          <div class="skill-tags">
            ${data.skillGaps.map(gap => `<span class="tag gap">${gap}</span>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">💡 Recommendations</div>
          <ul>
            ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        ${data.achievements && data.achievements.length > 0 ? `
        <div class="section">
          <div class="section-title">🏆 Achievements Unlocked</div>
          <div class="skill-tags">
            ${data.achievements.map(ach => `<span class="tag">${ach}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>This report is confidential and generated by PlaceReady AI. For more information, visit our platform.</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  }
};
