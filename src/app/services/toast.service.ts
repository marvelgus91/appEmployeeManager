import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private renderer: Renderer2;
  private toastCounter = 0; //identificador del toast

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  show(
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' = 'info',
    title?: String,
    delay: number = 5000
  ): void {
    const toastContainer = document.getElementById('toastContainer');

    if (!toastContainer) {
      console.error('Toast container not found in the DOM');
      return;
    }

    const toastElement = this.renderer.createElement('div');
    const toastId = `liveToast-${this.toastCounter++}`;

    this.renderer.setAttribute(toastElement, 'id', toastId);
    this.renderer.addClass(toastElement, 'toast');
    this.renderer.addClass(toastElement, `text-bg-${type}`);
    this.renderer.setAttribute(toastElement, 'role', 'alert');
    this.renderer.setAttribute(toastElement, 'aria-live', 'assertive');
    this.renderer.setAttribute(toastElement, 'aria-atomic', 'true');
    this.renderer.setAttribute(toastElement, 'data-bs-autohide', 'true');
    this.renderer.setAttribute(toastElement, 'data-bs-delay', delay.toString());

    const toastHeader = this.renderer.createElement('div');
    this.renderer.addClass(toastHeader, 'toast-header');
    this.renderer.addClass(toastHeader, `text-bg${type}`);

    const iconSpan = this.renderer.createElement('span');
    this.renderer.addClass(iconSpan, 'me-2');
    this.renderer.addClass(iconSpan, 'p-2');
    this.renderer.addClass(iconSpan, 'rounded');
    this.renderer.addClass(iconSpan, 'bg-white');
    this.renderer.addClass(iconSpan, `text-${type}`);

    const strongTile = this.renderer.createElement('strong');
    this.renderer.addClass(strongTile, 'me-auto');
    this.renderer.appendChild(
      strongTile,
      this.renderer.createText(
        title?.toString() || this.capitalizerFirstLetter(type)
      )
    );

    const buttonClose = this.renderer.createElement('button');
    this.renderer.setAttribute(buttonClose, 'type', 'button');
    this.renderer.addClass(buttonClose, 'btn-close');
    this.renderer.setAttribute(buttonClose, 'data-bs-dismiss', 'toast');
    this.renderer.setAttribute(buttonClose, 'aria-label', 'Close');

    this.renderer.appendChild(toastHeader, strongTile);
    this.renderer.appendChild(toastHeader, buttonClose);

    const toastBody = this.renderer.createElement('div');
    this.renderer.addClass(toastBody, 'toast-body');
    this.renderer.appendChild(toastBody, this.renderer.createText(message));

    this.renderer.appendChild(toastElement, toastHeader);
    this.renderer.appendChild(toastElement, toastBody);

    this.renderer.appendChild(toastContainer, toastElement);

    const liveToast = new bootstrap.Toast(toastElement);
    liveToast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
      this.renderer.removeChild(toastContainer, toastElement);
    });
  }

  success(message: string, title?: string, delay?: number): void {
    this.show(message, 'success', title, delay);
  }

  error(message: string, title?: string, delay?: number): void {
    this.show(message, 'danger', title, delay);
  }

  warning(message: string, title?: string, delay?: number): void {
    this.show(message, 'warning', title, delay);
  }

  info(message: string, title?: string, delay?: number): void {
    this.show(message, 'info', title, delay);
  }

  private capitalizerFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
