import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { CalendarService } from '../../../core/services/calendar-event';
import { FamilyService } from '../../../core/services/family';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  templateUrl: './add-event-dialog.html',
  styleUrls: ['./add-event-dialog.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class AddEventDialogComponent {

  event: any; // ця подія буде або нова, або існуюча

  members: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private calendarService: CalendarService,
    private familyService: FamilyService
  ) {
    // Якщо передана подія - редагування, інакше створення нової
    this.event = data.event ? { ...data.event } : {
      title: '',
      date: '',
      description: '',
      assignedTo: [],
      householdId: data.householdId
    };
  }

  async ngOnInit() {
    this.members = await this.familyService.getMembers(this.data.householdId);
  }

  async save() {
    if (this.event.id) {
      // редагування існуючої події
      await this.calendarService.updateEvent(this.event);
    } else {
      // створення нової
      this.event.id = crypto.randomUUID();
      this.event.householdId = this.data.householdId; // додали householdId
      await this.calendarService.addEvent(this.event);
    }

    this.dialogRef.close(true);
  }


  async close() {
    this.dialogRef.close();
  }
}
