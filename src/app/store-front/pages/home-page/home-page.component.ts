import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CardComponent } from '@products/components/card/card.component';
import { ProductsService } from '@products/services/product.service';

@Component({
  selector: 'app-home-page',
  imports: [CardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);

  productsResource = rxResource({
    // 'request' se renombra a 'params'
    params: () => ({}),

    // 'loader' se renombra a 'stream'.
    // Ya no recibe un objeto { request }, sino directamente los parámetros.
    // Como no hay parámetros, la función no necesita argumentos.
    stream: () => {
      return this.productsService.getProducts({});
    },
  });
}
