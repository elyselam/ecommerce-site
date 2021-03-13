import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

interface GetResponseProducts {
  //unwrap json from Spring Data Rest _embedded entry
  _embedded: {
    products: Product[];
  }
}
interface GetResponseProductCategory {
  //unwrap json from Spring Data Rest _embedded entry
  _embedded: {
    productCategory: ProductCategory[];
  }
}
@Injectable({
  providedIn: 'root'
})
//make get request to backend, unwrap, make available as array of products
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(map(response => response._embedded.products)
    );
  }


  getProductCategories(): Observable<ProductCategory[]> {
      //calls rest api. maps json data object from Spring Data Rest to ProductCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map(response => response._embedded.productCategory)
    );
  }
}
