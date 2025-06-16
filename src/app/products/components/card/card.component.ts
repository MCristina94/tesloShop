import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterModule, SlicePipe, ProductImagePipe],
  templateUrl: './card.component.html',
})
export class CardComponent {
  product = input.required<Product>();
}
