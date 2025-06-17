import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/product.service';
import { map } from 'rxjs';
import { CardComponent } from '../../../products/components/card/card.component';

@Component({
  selector: 'app-gender-page',
  imports: [CardComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));
  productsService = inject(ProductsService);

  productsResource = rxResource({
    params: () => ({ gender: this.gender() }),

    stream: ({ params }) => {
      return this.productsService.getProducts({ gender: params.gender });
    },
  });
}
