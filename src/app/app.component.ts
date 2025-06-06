import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'appEmployeeManager';

  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;

  constructor(private modalService: ModalService) {}

  ngAfterViewInit(): void {
    this.confirmationModal.confirmed.subscribe(() => {
      this.modalService.onConfirmed();
    });

    this.confirmationModal.cancelled.subscribe(() => {
      this.modalService.onCancelled();
    });
  }

  showConfirmationModal(
    title: string,
    message: string,
    confirmButtonText: string,
    confirmButtonClass: string,
    cancelButtonText: string
  ): void {
    this.confirmationModal.title = title;
    this.confirmationModal.message = message;
    this.confirmationModal.confirmButtonText = confirmButtonText;
    this.confirmationModal.confirmButtonClass = confirmButtonClass;
    this.confirmationModal.cancelButtonText = cancelButtonText;
    this.confirmationModal.show();
  }
}
