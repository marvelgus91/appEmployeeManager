import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private confirmSource = new Subject<boolean>();
  public confirmResult = this.confirmSource.asObservable().pipe(take(1));

  constructor() {}

  confirm(): Observable<boolean> {
    return this.confirmSource.asObservable().pipe(take(1));
  }

  onConfirmed(): void {
    this.confirmSource.next(true);
    this.confirmSource.complete();
    this.confirmSource = new Subject<boolean>();
  }

  onCancelled(): void {
    this.confirmSource.next(false);
    this.confirmSource.complete();
    this.confirmSource = new Subject<boolean>();
  }
}
