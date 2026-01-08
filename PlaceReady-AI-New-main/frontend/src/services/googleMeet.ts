export class GoogleMeetService {
  async init(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async createMeeting(meetingDetails: any): Promise<any> {
    return Promise.resolve({
      id: 'mock-meeting-id',
      meetingUrl: 'https://meet.google.com/mock-meeting',
      ...meetingDetails
    });
  }

  async scheduleMeeting(title: string, startTime: Date, duration: number): Promise<any> {
    return Promise.resolve({
      id: 'mock-scheduled-meeting',
      title,
      startTime,
      duration,
      meetingUrl: 'https://meet.google.com/scheduled-mock',
      joinUrl: 'https://meet.google.com/join-mock'
    });
  }
}

export const googleMeet = new GoogleMeetService();