declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    gapi: any;
  }
}

export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

export const initGA = () => {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}');
  `;
  document.head.appendChild(script2);
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

export const trackUserEngagement = {
  skillAnalysisStarted: () => trackEvent('skill_analysis_started', 'engagement'),
  skillAnalysisCompleted: (score: number) => trackEvent('skill_analysis_completed', 'engagement', `score_${score}`),
  learningPathClicked: (path: string) => trackEvent('learning_path_clicked', 'engagement', path),
  resumeUploaded: () => trackEvent('resume_uploaded', 'engagement'),
};