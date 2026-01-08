import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import { ExpandMore, Edit, Check, Close } from '@mui/icons-material';

interface ParsedData {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience?: string;
  education?: string[];
  projects?: string[];
}

interface ResumeParsingFeedbackProps {
  parsedData: ParsedData;
  onUpdate: (updatedData: ParsedData) => void;
}

export const ResumeParsingFeedback: React.FC<ResumeParsingFeedbackProps> = ({
  parsedData,
  onUpdate,
}) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<ParsedData>(parsedData);
  const [tempValue, setTempValue] = useState<string>('');

  const handleEdit = (field: string, currentValue: any) => {
    setEditing(field);
    if (Array.isArray(currentValue)) {
      setTempValue(currentValue.join(', '));
    } else {
      setTempValue(currentValue || '');
    }
  };

  const handleSave = (field: string) => {
    const updated = { ...editedData };
    if (field === 'skills') {
      updated.skills = tempValue.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      (updated as any)[field] = tempValue;
    }
    setEditedData(updated);
    onUpdate(updated);
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setTempValue('');
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Resume Parsing Feedback
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review what was extracted from your resume. Click edit to make corrections.
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Contact Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['name', 'email', 'phone'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, textTransform: 'capitalize' }}>
                  {field}:
                </Typography>
                {editing === field ? (
                  <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                    <TextField
                      size="small"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      fullWidth
                    />
                    <IconButton size="small" onClick={() => handleSave(field)} color="primary">
                      <Check />
                    </IconButton>
                    <IconButton size="small" onClick={handleCancel}>
                      <Close />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {(editedData as any)[field] || 'Not found'}
                    </Typography>
                    <IconButton size="small" onClick={() => handleEdit(field, (editedData as any)[field])}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Skills ({editedData.skills.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editing === 'skills' ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Enter skills separated by commas"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" onClick={() => handleSave('skills')}>
                  Save
                </Button>
                <Button size="small" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {editedData.skills.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" />
                ))}
              </Box>
              <Button size="small" startIcon={<Edit />} onClick={() => handleEdit('skills', editedData.skills)}>
                Edit Skills
              </Button>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {editedData.experience && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Experience
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {editing === 'experience' ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="contained" onClick={() => handleSave('experience')}>
                    Save
                  </Button>
                  <Button size="small" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2">{editedData.experience}</Typography>
                <Button size="small" startIcon={<Edit />} onClick={() => handleEdit('experience', editedData.experience)} sx={{ mt: 1 }}>
                  Edit
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

