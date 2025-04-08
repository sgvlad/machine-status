import { Machine, MachinesListView } from '../interfaces/machine.interface';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { MachinesDataService } from '../services/machines-data.service';
import { computed, inject, signal, WritableSignal } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { withRouteParams } from './feature/route/route-params.feature';
import { MachinesUiMapperService } from '../services/machines-ui-mapper.service';

export const MachinesStore = signalStore(
  //for testing purpose only. Was left it here intentionally to be able to check the store with redux devtools.
  withDevtools('machines'),
  withRouteParams({ machineId: (param) => param }),
  withEntities<Machine>(),
  withProps(() => ({
    machinesDataService: inject(MachinesDataService),
  })),

  withComputed(({ entityMap, machineId }) => ({
    selectedMachine: computed(() => entityMap()[machineId() ?? '']),
    machineSignalsMap: computed(() => machineSignalMap),
  })),

  withMethods(({ machinesDataService, entityMap, ...store }) => ({
    loadMachines: rxMethod<void>(
      pipe(
        switchMap(() => machinesDataService.machines$),
        tap({
          next(machines) {
            patchState(store, setEntities(machines));
            updateMachineSignals(MachinesUiMapperService.mapMachinesList(machines));
          },
        }),
      ),
    ),
  })),

  withHooks({
    onInit({ machinesDataService, ...store }) {
      store.loadMachines();
    },
  }),
);

const machineSignalMap = new Map<string, WritableSignal<MachinesListView>>();

function updateMachineSignals(machines: MachinesListView[]) {
  for (const machine of machines) {
    const existing = machineSignalMap.get(machine.id);
    if (existing) {
      existing.set(machine);
    } else {
      machineSignalMap.set(machine.id, signal(machine));
    }
  }
}
