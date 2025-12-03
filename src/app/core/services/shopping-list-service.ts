// src/app/core/services/shopping-list-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InventoryService } from './inventory-service';
import { ExpensesService, Expense } from './expenses-service';

export interface ShoppingListItem {
  name: string;
  qty: number;
  checked: boolean;
  unit?: string;
  expiry?: string;
  price?: number;
}


export interface ShoppingList {
  id: string;
  householdId: string;
  createdBy: string;
  createdAt: string;
  items: ShoppingListItem[];
}

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private api = 'http://localhost:3000/shoppingLists';

  constructor(
    private http: HttpClient,
    private inventoryService: InventoryService,
    private expensesService: ExpensesService
  ) {}

  getList(householdId: string): Promise<ShoppingList | null> {
    return firstValueFrom(this.http.get<ShoppingList[]>(`${this.api}?householdId=${householdId}`))
      .then(lists => lists[0] || null);
  }

  createList(householdId: string, createdBy: string): Promise<ShoppingList> {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      householdId,
      createdBy,
      createdAt: new Date().toISOString(),
      items: []
    };
    return firstValueFrom(this.http.post<ShoppingList>(this.api, newList));
  }

  async addItem(listId: string, item: ShoppingListItem, householdId: string) {
    const list = await this.getListById(listId);
    list.items.push(item);
    await this.updateList(list);

    // Якщо відмічено, додаємо в Inventory
    if (item.checked) {
      await this.inventoryService.addOrUpdateItem(householdId, item.name, item.qty, item.expiry);

      // Якщо вказана ціна — додаємо витрату через ExpensesService
      if (item.price) {
        await this.expensesService.addExpense(item.price * item.qty, householdId, `Покупка: ${item.name}`);
      }
    }
  }

  getListById(id: string): Promise<ShoppingList> {
    return firstValueFrom(this.http.get<ShoppingList>(`${this.api}/${id}`));
  }

  updateList(list: ShoppingList): Promise<any> {
    return firstValueFrom(this.http.put(`${this.api}/${list.id}`, list));
  }

  async toggleItemCompleted(item: ShoppingListItem, list: ShoppingList, householdId: string) {
    item.checked = !item.checked;
    await this.updateList(list);

    if (item.checked) {
      await this.inventoryService.addOrUpdateItem(householdId, item.name, item.qty, item.expiry);
      if (item.price) {
        await this.expensesService.addExpense(item.price * item.qty, householdId, `Покупка: ${item.name}`);
      }
    }
  }
}
