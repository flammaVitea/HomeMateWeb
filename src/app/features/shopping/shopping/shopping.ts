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
import { InventoryService, InventoryItem } from '../../../core/services/inventory-service';
import { ShoppingListService, ShoppingList, ShoppingListItem } from '../../../core/services/shopping-list-service';
import { ExpensesService } from '../../../core/services/expenses-service';

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
    MatCardModule
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

  inventoryColumns = ['name', 'quantity', 'unit', 'expiry', 'edit'];
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

  async addShoppingItem() {
    if (!this.newItemName || !this.newItemQty) return;

    const item: ShoppingListItem = {
      name: this.newItemName,
      qty: this.newItemQty,
      checked: false,
      unit: this.newItemUnit,
      expiry: this.newItemExpiry || undefined,
      price: this.newItemPrice || undefined
    };

    await this.shoppingService.addItem(this.shoppingList.id, item, this.user.householdId);
    this.shoppingList.items.push(item);

    this.newItemName = '';
    this.newItemQty = 1;
    this.newItemUnit = 'pcs';
    this.newItemExpiry = '';
    this.newItemPrice = null;
  }

  async toggleItem(item: ShoppingListItem) {
    await this.shoppingService.toggleItemCompleted(item, this.shoppingList, this.user.householdId);
  }

  async removeItem(index: number) {
    this.shoppingList.items.splice(index, 1);
    await this.shoppingService.updateList(this.shoppingList);
  }


  async updateInventoryItem(item: InventoryItem) {
    await this.inventoryService.updateItem(item);
    alert(`Збережено: ${item.name}`);
  }


  async addToInventory(item: ShoppingListItem) {
    await this.inventoryService.addOrUpdateItem(
      this.user.householdId,
      item.name,
      item.qty,
      item.expiry,
      item.unit
    );

    if (item.price) {
      await this.expensesService.addExpense(
        item.price * item.qty,
        this.user.householdId,
        `Покупка: ${item.name}`
      );
    }

    item.checked = true;
    await this.shoppingService.updateList(this.shoppingList);
  }
}
