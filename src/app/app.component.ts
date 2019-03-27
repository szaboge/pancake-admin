import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  authSub: Subscription;
  valueChange: Subscription;

  all = 0;
  inprogress = 0;
  donee = 0;

  reservations;

  count_statistic(array) {
    let t_a = 0;
    let t_i = 0;
    let t_d = 0;
    for (const item in array) {
      if (array.hasOwnProperty(item)) {
        t_a += this.count(array[item].pancakes);
        if (array[item].done) {
          t_d += this.count(array[item].pancakes);
        } else {
          t_i += this.count(array[item].pancakes);
        }
      }
    }
    this.all = t_a;
    this.inprogress = t_i;
    this.donee = t_d;
  }

  constructor(public authService: AuthService) {
    this.authSub = this.authService.af().authState.subscribe((next) => {
        if (next) {
          this.valueChange = this.authService.db().object('reservations').valueChanges().subscribe((val) => {
            this.reservations = val;
            this.count_statistic(this.reservations);
          });
        } else {
          this.authService.af().auth.signInAnonymously();
        }
      }
    );
  }

  done(key: string) {
    this.authService.db().object('reservations/' + key + '/done/').set(true);
  }

  notdone(key: string) {
    this.authService.db().object('reservations/' + key + '/done/').set(false);
  }

  count(pancakes) {
    let count = 0;
    for (const item of pancakes) {
      count += item.piece;
    }
    return count;
  }
}
