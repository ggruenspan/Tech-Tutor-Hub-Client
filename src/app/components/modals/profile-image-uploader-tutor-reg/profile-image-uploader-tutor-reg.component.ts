import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-image-uploader-tutor-reg',
  templateUrl: './profile-image-uploader-tutor-reg.component.html',
  styleUrls: ['./profile-image-uploader-tutor-reg.component.scss'],
})
export class ProfileImageUploaderTutorRegComponent implements OnInit {
  @Input() profileImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  @Output() imageSelected = new EventEmitter<File>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() imageRemoved = new EventEmitter<void>();

  private readonly FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB in bytes
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
  private readonly DEFAULT_IMAGE = "../../../assets/default-profile.png";

  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    this.profileImage = this.profileImage || localStorage.getItem('profileImage');
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

      // Simulate server response with the image URL
      this.imageSelected.emit(this.file);

      this.toastr.success('Profile image uploaded successfully!');

      this.close();

    } else {
      this.toastr.warning('No image selected. Please choose an image to upload.');
    }
  }

  // Remove the profile image
  onRemove() {
    if (this.profileImage === this.DEFAULT_IMAGE) {
      this.toastr.warning('Default image cannot be removed.');
      return;
    }
    this.profileImage = this.DEFAULT_IMAGE;
  }

  close(): void {
    this.closeModal.emit();
  }
}
