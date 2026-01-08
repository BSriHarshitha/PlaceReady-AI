// Google Cloud AI Resume Parser
interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
  score: {
    technical: number;
    experience: number;
    education: number;
    overall: number;
  };
  validationPassed: boolean;
  fileType: string;
}

export class GoogleCloudResumeParser {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async parseResume(file: File): Promise<ParsedResumeData> {
    try {
      // Validate file before processing
      await this.validateResumeFile(file);
      
      const base64Data = await this.fileToBase64(file);
      const mockParsedData = await this.mockGoogleCloudParsing(base64Data);
      return mockParsedData;
    } catch (error) {
      console.error('Resume parsing failed:', error);
      throw error;
    }
  }

  private async validateResumeFile(file: File): Promise<void> {
    // Extract text from PDF
    const text = await this.extractTextFromPDF(file);
    
    // Check if file contains resume-like content
    const resumeKeywords = [
      'experience', 'education', 'skills', 'work', 'employment',
      'qualification', 'degree', 'university', 'college', 'project',
      'internship', 'job', 'career', 'professional', 'resume', 'cv'
    ];
    
    const personalInfoKeywords = [
      'email', 'phone', 'mobile', 'address', 'linkedin', 'github'
    ];
    
    const textLower = text.toLowerCase();
    const resumeKeywordCount = resumeKeywords.filter(keyword => 
      textLower.includes(keyword)
    ).length;
    
    const personalInfoCount = personalInfoKeywords.filter(keyword => 
      textLower.includes(keyword)
    ).length;
    
    // Require at least 3 resume keywords and 1 personal info keyword
    if (resumeKeywordCount < 3 || personalInfoCount < 1) {
      throw new Error('This file does not appear to be a valid resume. Please upload a proper resume document.');
    }
    
    // Check minimum content length
    if (text.length < 200) {
      throw new Error('The uploaded file appears to be too short to be a complete resume.');
    }
  }

  private async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = await this.simulateTextExtraction(file.name);
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to extract text from PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private async simulateTextExtraction(fileName: string): Promise<string> {
    // Simulate different file types for validation
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes('invoice') || lowerFileName.includes('bill')) {
      return 'Invoice #12345 Date: 2024-01-01 Amount: $500 Payment due';
    }
    
    if (lowerFileName.includes('report') || lowerFileName.includes('document')) {
      return 'This is a general document with some content but no resume information';
    }
    
    // Simulate valid resume content
    return `
      John Doe
      Email: john.doe@email.com
      Phone: +91-9876543210
      
      EDUCATION
      B.Tech Computer Science Engineering
      ABC University, 2021-2025
      
      EXPERIENCE
      Software Developer Intern
      Tech Company, June 2023 - August 2023
      
      SKILLS
      JavaScript, React, Node.js, Python, SQL
      
      PROJECTS
      E-commerce Website - Built using React and Node.js
    `;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  private async mockGoogleCloudParsing(base64Data: string): Promise<ParsedResumeData> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Additional validation during parsing
    if (!base64Data || base64Data.length < 100) {
      throw new Error('Invalid file content detected');
    }
    
    return {
      personalInfo: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+91-9876543210",
        location: "Bangalore, India"
      },
      skills: [
        "JavaScript", "React", "Node.js", "Python", "SQL", 
        "Git", "AWS", "MongoDB", "TypeScript", "Express.js"
      ],
      experience: [
        {
          company: "Tech Solutions Inc.",
          position: "Software Developer Intern",
          duration: "Jun 2023 - Aug 2023",
          description: "Developed web applications using React and Node.js"
        }
      ],
      education: [
        {
          institution: "ABC Engineering College",
          degree: "B.Tech Computer Science",
          year: "2021-2025"
        }
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Full-stack web application with payment integration",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"]
        }
      ],
      certifications: [
        "AWS Cloud Practitioner",
        "Google Analytics Certified"
      ],
      score: {
        technical: Math.floor(Math.random() * 30) + 70,
        experience: Math.floor(Math.random() * 40) + 40,
        education: Math.floor(Math.random() * 20) + 75,
        overall: Math.floor(Math.random() * 25) + 70
      },
      validationPassed: true,
      fileType: 'resume'
    };
  }
}

export const resumeParser = new GoogleCloudResumeParser('');