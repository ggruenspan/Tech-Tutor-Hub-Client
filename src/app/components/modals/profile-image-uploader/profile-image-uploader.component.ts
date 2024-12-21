import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PublicProfileRoutes } from '../../../services/routes/settings/publicProfileRoutes.service';

@Component({
  selector: 'app-profile-image-uploader',
  templateUrl: './profile-image-uploader.component.html',
  styleUrls: ['./profile-image-uploader.component.scss'],
})
export class ProfileImageUploaderComponent implements OnInit {
  profileImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  @Output() closeModal = new EventEmitter<void>();

  private readonly FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB in bytes
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

  constructor(private toastr: ToastrService, private publicProfileRoutes: PublicProfileRoutes) {}

  ngOnInit() {
    this.profileImage = localStorage.getItem('profileImage');
  }

  // Handles the file selection event.
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > this.FILE_SIZE_LIMIT) {
        this.toastr.warning('File size exceeds 2MB limit. Please select a smaller file.');
        return;
      }

      // Check file type
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.toastr.warning('Invalid file type. Please select a JPEG or PNG image.');
        return;
      }

      // Store the file and read its data for preview
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

  // Handles file input
  onChange() {
    const fileInput = document.getElementById('profileImageFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    } else {
      this.toastr.error('File input element not found.');
    }
  }

  // Submit the selected file to the server
  onSubmit() {
    if (this.file) {
      const formData = new FormData();
      formData.append('profileImage', this.file);

      this.publicProfileRoutes.uploadProfilePicture(formData).subscribe((response) => {
          this.publicProfileRoutes.getProfileImage().subscribe(() => {
            this.toastr.success(response.message);
            setTimeout(() => {
              window.location.replace('/settings/profile');
            }, 1500);
          }, (error) => {
            this.toastr.error(error.error.message);
          });
        }, (error) => {
          this.toastr.error('Failed to upload image. Please try again.');
        }
      );
    } else {
      this.toastr.warning('No image selected. Please choose an image to upload.');
    }
  }

  // Remove the profile image
  onRemove() {
    this.publicProfileRoutes.removeProfileImage().subscribe((response) => {
      this.toastr.success(response.message);
      localStorage.removeItem('profileImage');
      this.profileImage = null;
      this.file = null;
      this.publicProfileRoutes.getProfileImage().subscribe(() => {
        setTimeout(() => {
          this.toastr.success(response.message);
          window.location.replace('/settings/profile');
        }, 500);
      }, (error) => {
        this.toastr.error(error.error.message);
      });
    
    }, (error) => {
      this.toastr.error(error.error.message);
    });

  }

  close(): void {
    this.closeModal.emit();
  }
}
