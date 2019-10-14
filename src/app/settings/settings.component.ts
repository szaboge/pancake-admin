import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {FormControl, Validators} from '@angular/forms';

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
export class SettingsComponent implements OnInit {
  pancakeFormControl = new FormControl('', Validators.required);
  authSub: Subscription;
  disabled = false;

  pancakes = new BehaviorSubject<Array<Pancake>>([]);

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.authSub = this.authService.af().authState.subscribe((next) => {
        if (next) {
          this.authService.db().object('pancakes').valueChanges()
            .subscribe((pancakes: Array<Pancake>) => {
              this.pancakes.next(pancakes ? pancakes : []);
            });
        } else {
          this.authService.af().auth.signInAnonymously();
        }
      }
    );
  }

  addPancake() {
    if (this.pancakeFormControl.valid) {
      this.pancakes.next([...this.pancakes.getValue(), {name: this.pancakeFormControl.value, piece: 0}]);
      this.pancakeFormControl.setValue('');
      this.pancakeFormControl.markAsUntouched();
      this.authService.db().object('pancakes').set(this.pancakes.getValue())
        .then(value => {

        })
        .catch(reason => {
          console.log(reason);
        });
    }
  }
}
