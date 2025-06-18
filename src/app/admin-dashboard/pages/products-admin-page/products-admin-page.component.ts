import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from '../../../products/components/product-table/product-table.component';
import { ProductsService } from '@products/services/product.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    // 'request' se renombra a 'params'
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
    }),

    // 'loader' se renombra a 'stream'.
    // Ya no recibe un objeto { request }, sino directamente los parámetros.
    // Como no hay parámetros, la función no necesita argumentos.
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
        limit: params.limit,
      });
    },
  });
}
