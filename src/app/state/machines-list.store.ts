import { Machine } from '../interfaces/machine.interface';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { MachinesDataService } from '../services/machines-data.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { withRouteParams } from './feature/route/route-params.feature';

export const MachinesStore = signalStore(
  //for testing purpose only. Was left it here intentionally to be able to check the store with redux devtools.
  withDevtools('machines'),
  withRouteParams({ machineId: (param) => param }),
  withEntities<Machine>(),
  withProps(() => ({
    machinesDataService: inject(MachinesDataService),
  })),

  withComputed(({ entities, entityMap, machineId }) => ({
    sortedMachines: computed(() => Object.values(entities()).sort((a, b) => a.name!.localeCompare(b.name!))),
    selectedMachine: computed(() => entityMap()[machineId() ?? '']),
  })),

  withMethods(({ machinesDataService, ...store }) => ({
    loadMachines: rxMethod<void>(
      pipe(
        switchMap(() => machinesDataService.machines$),
        tap({
          next(machines) {
            patchState(store, setEntities(machines));
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
