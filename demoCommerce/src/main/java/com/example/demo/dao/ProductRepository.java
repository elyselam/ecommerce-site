package com.example.demo.dao;

import com.example.demo.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    //behind the scene, Spring will execute a query similar to "select * from product where category_id=?"
    //spring data Rest will automatically exposes endpoint localhost:8080/api/products/search/findByCategoryId?id=#
    //Page: sublist of a list of objects, has info like totalElements, totalPages, currentPosition, ...
    //Pageable: pagination info: pageNumber, pageSize, previous, next, ...
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);


    //select * from product
    //where name like concat('%', :name, '%')
    //http://localhost:8080/api/products/search/findByNameContaining?name=python <=test by changing name in url
    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
}
