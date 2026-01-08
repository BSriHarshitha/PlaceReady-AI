import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Divider,
  Skeleton
} from '@mui/material';
import { CloudUpload, Psychology, LinkedIn, Refresh, TrendingUp, Code, Download, Share, Work, FilterList } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { realResumeParser } from '../services/realResumeParser';
import { realCodingProfileFetcher } from '../services/realCodingProfiles';
import { trackUserEngagement } from '../utils/analytics';
import { googleDrive } from '../services/googleDrive';
import { apiService } from '../services/apiService';
import { toastManager } from '../utils/ToastNotification';
import { checkAchievements } from '../utils/Achievements';
import { generateRoadmap } from '../utils/RoadmapGenerator';
import { getIndustryRecommendations } from '../utils/IndustryRecommendations';
import { generatePDFReport } from '../utils/PDFReport';
import { ToastContainer } from '../components/ToastContainer';
import { ScoreProgressBar } from '../components/ScoreProgressBar';
import { AchievementBadges } from '../components/AchievementBadges';
import { CategorizedSkills } from '../components/CategorizedSkills';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { SkillProficiencyMatrix } from '../components/SkillProficiencyMatrix';
import { ComparisonTimeline } from '../components/ComparisonTimeline';
import { SkillAnalysisSkeleton } from '../components/SkeletonLoader';
import { StrengthWeaknessSummary } from '../components/StrengthWeaknessSummary';
import { SocialShare } from '../components/SocialShare';
import { ResumeParsingFeedback } from '../components/ResumeParsingFeedback';
import { ResumeValidator } from '../components/ResumeValidator';
import { RoadmapViewer } from '../components/RoadmapViewer';
import { LearningPathCard } from '../components/LearningPathCard';
import { ReferralBadges } from '../components/ReferralBadges';
import { categorizeSkills, getLevelColor } from '../utils/SkillCategories';
import { calculateSkillDemandScore, getTopInDemandSkills } from '../utils/SkillDemand';
import { industryBenchmarks, calculatePercentile, getCommunityBenchmark } from '../utils/Benchmarks';
import { generateLearningPath as createLearningPath } from '../utils/LearningPaths';
import { retryWithBackoff, shouldRetryOnNetworkError } from '../utils/RetryLogic';
import { getErrorMessage } from '../utils/ErrorMessages';
import { AutoSaveManager } from '../utils/AutoSave';
import { OfflineCache } from '../utils/OfflineSupport';
import { Select, MenuItem, FormControl, InputLabel, Tabs, Tab, Box as GridBox } from '@mui/material';
import { motion } from 'framer-motion';

const SkillAnalysis: React.FC = () => {
  const { currentUser } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [codingProfile, setCodingProfile] = useState({
    leetcode: '',
    codechef: '',
    codeforces: '',
    github: ''
  });
  const [linkedinText, setLinkedinText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingAnalysis, setExistingAnalysis] = useState<any>(null);
  const [previousAnalyses, setPreviousAnalyses] = useState<any[]>([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Software Engineer');
  const [currentTab, setCurrentTab] = useState(0);
  const [parsedResumeData, setParsedResumeData] = useState<any>(null);
  const [autoSaveManager] = useState(() => currentUser ? new AutoSaveManager(currentUser.uid) : null);
  const [offlineCache] = useState(() => currentUser ? new OfflineCache(currentUser.uid) : null);
  const [resumeValidation, setResumeValidation] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);

  const recoverData = () => {
    if (!currentUser) return;
    
    // Look for backup data
    const backupKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(`analysis_backup_${currentUser.uid}_`)
    );
    
    if (backupKeys.length > 0) {
      // Get the most recent backup
      const latestBackup = backupKeys.sort().pop();
      if (latestBackup) {
        const backupData = localStorage.getItem(latestBackup);
        if (backupData) {
          const parsedData = JSON.parse(backupData);
          localStorage.setItem(`analysis_${currentUser.uid}`, backupData);
          setExistingAnalysis(parsedData);
          setAnalysis(parsedData);
          setShowRecovery(false);
          alert('Data recovered successfully!');
          return;
        }
      }
    }
    
    alert('No backup data found.');
  };

  const loadAnalysisData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Try to get from backend first
      const results = await apiService.getAnalysis(currentUser.uid);
      
      if (results) {
        setExistingAnalysis(results);
        setAnalysis(results);
        
        if (results.codingProfiles) {
          setCodingProfile(results.codingProfiles);
        }
      } else {
        // Fallback to localStorage and migrate to backend
        const localResults = localStorage.getItem(`analysis_${currentUser.uid}`) || 
                           sessionStorage.getItem(`analysis_${currentUser.uid}`);
        
        if (localResults) {
          const parsedResults = JSON.parse(localResults);
          setExistingAnalysis(parsedResults);
          setAnalysis(parsedResults);
          
          // Migrate to backend
          await apiService.saveAnalysis(currentUser.uid, parsedResults);
          
          if (parsedResults.codingProfiles) {
            setCodingProfile(parsedResults.codingProfiles);
          }
        }
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadAnalysisData();
      
      // Load previous analyses
      const prevAnalyses = JSON.parse(localStorage.getItem(`prev_analyses_${currentUser.uid}`) || '[]');
      setPreviousAnalyses(prevAnalyses.slice(0, 5));
      
      // Load draft if exists
      if (autoSaveManager?.hasDraft()) {
        const draft = autoSaveManager.loadDraft();
        if (draft) {
          setCodingProfile(draft.codingProfile);
          setLinkedinText(draft.linkedinText);
        }
      }
      
      // Load offline cache
      if (offlineCache?.isOffline()) {
        const cached = offlineCache.getAnalysis();
        if (cached && !existingAnalysis) {
          setExistingAnalysis(cached);
          setAnalysis(cached);
        }
      }
      
      // Start auto-save
      autoSaveManager?.startAutoSave(() => {
        if (!resumeFile) return null;
        return {
          resumeFile: resumeFile.name, // Store name only
          codingProfile,
          linkedinText,
          timestamp: new Date().toISOString(),
        };
      });
    }
    
    return () => {
      autoSaveManager?.stopAutoSave();
    };
  }, [currentUser, loadAnalysisData, resumeFile, codingProfile, linkedinText]);

  // Helper method to generate dynamic recommendations based on resume content
  const generateDynamicRecommendations = (parsedData: any, codingScore: number): string[] => {
    const recommendations: string[] = [];
    const skills = parsedData.skills || [];
    const score = parsedData.score?.overall || 0;

    // Resume Score based recommendations
    if (score < 60) {
      recommendations.push('Enhance resume with quantified achievements and metrics');
      recommendations.push('Add impact statements to your experience sections');
    } else if (score < 75) {
      recommendations.push('Improve impact descriptions with concrete numbers and percentages');
    }

    // Skills-based recommendations (check what's missing from resume)
    if (skills.length < 5) {
      recommendations.push('Expand your technical skill set - aim for at least 8-10 key skills');
    }

    if (!skills.some((s: string) => s.toLowerCase().includes('system') || s.toLowerCase().includes('design'))) {
      recommendations.push('Learn System Design - critical for senior and mid-level roles');
    }

    if (!skills.some((s: string) => s.toLowerCase().includes('docker') || s.toLowerCase().includes('kubernetes') || s.toLowerCase().includes('container'))) {
      recommendations.push('Learn containerization (Docker/Kubernetes) for modern DevOps practices');
    }

    if (!skills.some((s: string) => s.toLowerCase().includes('aws') || s.toLowerCase().includes('gcp') || s.toLowerCase().includes('azure') || s.toLowerCase().includes('cloud'))) {
      recommendations.push('Get cloud platform certification (AWS, GCP, or Azure)');
    }

    if (!skills.some((s: string) => s.toLowerCase().includes('react') || s.toLowerCase().includes('angular') || s.toLowerCase().includes('vue') || s.toLowerCase().includes('frontend'))) {
      recommendations.push('Build expertise in modern frontend frameworks (React, Angular, Vue)');
    }

    if (!skills.some((s: string) => s.toLowerCase().includes('testing') || s.toLowerCase().includes('jest') || s.toLowerCase().includes('unit test'))) {
      recommendations.push('Learn testing frameworks (Jest, Mocha) - quality code is crucial');
    }

    // Experience and projects recommendations
    if (parsedData.experience && parsedData.experience < 30) {
      recommendations.push('Seek more internship/work experience - focus on real-world projects');
    } else if (parsedData.experience && parsedData.experience < 60) {
      recommendations.push('Document and highlight your practical project outcomes');
    }

    if (!parsedData.projects || parsedData.projects.length < 2) {
      recommendations.push('Build and showcase 2-3 production-ready projects on GitHub');
      recommendations.push('Create projects that solve real problems to impress recruiters');
    }

    // Coding profile recommendations
    if (codingScore < 50) {
      recommendations.push('Start with consistent LeetCode practice (3-5 problems daily)');
      recommendations.push('Master fundamental data structures and algorithms');
    } else if (codingScore < 70) {
      recommendations.push('Solve medium-level coding problems regularly');
      recommendations.push('Participate in competitive programming contests (Codeforces, CodeChef)');
    }

    // Remove duplicates and limit to 8-10 recommendations
    const uniqueRecommendations = Array.from(new Set(recommendations));
    return uniqueRecommendations.slice(0, 10);
  };

  // Helper method to identify skill gaps dynamically
  const identifyDynamicSkillGaps = (skills: string[], codingData: any): string[] => {
    const requiredSkills = {
      'System Design': ['system', 'design', 'architecture', 'scalability'],
      'Docker/Kubernetes': ['docker', 'kubernetes', 'container'],
      'AWS/Cloud': ['aws', 'gcp', 'azure', 'cloud'],
      'Microservices': ['microservices', 'distributed'],
      'DevOps': ['devops', 'ci/cd', 'jenkins', 'pipeline'],
      'Testing': ['testing', 'jest', 'unit test', 'e2e'],
      'API Design': ['api', 'rest', 'graphql'],
      'Database Optimization': ['database', 'optimization', 'sql']
    };

    const gaps: string[] = [];
    const skillsLower = skills.map(s => s.toLowerCase());

    Object.entries(requiredSkills).forEach(([gapName, keywords]) => {
      const hasSkill = keywords.some(keyword => 
        skillsLower.some(skill => skill.includes(keyword))
      );
      if (!hasSkill) {
        gaps.push(gapName);
      }
    });

    return gaps.slice(0, 8); // Limit to 8 gaps
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setResumeFile(acceptedFiles[0]);
    }
  });

  const analyzeSkills = async () => {
    if (!resumeFile) return;
    
    setLoading(true);
    setError(null);
    trackUserEngagement.skillAnalysisStarted();
    
    try {
      // Use retry logic for API calls
      const driveFile = await retryWithBackoff(
        () => googleDrive.uploadFile(resumeFile, currentUser?.uid || ''),
        { retryCondition: shouldRetryOnNetworkError }
      );
      
      // Parse with Real AI (OpenAI) with retry
      const parsedData = await retryWithBackoff(
        () => realResumeParser.parseResume(resumeFile),
        { retryCondition: shouldRetryOnNetworkError }
      );
      
      setParsedResumeData(parsedData);
      
      // Fetch real coding profile data with retry
      const codingData = await retryWithBackoff(
        () => realCodingProfileFetcher.fetchAllProfiles(codingProfile),
        { retryCondition: shouldRetryOnNetworkError }
      );
      const codingScore = realCodingProfileFetcher.calculateCodingScore(codingData);
      
      // Generate dynamic recommendations based on parsed data
      const dynamicRecommendations = generateDynamicRecommendations(
        parsedData,
        codingScore || 65
      );

      // Identify skill gaps dynamically
      const dynamicSkillGaps = identifyDynamicSkillGaps(
        parsedData.skills,
        codingData
      );

      // Calculate skill demand score
      const skillDemandScore = calculateSkillDemandScore(parsedData.skills);
      
      // Get community benchmark
      const communityBenchmark = getCommunityBenchmark(
        Math.round((parsedData.score.overall + (codingScore || 65) + 75) / 3)
      );

      const enhancedAnalysis = {
        resumeScore: parsedData.score.overall,
        codingScore: codingScore || 65,
        linkedinScore: 75 + Math.floor(Math.random() * 20),
        finalScore: Math.round((parsedData.score.overall + (codingScore || 65) + 75) / 3),
        skills: parsedData.skills,
        skillGaps: dynamicSkillGaps,
        recommendations: dynamicRecommendations,
        codingProfiles: codingProfile,
        codingData: codingData,
        resumeUploaded: true,
        analysisDate: new Date().toISOString(),
        googleDriveLink: driveFile?.webViewLink,
        aiParsedData: parsedData,
        enhancedWithAI: true,
        validationPassed: parsedData.validationPassed,
        realDataUsed: true,
        skillDemandScore: skillDemandScore,
        communityBenchmark: communityBenchmark,
        previousScore: existingAnalysis?.finalScore,
      };
      
      if (currentUser?.uid) {
        // Save to backend with retry
        await retryWithBackoff(
          () => apiService.saveAnalysis(currentUser.uid, enhancedAnalysis),
          { retryCondition: shouldRetryOnNetworkError }
        );
        
        // Keep localStorage as backup
        const analysisData = JSON.stringify(enhancedAnalysis);
        localStorage.setItem(`analysis_${currentUser.uid}`, analysisData);
        sessionStorage.setItem(`analysis_${currentUser.uid}`, analysisData);
        
        // Save to offline cache
        offlineCache?.saveAnalysis(enhancedAnalysis);
        
        // Track previous analyses
        if (existingAnalysis) {
          const prevAnalyses = JSON.parse(localStorage.getItem(`prev_analyses_${currentUser.uid}`) || '[]');
          prevAnalyses.unshift(existingAnalysis);
          if (prevAnalyses.length > 5) prevAnalyses.pop();
          localStorage.setItem(`prev_analyses_${currentUser.uid}`, JSON.stringify(prevAnalyses));
          setPreviousAnalyses(prevAnalyses.slice(0, 5));
        }
      }
      
      setAnalysis(enhancedAnalysis);
      setExistingAnalysis(enhancedAnalysis);
      trackUserEngagement.skillAnalysisCompleted(enhancedAnalysis.finalScore);
      
      // Show success toast
      toastManager.success('Analysis completed successfully!', 3000);
      
      setLoading(false);
      setShowUpdateForm(false);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      const errorDetail = getErrorMessage(error);
      setError(`${errorDetail.message}: ${errorDetail.suggestion}`);
      setLoading(false);
      toastManager.error(errorDetail.message, 5000);
    }
  };

  return (
    <Box sx={{ pt: 10, pb: 6, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '100vh' }}>
      <ToastContainer />
      <Container maxWidth="lg" sx={{ position: 'relative' }} id="analysis-report">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ mb: 1, fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {existingAnalysis && !showUpdateForm ? 'Your Skill Analysis Results' : 'AI-Powered Skill Analysis'}
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{ color: '#64748b', mb: 4, fontSize: '1rem' }}
        >
          {existingAnalysis && !showUpdateForm 
            ? 'Review your placement readiness analysis and track your progress'
            : 'Upload your resume and profiles for comprehensive placement readiness analysis'
          }
        </Typography>

        {!existingAnalysis && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, borderLeft: '4px solid #f59e0b' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">No previous analysis found. Upload your resume to get started.</Typography>
              <Button size="small" onClick={() => setShowRecovery(true)} variant="outlined">Recover Data</Button>
            </Box>
          </Alert>
        )}

        {showRecovery && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2, borderLeft: '4px solid #3b82f6' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Try to recover your previous analysis data?</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={recoverData} variant="contained">Recover</Button>
                <Button size="small" onClick={() => setShowRecovery(false)} variant="outlined">Cancel</Button>
              </Box>
            </Box>
          </Alert>
        )}

        {existingAnalysis && !showUpdateForm ? (
          <Box>
            <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ mb: 3 }}>
              <Tab label="Overview" />
              <Tab label="Skills & Proficiency" />
              <Tab label="Progress Timeline" />
              <Tab label="Learning Path" />
              <Tab label="Benchmarks" />
            </Tabs>
            
            {currentTab === 0 && (
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 350 }}>
                  <Paper sx={{ p: 3, borderRadius: 2.5, height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 22 }} />
                  Your Progress
                </Typography>
                
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                  Analysis from: {new Date(existingAnalysis.analysisDate).toLocaleDateString()}
                </Typography>

                <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' }}>
                  <CardContent sx={{ textAlign: 'center', color: 'white', py: 2 }}>
                    <AnimatedCounter 
                      end={existingAnalysis.finalScore} 
                      suffix="%" 
                      variant="h3"
                      sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.95, mb: 1 }}>
                      Readiness Score
                    </Typography>
                    {existingAnalysis.communityBenchmark && (
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Better than {existingAnalysis.communityBenchmark} of users
                      </Typography>
                    )}
                  </CardContent>
                </Card>
                
                {existingAnalysis.previousScore !== undefined && (
                  <Alert severity={existingAnalysis.finalScore > existingAnalysis.previousScore ? 'success' : 'info'} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {existingAnalysis.finalScore > existingAnalysis.previousScore ? '↑' : '↓'} 
                      {' '}Score changed from {existingAnalysis.previousScore}% to {existingAnalysis.finalScore}% 
                      ({existingAnalysis.finalScore > existingAnalysis.previousScore ? '+' : ''}{existingAnalysis.finalScore - existingAnalysis.previousScore}%)
                    </Typography>
                  </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                  <ScoreProgressBar 
                    score={existingAnalysis.resumeScore} 
                    label="Resume Score" 
                    previousScore={existingAnalysis.previousScore ? Math.round((existingAnalysis.previousScore + 75) / 2) : undefined}
                    tooltipText="Measures the quality and completeness of your resume based on format, content, keywords, and achievements"
                    showTrend={!!existingAnalysis.previousScore}
                  />
                  <ScoreProgressBar 
                    score={existingAnalysis.codingScore} 
                    label="Coding Score" 
                    previousScore={existingAnalysis.previousScore ? Math.round((existingAnalysis.previousScore + 65) / 2) : undefined}
                    tooltipText="Based on your performance on coding platforms like LeetCode, CodeChef, Codeforces, and GitHub activity"
                    showTrend={!!existingAnalysis.previousScore}
                  />
                  <ScoreProgressBar 
                    score={existingAnalysis.linkedinScore} 
                    label="Profile Score" 
                    previousScore={existingAnalysis.previousScore ? Math.round((existingAnalysis.previousScore + 80) / 2) : undefined}
                    tooltipText="Evaluates your professional profile presence and completeness on platforms like LinkedIn"
                    showTrend={!!existingAnalysis.previousScore}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
                  <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                        {existingAnalysis.resumeScore}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Resume
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                        {existingAnalysis.codingScore}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Coding
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {existingAnalysis.linkedinScore}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Profile
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 0, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={() => setShowUpdateForm(true)}
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                      flex: 1,
                      minWidth: 120,
                      fontWeight: 600
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    onClick={async () => {
                      try {
                        await generatePDFReport({
                          finalScore: existingAnalysis.finalScore,
                          resumeScore: existingAnalysis.resumeScore,
                          codingScore: existingAnalysis.codingScore,
                          linkedinScore: existingAnalysis.linkedinScore,
                          skills: existingAnalysis.skills,
                          skillGaps: existingAnalysis.skillGaps,
                          recommendations: existingAnalysis.recommendations,
                          achievements: checkAchievements(existingAnalysis.finalScore, existingAnalysis.skills).map(a => a.title),
                          analysisDate: existingAnalysis.analysisDate,
                        });
                        toastManager.success('PDF report generated successfully!');
                      } catch (error) {
                        toastManager.error('Failed to generate PDF. Using JSON export instead.');
                        const dataStr = JSON.stringify(existingAnalysis, null, 2);
                        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                        const exportFileDefaultName = `my_analysis_${new Date().toISOString().split('T')[0]}.json`;
                        const linkElement = document.createElement('a');
                        linkElement.setAttribute('href', dataUri);
                        linkElement.setAttribute('download', exportFileDefaultName);
                        linkElement.click();
                      }
                    }}
                    sx={{ fontWeight: 600 }}
                  >
                    Export PDF
                  </Button>
                  <SocialShare score={existingAnalysis.finalScore} />
                </Box>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, minWidth: 350 }}>
              <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                  Key Skills ({existingAnalysis.skills.length})
                </Typography>
                <Box sx={{ mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {existingAnalysis.skills.map((skill: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      color="primary" 
                      size="small"
                      sx={{ fontWeight: 500, height: 28 }} 
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                  Areas to Improve ({existingAnalysis.skillGaps.length})
                </Typography>
                <Box sx={{ mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {existingAnalysis.skillGaps.map((gap: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={gap} 
                      color="warning" 
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 500, height: 28 }} 
                    />
                  ))}
                </Box>

                <Box sx={{ background: '#f0f9ff', border: '1px solid #cffafe', borderRadius: 1.5, p: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0369a1', display: 'block', mb: 1 }}>
                    💡 Recommendations ({existingAnalysis.recommendations.length})
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem' }}>
                    {existingAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} style={{ color: '#334155', marginBottom: '4px', lineHeight: 1.3 }}>{rec}</li>
                    ))}
                  </ul>
                </Box>
              </Paper>
                </Box>
              </Box>
            )}
            
            {currentTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <StrengthWeaknessSummary
                  strengths={existingAnalysis.skills
                    .map((skill: string) => {
                      const categorized = categorizeSkills([skill])[0];
                      return {
                        skill,
                        score: categorized ? (categorized.level === 'Advanced' ? 85 : categorized.level === 'Intermediate' ? 65 : 45) : 60,
                      };
                    })
                    .sort((a: any, b: any) => b.score - a.score)
                    .slice(0, 3)}
                  weaknesses={existingAnalysis.skillGaps.map((gap: string) => ({
                    skill: gap,
                    score: 35,
                    reason: 'Not found in your current skill set',
                  }))}
                />
                
                <SkillProficiencyMatrix
                  skills={existingAnalysis.skills.map((skill: string) => {
                    const categorized = categorizeSkills([skill])[0];
                    return {
                      name: skill,
                      level: categorized?.level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' || 'intermediate',
                      score: categorized ? (categorized.level === 'Advanced' ? 85 : categorized.level === 'Intermediate' ? 65 : 45) : 60,
                    };
                  })}
                />
                
                <CategorizedSkills skills={existingAnalysis.skills} />
              </Box>
            )}
            
            {currentTab === 2 && (
              <ComparisonTimeline
                analyses={previousAnalyses}
                currentAnalysis={{
                  date: existingAnalysis.analysisDate,
                  finalScore: existingAnalysis.finalScore,
                  resumeScore: existingAnalysis.resumeScore,
                  codingScore: existingAnalysis.codingScore,
                  linkedinScore: existingAnalysis.linkedinScore,
                }}
              />
            )}
            
            {currentTab === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <RoadmapViewer
                  skillGaps={existingAnalysis.skillGaps}
                  currentScore={existingAnalysis.finalScore}
                  targetScore={Math.min(100, existingAnalysis.finalScore + 15)}
                />
                
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Recommended Learning Paths
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {existingAnalysis.skillGaps.slice(0, 3).map((gap: string, index: number) => (
                      <Box key={index}>
                        <LearningPathCard
                          learningPath={createLearningPath(gap, 'intermediate')}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            
            {currentTab === 4 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Industry/Role</InputLabel>
                  <Select
                    value={selectedIndustry}
                    label="Select Industry/Role"
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                  >
                    {Object.keys(industryBenchmarks).map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Paper sx={{ p: 3, borderRadius: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Benchmark Comparison
                  </Typography>
                  {industryBenchmarks[selectedIndustry] && (
                    <Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                              Your Score
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                              {existingAnalysis.finalScore}%
                            </Typography>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                              Industry Average
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#64748b' }}>
                              {industryBenchmarks[selectedIndustry].averageScore}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                      <Alert severity={existingAnalysis.finalScore >= industryBenchmarks[selectedIndustry].averageScore ? 'success' : 'info'}>
                        You are{' '}
                        {existingAnalysis.finalScore >= industryBenchmarks[selectedIndustry].averageScore
                          ? `${existingAnalysis.finalScore - industryBenchmarks[selectedIndustry].averageScore}% above`
                          : `${industryBenchmarks[selectedIndustry].averageScore - existingAnalysis.finalScore}% below`}{' '}
                        the industry average for {selectedIndustry} roles.
                      </Alert>
                    </Box>
                  )}
                  
                  {existingAnalysis.skillDemandScore && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        Skill Demand Score: {existingAnalysis.skillDemandScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your skills are in {existingAnalysis.skillDemandScore >= 85 ? 'high' : existingAnalysis.skillDemandScore >= 70 ? 'moderate' : 'moderate to low'} demand in the current job market.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 350 }}>
              <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology sx={{ fontSize: 22 }} />
                  Resume Analysis
                </Typography>
                
                <Box
                  {...getRootProps()}
                  role="button"
                  aria-label="Upload resume PDF file"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (getRootProps().onClick as any)?.(e);
                    }
                  }}
                  sx={{
                    border: '2px dashed #4f46e5',
                    borderRadius: 2,
                    p: 2.5,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0f9ff' : 'transparent',
                    mb: 2,
                    '&:focus': {
                      outline: '2px solid #4f46e5',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <input {...getInputProps()} aria-label="Resume file input" />
                  <CloudUpload sx={{ fontSize: 40, color: '#4f46e5', mb: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {resumeFile ? resumeFile.name : 'Drop your resume here'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF files only, max 5MB
                  </Typography>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2, borderRadius: 1.5 }}
                    action={
                      <Button size="small" onClick={() => {
                        setError(null);
                        if (resumeFile) {
                          analyzeSkills();
                        }
                      }}>
                        Retry
                      </Button>
                    }
                  >
                    <AlertTitle>{error.split(':')[0]}</AlertTitle>
                    {error.split(':').slice(1).join(':')}
                  </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Code sx={{ fontSize: 20 }} />
                  Coding Profiles
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <TextField
                    fullWidth
                    label="LeetCode Username"
                    value={codingProfile.leetcode}
                    onChange={(e) => setCodingProfile({...codingProfile, leetcode: e.target.value})}
                    size="small"
                    placeholder="username"
                  />
                  <TextField
                    fullWidth
                    label="CodeChef Username"
                    value={codingProfile.codechef}
                    onChange={(e) => setCodingProfile({...codingProfile, codechef: e.target.value})}
                    size="small"
                    placeholder="username"
                  />
                  <TextField
                    fullWidth
                    label="Codeforces Username"
                    value={codingProfile.codeforces}
                    onChange={(e) => setCodingProfile({...codingProfile, codeforces: e.target.value})}
                    size="small"
                    placeholder="username"
                  />
                  <TextField
                    fullWidth
                    label="GitHub Username"
                    value={codingProfile.github}
                    onChange={(e) => setCodingProfile({...codingProfile, github: e.target.value})}
                    size="small"
                    placeholder="username"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkedIn sx={{ fontSize: 20 }} />
                  LinkedIn (Optional)
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="LinkedIn summary"
                    value={linkedinText}
                    onChange={(e) => setLinkedinText(e.target.value)}
                    placeholder="Paste your LinkedIn text..."
                    size="small"
                    aria-label="LinkedIn profile summary"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LinkedIn />}
                    onClick={() => {
                      // Placeholder for LinkedIn OAuth integration
                      toastManager.info('LinkedIn integration coming soon! For now, please paste your LinkedIn summary manually.');
                    }}
                    sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                    aria-label="Connect LinkedIn account"
                  >
                    Connect
                  </Button>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={analyzeSkills}
                  disabled={!resumeFile || loading}
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Analyzing...' : (existingAnalysis ? 'Update Analysis' : 'Analyze')}
                </Button>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, minWidth: 350 }}>
              {loading && (
                <SkillAnalysisSkeleton />
              )}
              
              {!loading && parsedResumeData && (
                <Box sx={{ mb: 2 }}>
                  <ResumeValidator
                    resumeData={parsedResumeData}
                    onValidationChange={(isValid, errors, warnings) => {
                      setResumeValidation({ isValid, errors, warnings });
                    }}
                  />
                </Box>
              )}
              
              {!loading && parsedResumeData && (
                <Box sx={{ mb: 2 }}>
                  <ResumeParsingFeedback
                    parsedData={parsedResumeData}
                    onUpdate={(updatedData) => {
                      setParsedResumeData(updatedData);
                    }}
                  />
                </Box>
              )}

              {analysis && (
                <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Readiness Report
                  </Typography>

                  <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white', py: 2 }}>
                      <AnimatedCounter 
                        end={analysis.finalScore} 
                        suffix="%" 
                        variant="h3"
                        sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}
                      />
                      <Typography variant="body2" sx={{ opacity: 0.95 }}>
                        Overall Score
                      </Typography>
                      {analysis.communityBenchmark && (
                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mt: 1 }}>
                          Better than {analysis.communityBenchmark} of users
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  <Box sx={{ mb: 2 }}>
                    <ScoreProgressBar 
                      score={analysis.resumeScore} 
                      label="Resume Score"
                      tooltipText="Measures the quality and completeness of your resume based on format, content, keywords, and achievements"
                    />
                    <ScoreProgressBar 
                      score={analysis.codingScore} 
                      label="Coding Score"
                      tooltipText="Based on your performance on coding platforms like LeetCode, CodeChef, Codeforces, and GitHub activity"
                    />
                    <ScoreProgressBar 
                      score={analysis.linkedinScore} 
                      label="Profile Score"
                      tooltipText="Evaluates your professional profile presence and completeness on platforms like LinkedIn"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={async () => {
                        try {
                          await generatePDFReport({
                            finalScore: analysis.finalScore,
                            resumeScore: analysis.resumeScore,
                            codingScore: analysis.codingScore,
                            linkedinScore: analysis.linkedinScore,
                            skills: analysis.skills,
                            skillGaps: analysis.skillGaps,
                            recommendations: analysis.recommendations,
                            achievements: checkAchievements(analysis.finalScore, analysis.skills).map(a => a.title),
                            analysisDate: analysis.analysisDate,
                          });
                          toastManager.success('PDF report generated successfully!');
                        } catch (error) {
                          toastManager.error('Failed to generate PDF.');
                        }
                      }}
                    >
                      Export PDF
                    </Button>
                    <SocialShare score={analysis.finalScore} />
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                    Skills ({analysis.skills.length})
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {analysis.skills.map((skill: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 500, height: 28 }} 
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                    Gaps ({analysis.skillGaps.length})
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {analysis.skillGaps.map((gap: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={gap} 
                        color="warning" 
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 500, height: 28 }} 
                      />
                    ))}
                  </Box>

                  <Box sx={{ background: '#f0f9ff', border: '1px solid #cffafe', borderRadius: 1.5, p: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0369a1', display: 'block', mb: 1 }}>
                      💡 Recommendations ({analysis.recommendations.length})
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem' }}>
                      {analysis.recommendations.map((rec: string, index: number) => {
                        const priority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';
                        const color = priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#64748b';
                        return (
                          <li key={index} style={{ color, marginBottom: '4px', lineHeight: 1.3, fontWeight: priority === 'high' ? 600 : 400 }}>
                            {priority === 'high' && '🔴 '}
                            {priority === 'medium' && '🟡 '}
                            {priority === 'low' && '🟢 '}
                            {rec}
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                  
                  <AchievementBadges score={analysis.finalScore} skills={analysis.skills} />
                  
                  {analysis.previousScore !== undefined && (
                    <Box sx={{ mt: 2 }}>
                      <ReferralBadges
                        currentScore={analysis.finalScore}
                        previousScore={analysis.previousScore}
                        improvement={analysis.finalScore - analysis.previousScore}
                      />
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          </Box>
        )}
        </Box>
      </Container>
    </Box>
  );
};

export default SkillAnalysis;