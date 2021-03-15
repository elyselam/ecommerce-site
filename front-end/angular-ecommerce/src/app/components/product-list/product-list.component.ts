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

  products: Product[]; //products array from http://localhost:8080/api/products
  currentCategoryId: number;
  currentCategoryName: string;

  searchMode: boolean;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
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
    //assign results to Product[]
    this.productService.getProductList(this.currentCategoryId)
      .subscribe(data => {
        this.products = data
      })

  }

}
