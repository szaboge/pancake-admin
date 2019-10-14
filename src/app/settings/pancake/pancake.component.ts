import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pancake} from '../settings.component';

@Component({
  selector: 'app-pancake',
  templateUrl: './pancake.component.html',
  styleUrls: ['./pancake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PancakeComponent implements OnInit {
  @Input() pancake: Pancake;
  @Input() disabled = false;

  @Output() delete = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
