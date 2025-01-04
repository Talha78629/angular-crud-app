import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  standalone: false,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshness = ["New", "Second hand", "Refurbished"];
  productForm !: FormGroup;
  actionBtn: string = "Save";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      date: ['', Validators.required]
    });


    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

    console.log(this.editData);
  }

  addProduct() {
    console.log(this.productForm.value);
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert("Product saved successfully");
              this.productForm.reset();
              this.dialogRef.close('Save');
            },
            error: (err) => {
              alert("Error in adding the product");
            }
          });
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Product updated successfully");
          this.productForm.reset();
          this.dialogRef.close("Update");
        },
        error: (err) => {
          alert("Error in updating the product");
        }
      });
  }
}
