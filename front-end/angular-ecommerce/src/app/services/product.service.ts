import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
//make get request to backend, unwrap, make available as array of products
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    //calls rest api. maps json data object from Spring Data Rest to ProductCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map(response =>
        response._embedded.productCategory)
      );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    // passing theKeyword value into the name parameter
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    // return this.httpClient.get<GetResponseProducts>(searchUrl)
    //   .pipe(map(response => response._embedded.products));
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(map(response => response._embedded.products));
  }

  //build url based on product id
  // http://localhost:4200/products/40   => returns product detail of 1 selection
  getProduct(theProductId: number) {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

  interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
