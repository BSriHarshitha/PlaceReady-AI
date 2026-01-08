export class GoogleCalendarService {
  async init(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async createEvent(eventDetails: any): Promise<any> {
    return Promise.resolve({
      id: 'mock-event-id',
      htmlLink: 'https://calendar.google.com/event/mock',
      ...eventDetails
    });
  }

  async listEvents(): Promise<any[]> {
    return Promise.resolve([
      {
        id: '1',
        summary: 'Mock Interview - Software Engineer',
        start: { dateTime: new Date().toISOString() },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString() }
      }
    ]);
  }
}

export const googleCalendar = new GoogleCalendarService();