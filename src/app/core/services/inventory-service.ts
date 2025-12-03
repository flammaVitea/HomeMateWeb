import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface InventoryItem {
  id: string;
  householdId: string;
  name: string;
  quantity: number;
  unit: string;
  expiry?: string;
  barcode?: string;
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private api = 'http://localhost:3000/inventory';

  constructor(private http: HttpClient) {}

  getInventory(householdId: string): Promise<InventoryItem[]> {
    return firstValueFrom(this.http.get<InventoryItem[]>(`${this.api}?householdId=${householdId}`));
  }

  addItem(item: InventoryItem): Promise<any> {
    return firstValueFrom(this.http.post(this.api, item));
  }

  updateItem(item: InventoryItem): Promise<any> {
    return firstValueFrom(this.http.put(`${this.api}/${item.id}`, item));
  }

  async addOrUpdateItem(householdId: string, name: string, qty: number, expiry?: string, unit = 'pcs'): Promise<any> {
    const items = await this.getInventory(householdId);
    const existing = items.find(i => i.name.toLowerCase() === name.toLowerCase());

    if (existing) {
      existing.quantity += qty;
      existing.expiry = expiry;
      return this.updateItem(existing);
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      householdId,
      name,
      quantity: qty,
      unit,
      expiry
    };

    return firstValueFrom(this.http.post(this.api, newItem));
  }
}
