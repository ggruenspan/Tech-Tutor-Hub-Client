import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../../services/apiRoutes.service';
import { LocalStorageService } from '../../../services/localStorage.service';

@Component({
  selector: 'app-profile-image-uploader',
  templateUrl: './profile-image-uploader.component.html',
  styleUrls: ['./profile-image-uploader.component.scss'],
})
export class ProfileImageUploaderComponent {
  profileImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private toastr: ToastrService, private accountService: APIRoutesService, private storageService: LocalStorageService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;

      // Set the file size limit (e.g., 2MB)
      const fileSizeLimit = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > fileSizeLimit) {
        this.toastr.warning('File size exceeds 2MB limit. Please select a smaller file.');
        this.onRemove();
        return;
      }

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
    fileInput.click();
  }

  onSubmit() {
    if (this.file) {
      const formData = new FormData();
      formData.append('profileImage', this.file);

      this.accountService.uploadProfilePicture(formData).subscribe((response) => {
          this.toastr.success(response.message);
          // this.storageService.set('jwtToken', response.token);
          setTimeout(() => {
            this.close();
          }, 1500);
        }, (error) => {
          this.toastr.error(error.error.message);
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
