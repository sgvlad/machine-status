import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MachinesStore } from '../state/machines-list.store';
import { MachinesItemComponent } from './machine-item/machines-item.component';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, MatListModule, MatBadgeModule, MatButtonModule, MachinesItemComponent],
})
export class MachinesComponent {
  readonly #machineStore = inject(MachinesStore);

  machineSignalsMap = this.#machineStore.machineSignalsMap;
  machineIds = this.#machineStore.ids;
}
