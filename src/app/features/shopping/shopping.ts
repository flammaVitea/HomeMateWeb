import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { InventoryService, InventoryItem } from '../../core/services/inventory-service';
import { ShoppingListService, ShoppingList, ShoppingListItem } from '../../core/services/shopping-list-service';
import { ExpensesService } from '../../core/services/expenses-service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './shopping.html',
  styleUrls: ['./shopping.scss']
})
export class ShoppingComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') || '{}');

  inventory: InventoryItem[] = [];

  shoppingList: ShoppingList = {
    id: '',
    householdId: '',
    createdBy: '',
    createdAt: '',
    items: []
  };

  newItemName = '';
  newItemQty: number = 1;
  newItemExpiry = '';
  newItemPrice: number | null = null;
  newItemUnit = 'pcs';

  inventoryColumns = ['name', 'quantity', 'unit', 'expiry', 'edit', 'remove'];
  shoppingColumns = ['checked', 'name', 'qty', 'unit', 'expiry', 'price', 'add', 'remove'];

  constructor(
    private inventoryService: InventoryService,
    private shoppingService: ShoppingListService,
    private expensesService: ExpensesService
  ) {}

  async ngOnInit() {
    const householdId = this.user.householdId;

    this.inventory = await this.inventoryService.getInventory(householdId);

    const list = await this.shoppingService.getList(householdId);
    if (list) {
      this.shoppingList = list;
    } else {
      this.shoppingList = await this.shoppingService.createList(householdId, this.user.id);
    }
  }



  async toggleItem(item: ShoppingListItem) {
    await this.shoppingService.toggleItemCompleted(item, this.shoppingList, this.user.householdId);
  }

  async removeItem(index: number) {
    if (!this.shoppingList) return;

    this.shoppingList.items.splice(index, 1);

    // обновлення UI
    this.shoppingList.items = [...this.shoppingList.items];

    await this.shoppingService.updateList(this.shoppingList);
  }

  async updateInventoryItem(item: InventoryItem) {
    await this.inventoryService.updateItem(item);
    alert(`Збережено: ${item.name}`);
  }
  
  async addShoppingItem() {
    if (!this.newItemName || !this.newItemQty) return;

    const item: ShoppingListItem = {
      name: this.newItemName,
      qty: this.newItemQty,
      unit: this.newItemUnit,
      checked: false,
      expiry: this.newItemExpiry || undefined,
      price: this.newItemPrice || undefined
    };

    // Додаємо у backend список покупок
    await this.shoppingService.addItem(this.shoppingList!.id, item, this.user.householdId);

    // Оновлюємо локальний список на сторінці
    this.shoppingList!.items.push(item);

    // Очищуємо форму
    this.newItemName = '';
    this.newItemQty = 1;
    this.newItemUnit = 'pcs';
    this.newItemExpiry = '';
    this.newItemPrice = null;
  }

  // Додавання елемента у інвентар + витрати
  async addToInventory(item: ShoppingListItem) {
    if (!this.shoppingList) return;

    // Додаємо або оновлюємо інвентар
    await this.inventoryService.addOrUpdateItem(
      this.user.householdId,
      item.name,
      item.qty,
      item.expiry,
      item.unit
    );

    // Якщо ціна вказана — додаємо витрату
    if (item.price) {
      await this.expensesService.addExpense(
        item.price * item.qty,
        this.user.householdId,
        `Покупка: ${item.name}`
      );
    }

    // Позначаємо як виконане
    item.checked = true;
    await this.shoppingService.updateList(this.shoppingList);

    // Локально одразу оновлюємо таблицю
    const index = this.shoppingList.items.findIndex(i => i.name === item.name && i.qty === item.qty);
    if (index >= 0) this.shoppingList.items[index] = item;
  }

  async removeInventoryItem(item: InventoryItem) {
    if (!confirm(`Видалити ${item.name}?`)) return;

    await this.inventoryService.deleteItem(item.id);

    this.inventory = this.inventory.filter(i => i.id !== item.id);
  }
}
