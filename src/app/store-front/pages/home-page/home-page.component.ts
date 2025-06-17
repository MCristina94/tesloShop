import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CardComponent } from '@products/components/card/card.component';
import { ProductsService } from '@products/services/product.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Parallax } from 'swiper/modules';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [CardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  //SE MIGRO A UN SERVICE pagination.service.ts

  // ActivatedRoute = inject(ActivatedRoute); //trae toda la informacion de la ruta

  // currentPage = toSignal(
  //   //esta funcion trae la page actual, y sino devuelve un 1
  //   this.ActivatedRoute.queryParamMap.pipe(
  //     map((params) => (params.get('page') ? +params.get('page')! : 1)),
  //     map((page) => (isNaN(page) ? 1 : page))
  //   ),
  //   {
  //     initialValue: 1,
  //   }
  // );

  productsResource = rxResource({
    // 'request' se renombra a 'params'
    params: () => ({ page: this.paginationService.currentPage() - 1 }),

    // 'loader' se renombra a 'stream'.
    // Ya no recibe un objeto { request }, sino directamente los parámetros.
    // Como no hay parámetros, la función no necesita argumentos.
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
      });
    },
  });
}
