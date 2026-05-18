import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CurrencyPipe } from '@angular/common';
import { OrderItem } from './order-item.model';
import { MatRadioModule } from '@angular/material/radio';
import { ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-item',
  imports: [
    MatExpansionModule,
    CurrencyPipe,
    MatRadioModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  @Input({ required: true }) itemInfo!: OrderItem;
  @Input() isAlt = false;
}
