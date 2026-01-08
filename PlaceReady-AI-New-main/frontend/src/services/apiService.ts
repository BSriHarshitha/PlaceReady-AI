const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async saveUserProfile(uid: string, profileData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      return await response.json();
    } catch (error) {
      // Fallback to localStorage
      localStorage.setItem(`profile_${uid}`, JSON.stringify(profileData));
      return { success: true };
    }
  }

  async getUserProfile(uid: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}/profile`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      // Fallback to localStorage
      const data = localStorage.getItem(`profile_${uid}`);
      return data ? JSON.parse(data) : null;
    }
  }

  async saveAnalysis(uid: string, analysisData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });
      return await response.json();
    } catch (error) {
      // Fallback to localStorage
      localStorage.setItem(`analysis_${uid}`, JSON.stringify(analysisData));
      return { success: true };
    }
  }

  async getAnalysis(uid: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}/analysis`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      // Fallback to localStorage
      const data = localStorage.getItem(`analysis_${uid}`);
      return data ? JSON.parse(data) : null;
    }
  }

  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      // Fallback to localStorage for demo
      const users = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('profile_')) {
          const uid = key.replace('profile_', '');
          const profile = JSON.parse(localStorage.getItem(key) || '{}');
          const analysisData = localStorage.getItem(`analysis_${uid}`);
          const analysis = analysisData ? JSON.parse(analysisData) : null;
          users.push({ ...profile, analysis });
        }
      }
      return users;
    }
  }
}

export const apiService = new ApiService();