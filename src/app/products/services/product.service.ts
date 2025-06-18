import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>(); //esto es para el cache
  private productCache = new Map<string, Product>(); //esto es para el cache

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`; //esto es para el cache
    if (this.productsCache.has(key)) {
      //esto es para el cache
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp)) //esto es para el cache
      );
  }
  getProductById(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${idSlug}`).pipe(
      //esto es para el cache
      tap((product) => this.productCache.set(idSlug, product))
    ); //esto es para el cache
  }

  getProductByOnlyId(id: string): Observable<Product> {
    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${id}`).pipe(
      //esto es para el cache
      tap((product) => this.productCache.set(id, product))
    ); //esto es para el cache
  }
}
