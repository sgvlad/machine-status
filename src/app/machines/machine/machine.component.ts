import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MachineStatus } from '../../interfaces/machine.interface';
import { MachineStatusComponent } from '../machine-status/machine-status.component';
import {MachinesStore} from '../../state/machines-list.store';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MachineStatusComponent, MatCardModule, MatProgressSpinner, DatePipe],
})
export class MachineComponent {
  public MachineStatus = MachineStatus;
  readonly store = inject(MachinesStore);
  selectedMachine= this.store.selectedMachine;
}
