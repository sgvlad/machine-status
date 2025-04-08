import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineStatusComponent } from '../machine-status/machine-status.component';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MachinesListView } from '../../interfaces/machine.interface';

@Component({
  selector: 'app-machines-item',
  templateUrl: './machines-item.component.html',
  standalone: true,
  imports: [RouterModule, MachineStatusComponent, MatListModule, MatBadgeModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MachinesItemComponent {
  @Input({ required: true }) machine!: Signal<MachinesListView>;
}
