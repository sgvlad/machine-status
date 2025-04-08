import { Injectable } from '@angular/core';
import { Machine, MachinesListView } from '../interfaces/machine.interface';

/**
 * Mapper service used to map the machine store model to the ui model.
 */
@Injectable({
  providedIn: 'root',
})
export class MachinesUiMapperService {

  // Map and sort machines list
  static mapAndSortMachinesList(entities: Machine[]): MachinesListView[] {
    return Object.values(entities)
      .map((machine) => MachinesUiMapperService.mapToMachinesListView(machine))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  static mapToMachinesListView(machine: Machine): MachinesListView {
    return {
      id: machine.id,
      name: machine.name,
      numberOfStatusChanges: machine.statusHistory.length,
      latestStatus: machine.statusHistory[machine.statusHistory.length - 1].status,
    };
  }
}
