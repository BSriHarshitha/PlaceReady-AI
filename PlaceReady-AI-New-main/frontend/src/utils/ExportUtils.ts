// Export utilities for Admin Dashboard
import { generatePDFReport } from './PDFReport';

export interface ExportData {
  users: any[];
  format: 'csv' | 'excel' | 'pdf' | 'json';
}

export const exportToCSV = (users: any[]): void => {
  const headers = ['Name', 'Email', 'Branch', 'Phone', 'Overall Score', 'Resume Score', 'Coding Score', 'Profile Score', 'Status', 'Skills', 'Skill Gaps', 'Registration Date'];
  
  const rows = users.map(user => [
    user.name || 'N/A',
    user.email || 'N/A',
    user.branch || 'N/A',
    user.phone || 'N/A',
    user.analysis?.finalScore || 'N/A',
    user.analysis?.resumeScore || 'N/A',
    user.analysis?.codingScore || 'N/A',
    user.analysis?.linkedinScore || 'N/A',
    user.analysis ? (user.analysis.finalScore >= 70 ? 'Ready' : user.analysis.finalScore >= 50 ? 'Almost Ready' : 'Needs Improvement') : 'Pending',
    user.analysis?.skills?.join('; ') || 'N/A',
    user.analysis?.skillGaps?.join('; ') || 'N/A',
    new Date(user.registrationDate || Date.now()).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `placeready_users_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (users: any[]): void => {
  // For Excel, we'll create a CSV with Excel-compatible format
  exportToCSV(users);
};

export const exportToJSON = (users: any[]): void => {
  const dataStr = JSON.stringify(users, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `placeready_users_${new Date().toISOString().split('T')[0]}.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportBatchReport = async (users: any[]): Promise<void> => {
  try {
    // Generate a comprehensive batch report
    const reportData = {
      generatedDate: new Date().toISOString(),
      totalUsers: users.length,
      analyzedUsers: users.filter(u => u.analysis).length,
      readyUsers: users.filter(u => u.analysis?.finalScore >= 70).length,
      almostReadyUsers: users.filter(u => u.analysis?.finalScore >= 50 && u.analysis.finalScore < 70).length,
      needsImprovementUsers: users.filter(u => u.analysis?.finalScore < 50).length,
      averageScore: users.filter(u => u.analysis).length > 0
        ? Math.round(users.filter(u => u.analysis).reduce((sum, u) => sum + u.analysis.finalScore, 0) / users.filter(u => u.analysis).length)
        : 0,
      users: users.map(u => ({
        name: u.name,
        email: u.email,
        branch: u.branch,
        score: u.analysis?.finalScore || 0,
        status: u.analysis ? (u.analysis.finalScore >= 70 ? 'Ready' : u.analysis.finalScore >= 50 ? 'Almost Ready' : 'Needs Improvement') : 'Pending',
      })),
    };

    await generatePDFReport({
      finalScore: reportData.averageScore,
      resumeScore: Math.round(users.filter(u => u.analysis).reduce((sum, u) => sum + (u.analysis?.resumeScore || 0), 0) / users.filter(u => u.analysis).length || 1),
      codingScore: Math.round(users.filter(u => u.analysis).reduce((sum, u) => sum + (u.analysis?.codingScore || 0), 0) / users.filter(u => u.analysis).length || 1),
      linkedinScore: Math.round(users.filter(u => u.analysis).reduce((sum, u) => sum + (u.analysis?.linkedinScore || 0), 0) / users.filter(u => u.analysis).length || 1),
      skills: Array.from(new Set(users.flatMap(u => u.analysis?.skills || []))),
      skillGaps: Array.from(new Set(users.flatMap(u => u.analysis?.skillGaps || []))),
      recommendations: [
        `${reportData.needsImprovementUsers} students need immediate attention`,
        `${reportData.almostReadyUsers} students are close to being placement ready`,
        `Average batch readiness: ${reportData.averageScore}%`,
      ],
      achievements: [],
      analysisDate: reportData.generatedDate,
    });
  } catch (error) {
    console.error('Error generating batch report:', error);
    throw error;
  }
};

