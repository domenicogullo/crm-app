import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Product } from '../../dto/product.dto';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogComponent } from '../../modals/create-dialog/create-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MaterialModule, RouterLink, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  products: Product[] = []
  dataSource = new MatTableDataSource(this.products);

  constructor(
    private productService: ProductService, 
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.dataSource.data = this.products;
      },
      error: (error) => {
        console.error('Error fetching products', error);
      }
    });
  }

  deleteProduct(productId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.productService.deleteProduct(productId).subscribe(() => {
        this.products = this.products.filter(product => product.id !== productId)
        this.dataSource.data = this.products;
        })
      }
    })
  }

  openCreateDialog(product?: Product): void {
    const dialogRef = this.dialog.open(
      CreateDialogComponent, 
      {width: '500px', height: '450px', data: {product}})

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadProducts();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }
}
