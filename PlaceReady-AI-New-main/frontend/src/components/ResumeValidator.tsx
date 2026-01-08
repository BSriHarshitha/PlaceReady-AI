import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

interface ValidationRule {
  id: string;
  name: string;
  severity: 'error' | 'warning' | 'info';
  check: (data: any) => boolean;
  message: string;
}

interface ResumeValidatorProps {
  resumeData: any;
  onValidationChange?: (isValid: boolean, errors: string[], warnings: string[]) => void;
}

const validationRules: ValidationRule[] = [
  {
    id: 'has-name',
    name: 'Name Present',
    severity: 'error',
    check: (data) => !!data.name && data.name.trim().length > 0,
    message: 'Resume should include your full name',
  },
  {
    id: 'has-email',
    name: 'Email Present',
    severity: 'error',
    check: (data) => !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
    message: 'Resume should include a valid email address',
  },
  {
    id: 'has-skills',
    name: 'Skills Listed',
    severity: 'error',
    check: (data) => !!(data.skills && data.skills.length >= 5),
    message: 'Resume should list at least 5 skills',
  },
  {
    id: 'has-experience',
    name: 'Experience Section',
    severity: 'warning',
    check: (data) => !!data.experience || (data.projects && data.projects.length > 0),
    message: 'Consider adding work experience or projects',
  },
  {
    id: 'has-education',
    name: 'Education Section',
    severity: 'warning',
    check: (data) => !!data.education && data.education.length > 0,
    message: 'Consider adding education details',
  },
  {
    id: 'has-projects',
    name: 'Projects Listed',
    severity: 'warning',
    check: (data) => !!(data.projects && data.projects.length >= 2),
    message: 'Consider listing at least 2 projects',
  },
  {
    id: 'has-quantifiable',
    name: 'Quantifiable Achievements',
    severity: 'info',
    check: (data) => {
      const text = JSON.stringify(data).toLowerCase();
      return /\d+/.test(text);
    },
    message: 'Include numbers and metrics to show impact',
  },
  {
    id: 'has-keywords',
    name: 'Relevant Keywords',
    severity: 'info',
    check: (data) => {
      const skills = data.skills || [];
      const keywords = ['javascript', 'python', 'java', 'react', 'node', 'aws', 'docker'];
      return skills.some((skill: string) =>
        keywords.some((keyword) => skill.toLowerCase().includes(keyword))
      );
    },
    message: 'Good use of industry-relevant keywords',
  },
];

export const ResumeValidator: React.FC<ResumeValidatorProps> = ({
  resumeData,
  onValidationChange,
}) => {
  const [results, setResults] = useState<Array<{ rule: ValidationRule; passed: boolean }>>([]);

  useEffect(() => {
    if (!resumeData) return;

    const validationResults = validationRules.map((rule) => ({
      rule,
      passed: rule.check(resumeData),
    }));

    setResults(validationResults);

    const errors = validationResults
      .filter((r) => !r.passed && r.rule.severity === 'error')
      .map((r) => r.rule.message);
    const warnings = validationResults
      .filter((r) => !r.passed && r.rule.severity === 'warning')
      .map((r) => r.rule.message);

    if (onValidationChange) {
      onValidationChange(errors.length === 0, errors, warnings);
    }
  }, [resumeData, onValidationChange]);

  if (!resumeData) return null;

  const errors = results.filter((r) => !r.passed && r.rule.severity === 'error');
  const warnings = results.filter((r) => !r.passed && r.rule.severity === 'warning');
  const info = results.filter((r) => !r.passed && r.rule.severity === 'info');
  const passed = results.filter((r) => r.passed);

  const score = Math.round((passed.length / validationRules.length) * 100);

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      default:
        return <Info color="info" />;
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Resume Validation
        </Typography>
        <Chip
          label={`${score}% Complete`}
          color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}
          sx={{ fontWeight: 700 }}
        />
      </Box>

      <LinearProgress
        variant="determinate"
        value={score}
        sx={{ mb: 2, height: 8, borderRadius: 4 }}
        color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}
      />

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Required Fields Missing</AlertTitle>
          <List dense>
            {errors.map((error, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{getIcon('error')}</ListItemIcon>
                <ListItemText primary={error.rule.message} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Recommendations</AlertTitle>
          <List dense>
            {warnings.map((warning, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{getIcon('warning')}</ListItemIcon>
                <ListItemText primary={warning.rule.message} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {info.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Tips</AlertTitle>
          <List dense>
            {info.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{getIcon('info')}</ListItemIcon>
                <ListItemText primary={item.rule.message} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {passed.length > 0 && (
        <Alert severity="success">
          <AlertTitle>Passed Checks ({passed.length})</AlertTitle>
          <List dense>
            {passed.slice(0, 3).map((item, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary={item.rule.name} />
              </ListItem>
            ))}
            {passed.length > 3 && (
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary={`...and ${passed.length - 3} more`} />
              </ListItem>
            )}
          </List>
        </Alert>
      )}
    </Paper>
  );
};

