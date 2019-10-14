import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {FormControl, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

export interface Pancake {
  name: string;
  piece: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  pancakeFormControl = new FormControl('', Validators.required);
  loading = new BehaviorSubject<boolean>(false);

  destroy = new Subject<boolean>();

  pancakes = new BehaviorSubject<Array<Pancake>>([]);

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.loading.next(true);
    this.authService.af().authState.pipe(takeUntil(this.destroy)).subscribe((next) => {
        this.loading.next(true);
        if (next) {
          this.authService.db().object('pancakes').valueChanges().pipe(takeUntil(this.destroy))
            .subscribe((pancakes: Array<Pancake>) => {
              pancakes = pancakes ? pancakes : [];
              pancakes = pancakes.filter((pancake: Pancake) => pancake.name !== '');
              this.pancakes.next(pancakes);
              this.loading.next(false);
            });
        } else {
          this.authService.af().auth.signInAnonymously();
          this.loading.next(false);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

  addPancake() {
    if (this.pancakeFormControl.valid) {
      this.loading.next(true);
      this.pancakes.next([...this.pancakes.getValue(), {name: this.pancakeFormControl.value, piece: 0}]);
      this.pancakeFormControl.setValue('');
      this.pancakeFormControl.markAsUntouched();
      this.setPancakes()
        .then(value => this.loading.next(false))
        .catch(value => this.loading.next(false));
    }
  }

  setPancakes() {
    return this.authService.db().object('pancakes').set(this.pancakes.getValue());
  }

  deletePancake(pancake: string) {
    this.loading.next(true);
    const pancakes = this.pancakes.getValue().filter((panc: Pancake) => pancake !== panc.name);
    this.pancakes.next(pancakes);
    this.setPancakes()
      .then(value => this.loading.next(false))
      .catch(value => this.loading.next(false));
  }

  deleteReservations() {
    if (confirm('Biztos hogy törlöd az eddigi összes rendelést?')) {
      this.loading.next(true);
      this.authService.db().object('reservations').set({})
        .then(value => this.loading.next(false))
        .catch(value => this.loading.next(false));
    }
  }
}
