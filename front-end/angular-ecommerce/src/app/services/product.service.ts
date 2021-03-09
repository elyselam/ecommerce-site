import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Product} from "../common/product";
import {map} from "rxjs/operators";

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

  getProductList(theCategoryId: number): Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;


    return this.httpClient.get<GetResponse>(searchUrl)
      .pipe(map(response => response._embedded.products)
    );
  }
}
