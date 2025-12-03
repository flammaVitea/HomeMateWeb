// src/app/core/services/calendar-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  householdId: string;
  assignedTo: string[];
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private api = 'http://localhost:3000/calendarEvents';

  constructor(private http: HttpClient) {}

  getEvents(householdId: string): Promise<CalendarEvent[]> {
    return firstValueFrom(
      this.http.get<CalendarEvent[]>(`${this.api}?householdId=${householdId}`)
    );
  }

  addEvent(event: CalendarEvent) {
    return firstValueFrom(this.http.post<CalendarEvent>(this.api, event));
  }

  updateEvent(event: CalendarEvent) {
    return firstValueFrom(this.http.put<CalendarEvent>(`${this.api}/${event.id}`, event));
  }

  deleteEvent(eventId: string) {
    return firstValueFrom(this.http.delete(`${this.api}/${eventId}`));
  }
}