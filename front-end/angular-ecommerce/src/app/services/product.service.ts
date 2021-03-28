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
  //getting products from product-detail
  //build url based on product id at 8080/api/products/${theProductId}
  // http://localhost:4200/products/40   => returns product detail of 1 selection
  getProduct(theProductId: number) {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    //returns an observable
    //no need to unwrap the json bc Spring enables direct access of "id" property in Product class
    return this.httpClient.get<Product>(productUrl);
  }


  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {
    //http://localhost:8080/api/products/?page=0&size=10
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
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


  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword: string): Observable<GetResponseProducts> {
    //http://localhost:8080/api/products/?page=0&size=10
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+ `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(map(response => response._embedded.products));
  }





}
  interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  //Spring Data Rest supports pagination out of the box
  //http://localhost:8080/api/products/?page=0&size=10 scroll to the bottom
  page: {
    size: number, //size of page, in this case: size 10
    totalElements: number, //all 100 items in db
    totalPages: number, // 100/10 = 10 pages
    number: number //current page num
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
