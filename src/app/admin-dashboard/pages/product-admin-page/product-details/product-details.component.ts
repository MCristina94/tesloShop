import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from '../../../../products/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  fb = inject(FormBuilder);
  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
    tags: [''],
  });

  onSubmit() {
    console.log(this.productForm.value);
  }

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeChange(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }
}
