import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../../services/apiRoutes.service';

@Component({
  selector: 'app-profile-image-uploader',
  templateUrl: './profile-image-uploader.component.html',
  styleUrls: ['./profile-image-uploader.component.scss'],
})
export class ProfileImageUploaderComponent {
  profileImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  @Output() closeModal = new EventEmitter<void>();

  private readonly FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB in bytes
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

  constructor(private toastr: ToastrService, private apiService: APIRoutesService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > this.FILE_SIZE_LIMIT) {
        this.toastr.warning('File size exceeds 2MB limit. Please select a smaller file.');
        this.onRemove();
        return;
      }

      // Check file type
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.toastr.warning('Invalid file type. Please select a JPEG or PNG image.');
        this.onRemove();
        return;
      }

      this.file = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profileImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onChange() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    } else {
      this.toastr.error('File input element not found.');
    }
  }

  onSubmit() {
    if (this.file) {
      const formData = new FormData();
      formData.append('profileImage', this.file);

      this.apiService.uploadProfilePicture(formData).subscribe((response) => {
          this.toastr.success(response.message);
          setTimeout(() => this.close(), 1500);
        }, (error) => {
          this.toastr.error('Failed to upload image. Please try again.');
        }
      );
    } else {
      this.toastr.warning('No image selected. Please choose an image to upload.');
    }
  }

  onRemove() {
    this.profileImage = null;
    this.file = null;
  }

  close(): void {
    this.closeModal.emit();
  }
}
