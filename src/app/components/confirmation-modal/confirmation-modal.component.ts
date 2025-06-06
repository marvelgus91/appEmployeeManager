import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  @Input() modalId: string = 'genericConfirmationModal';
  @Input() title: string = 'Confirmación';
  @Input() message: string = '¿Está seguro de que desea realizar esta acción?';
  @Input() confirmButtonText: string = 'Confirmar';
  @Input() cancelButtonText: string = 'Cancelar';
  @Input() confirmButtonClass: string = 'btn-danger';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private bsModal: any; //instancia del objeto modal de bootstrap

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const modalElement = document.getElementById(this.modalId);

    if (modalElement) {
      this.bsModal = new bootstrap.Modal(modalElement);
    }
  }

  ngOnDestroy(): void {
    if (this.bsModal) {
      this.bsModal.dispose();
    }
  }

  show(): void {
    if (this.bsModal) {
      this.bsModal.show();
    }
  }

  hide(): void {
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.hide();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.hide();
  }
}
