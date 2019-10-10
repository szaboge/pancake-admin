import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Pancake} from '../settings.component';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-pancake',
  templateUrl: './pancake.component.html',
  styleUrls: ['./pancake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PancakeComponent implements OnInit {
  private _pancake = new BehaviorSubject<Pancake>(null);

  @Input() set pancake(value: Pancake) {
    this._pancake.next( value);
  }

  constructor() { }

  ngOnInit() {
  }

}
