import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = []; //products array from http://localhost:8080/api/products
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;

  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(){
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  private handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    //searching for products with keyword
    this.productService.searchProducts(theKeyword)
      .subscribe(data => {
        this.products = data;
      })
  }



  handleListProducts() {
    //check if 'id' param is available
    //        'use activated route'.'current state of route'.'map of all route params'.'read the id param'
    //routerLink="/category/1"   same as {path:'category/:id'}
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')
    if (hasCategoryId) {
      //get 'id' string & convert to number using "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books'; //adding this so it displays Books as default
    }

    //check if we have diff category than previous
    //angular reuse a component if it's currently being used
    //if diff category, then reset thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //pageNumber - 1 because angular pagination is 1 based, while Spring is 0 based
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());

    //assign results to Product[]
    // this.productService.getProductList(this.currentCategoryId)
    //   .subscribe(data => {
    //     this.products = data
    //   })
  }
    processResult() {
      return data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number+1; //backend is 0 based, sending from back to front, must add 1
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
    }

  }

}
