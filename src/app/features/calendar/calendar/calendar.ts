import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FamilyService } from '../../../core/services/family';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CalendarService, CalendarEvent } from '../../../core/services/calendar-event';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule],
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
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

household: any;

  async ngOnInit() {
    const householdId = this.user.householdId;

    this.household = await this.familyService.getHousehold(Number(householdId));
    this.familyMembers = await this.familyService.getMembers(Number(householdId));
    this.events = await this.calendarService.getEvents(householdId);
  }

  get isOwner(): boolean {
    return this.user.id?.toString() === this.household?.ownerId?.toString();
  }


  loadEvents() {
    const data = localStorage.getItem('calendarEvents');
    this.events = data ? JSON.parse(data) : [];
  }

  openAddEventDialog() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: { householdId: this.user.householdId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.calendarService.addEvent(result).then(() => {
          this.loadEvents(); // оновити календар без reload сторінки
        });
      }
    });
  }


  getAssignedNames(ids: string[]): string {
    return ids
      .map(id => this.familyMembers.find(m => m.id.toString() === id.toString())?.name)
      .filter(name => !!name)
      .join(', ');
  }
}