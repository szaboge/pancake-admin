import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';

interface Pancake {
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

  authSub: Subscription;

  pancakes = new Subject<Array<Pancake>>();

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.authSub = this.authService.af().authState.subscribe((next) => {
        if (next) {
          this.authService.db().object('pancakes').valueChanges()
            .subscribe((pancakes: Array<Pancake>) => {
              this.pancakes.next(pancakes);
            });
        } else {
          this.authService.af().auth.signInAnonymously();
        }
      }
    );


  }
}
