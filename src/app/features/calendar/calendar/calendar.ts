import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FamilyService } from '../../../core/services/family';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { CalendarService, CalendarEvent } from '../../../core/services/calendar-event';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class CalendarComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user') || '{}');
  familyMembers: { id: string; name: string }[] = [];
  events: CalendarEvent[] = [];
  displayedColumns: string[] = [];


  constructor(
    private familyService: FamilyService,
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

household: any;

async ngOnInit() {
  console.log("Loaded user:", this.user);

  if (!this.user || !this.user.householdId) {
    console.error("householdId not found in user!");
    return;
  }

  console.log("USER FROM LOCALSTORAGE:", this.user);
  console.log("householdId:", this.user.householdId);


  const householdId = this.user?.householdId;

  if (!householdId) {
    console.error("householdId is missing!");
    return;
  }

  this.household = await this.familyService.getHousehold(householdId);
  this.familyMembers = await this.familyService.getMembers(householdId);
  this.events = await this.calendarService.getEvents(householdId);

  this.displayedColumns = this.isOwner
    ? ['title', 'date', 'description', 'assigned', 'actions']
    : ['title', 'date', 'description', 'assigned'];
}


  get isOwner(): boolean {
    return this.user.id?.toString() === this.household?.ownerId?.toString();
  }


  loadEvents() {
    const data = localStorage.getItem('calendarEvents');
    this.events = data ? JSON.parse(data) : [];
  }

  openAddEventDialog(event?: CalendarEvent) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: { 
        householdId: this.user.householdId,
        event // передаємо подію для редагування, або undefined для нової
      }
    });

    // Після закриття діалогу
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        // перезавантажуємо події з сервісу
        this.events = await this.calendarService.getEvents(this.user.householdId);
      }
    });
  }

  editEvent(event: CalendarEvent) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: { 
        householdId: this.user.householdId,
        event // передаємо подію для редагування
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        // Оновлюємо події після редагування
        this.events = await this.calendarService.getEvents(this.user.householdId);
      }
    });
  }


  deleteEvent(event: CalendarEvent) {
    if (confirm("Видалити подію?")) {
      this.calendarService.deleteEvent(event.id).then(async () => {
        this.events = await this.calendarService.getEvents(this.user.householdId);
      });
    }
  }


  getAssignedNames(ids: string[]): string {
    return ids
      .map(id => this.familyMembers.find(m => m.id.toString() === id.toString())?.name)
      .filter(name => !!name)
      .join(', ');
  }
}