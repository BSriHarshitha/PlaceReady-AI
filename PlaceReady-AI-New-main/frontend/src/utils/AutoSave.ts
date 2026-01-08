// Auto-save drafts functionality
export interface DraftData {
  resumeFile?: string; // Base64 or file reference
  codingProfile: {
    leetcode: string;
    codechef: string;
    codeforces: string;
    github: string;
  };
  linkedinText: string;
  timestamp: string;
}

const DRAFT_KEY_PREFIX = 'analysis_draft_';
const DRAFT_AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export class AutoSaveManager {
  private userId: string;
  private saveTimer?: NodeJS.Timeout;
  private lastSaved: Date | null = null;

  constructor(userId: string) {
    this.userId = userId;
  }

  startAutoSave(onSave: () => DraftData | null) {
    // Clear existing timer
    this.stopAutoSave();

    // Auto-save every 30 seconds
    this.saveTimer = setInterval(() => {
      const draftData = onSave();
      if (draftData) {
        this.saveDraft(draftData);
      }
    }, DRAFT_AUTO_SAVE_INTERVAL);
  }

  stopAutoSave() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = undefined;
    }
  }

  saveDraft(data: DraftData) {
    try {
      const draftKey = `${DRAFT_KEY_PREFIX}${this.userId}`;
      const draftWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftWithTimestamp));
      this.lastSaved = new Date();
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  loadDraft(): DraftData | null {
    try {
      const draftKey = `${DRAFT_KEY_PREFIX}${this.userId}`;
      const draftJson = localStorage.getItem(draftKey);
      if (!draftJson) return null;

      const draft = JSON.parse(draftJson);
      
      // Check if draft is too old (older than 7 days)
      const draftDate = new Date(draft.timestamp);
      const daysSinceDraft = (Date.now() - draftDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDraft > 7) {
        this.clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }

  clearDraft() {
    try {
      const draftKey = `${DRAFT_KEY_PREFIX}${this.userId}`;
      localStorage.removeItem(draftKey);
      return true;
    } catch (error) {
      console.error('Error clearing draft:', error);
      return false;
    }
  }

  getLastSaved(): Date | null {
    return this.lastSaved;
  }

  hasDraft(): boolean {
    return this.loadDraft() !== null;
  }
}

