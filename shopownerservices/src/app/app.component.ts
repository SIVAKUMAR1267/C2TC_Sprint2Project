import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerService } from './owner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  owners: any[] = [];
  ownerForm!: FormGroup;
  isEditMode = false;
  selectedId: number | null = null;
  loading = false;

  constructor(
    private ownerService: OwnerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadOwners();
  }

  initializeForm(): void {
    this.ownerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      shopName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      contactInfo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$|^[^\s@]+@[^\s@]+\.[^\s@]+$/)]]
    });
  }

  loadOwners(): void {
    this.loading = true;
    this.ownerService.getOwners().subscribe({
      next: (data) => {
        this.owners = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading owners:', err);
        this.toastr.error('Failed to load shop owners', 'Error');
        this.loading = false;
      }
    });
  }

  saveOwner(): void {
    if (!this.ownerForm.valid) {
      this.toastr.warning('Please fill in all required fields correctly', 'Validation Error');
      this.markFormGroupTouched(this.ownerForm);
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.selectedId !== null) {
      this.ownerService.updateOwner(this.selectedId, this.ownerForm.value).subscribe({
        next: () => {
          this.toastr.success('Shop owner updated successfully!', 'Success');
          this.resetForm();
          this.loadOwners();
        },
        error: (err) => {
          console.error('Error updating owner', err);
          this.toastr.error('Failed to update shop owner', 'Error');
          this.loading = false;
        }
      });
    } else {
      this.ownerService.registerOwner(this.ownerForm.value).subscribe({
        next: () => {
          this.toastr.success('Shop owner added successfully!', 'Success');
          this.resetForm();
          this.loadOwners();
        },
        error: (err) => {
          console.error('Error creating owner', err);
          this.toastr.error('Failed to add shop owner', 'Error');
          this.loading = false;
        }
      });
    }
  }

  editOwner(owner: any): void {
    this.ownerForm.patchValue(owner);
    this.selectedId = owner.id;
    this.isEditMode = true;
  }

  deleteOwner(id: number): void {
    if (confirm('Are you sure you want to delete this owner?')) {
      this.loading = true;
      this.ownerService.deleteOwner(id).subscribe({
        next: () => {
          this.toastr.success('Shop owner deleted successfully!', 'Success');
          this.loadOwners();
        },
        error: (err) => {
          console.error('Error deleting owner', err);
          this.toastr.error('Failed to delete shop owner', 'Error');
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.ownerForm.reset();
    this.selectedId = null;
    this.isEditMode = false;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() {
    return this.ownerForm.get('name');
  }

  get shopName() {
    return this.ownerForm.get('shopName');
  }

  get contactInfo() {
    return this.ownerForm.get('contactInfo');
  }
}
