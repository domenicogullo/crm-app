import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../dto/product.dto';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { CreateDialogComponent } from '../../modals/create-dialog/create-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-product',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-product.component.html',
  styleUrl: './user-product.component.css'
})
export class UserProductComponent implements OnInit{

  products: Product[] = [];
  userId: string = '';
  dataSource = new MatTableDataSource(this.products);

  constructor(
    private productService: ProductService, 
    private dialog: MatDialog, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
      
    if(this.userId){
      this.loadProducts()
    }
  }

  loadProducts(): void {
    this.productService.getProductsByUserId(this.userId).subscribe({
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

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }
}
