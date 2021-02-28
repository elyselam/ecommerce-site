import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, map} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operator";

interface GetResponse {
  //unwrap json from Spring Data Rest _embedded entry
  _embedded: {
    products: Product[];
  }
}

@Injectable({
  providedIn: 'root'
})
//make get request to backend, unwrap, make available as array of products
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  constructor(private httpClient: HttpClient) { }

  getProductList(): Observable<Product[]>{
    return this.httpClient.get<GetResponse>(this.baseUrl)
      .pipe(
        map(response => response._embedded.products)
    );
  }
}
