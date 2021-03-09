import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  listProducts(){
    //check if 'id' param is available
    //                      'use activated route'.'current state of route'.'map of all route params'.'read the id param'
    //routerLink="/category/1"   same as {path:'category/:id'}
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if (hasCategoryId){
      //get 'id' string & convert to number using "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }
    // //assign results to Product[]
    // this.productService.getProductList()
    //   .subscribe(data => {
    //     this.products = data
    //   })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> {
      this.listProducts()
    })
  }


}