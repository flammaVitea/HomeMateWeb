import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FamilyService } from '../../../core/services/family';
import { CalendarService, CalendarEvent } from '../../../core/services/calendar-event';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class CalendarComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user') || '{}');
  familyMembers: { id: string; name: string }[] = [];
  events: CalendarEvent[] = [];
  displayedColumns = ['title', 'date', 'description', 'assigned'];

  constructor(
    private familyService: FamilyService,
    private calendarService: CalendarService
  ) {}

  async ngOnInit() {
    const householdId = this.user.householdId;

    this.familyMembers = await this.familyService.getMembers(Number(householdId));
    this.events = await this.calendarService.getEvents(householdId);
  }

  getAssignedNames(ids: string[]): string {
    return ids
      .map(id => this.familyMembers.find(m => m.id.toString() === id.toString())?.name)
      .filter(name => !!name)
      .join(', ');
  }
}