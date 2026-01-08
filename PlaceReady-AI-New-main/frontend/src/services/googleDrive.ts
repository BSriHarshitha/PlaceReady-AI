export class GoogleDriveService {
  async init(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async uploadFile(file: File, folderId?: string): Promise<any> {
    return Promise.resolve({
      id: 'mock-file-id',
      name: file.name,
      webViewLink: 'https://drive.google.com/file/mock',
      size: file.size
    });
  }

  async createFolder(name: string): Promise<any> {
    return Promise.resolve({
      id: 'mock-folder-id',
      name: name,
      webViewLink: 'https://drive.google.com/folder/mock'
    });
  }

  async listFiles(): Promise<any[]> {
    return Promise.resolve([
      {
        id: '1',
        name: 'Resume_Analysis.pdf',
        webViewLink: 'https://drive.google.com/file/mock1'
      }
    ]);
  }
}

export const googleDrive = new GoogleDriveService();