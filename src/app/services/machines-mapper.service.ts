import {Injectable} from '@angular/core';
import {Machine, MachinePayload, MachineStatusFromWebSocketPayload} from '../interfaces/machine.interface';

/**
 * Mapper service used to map the machine payloads from backend to the UI model.
 */
@Injectable({
  providedIn: 'root'
})
export class MachinesMapperService {

  toMachine(
    machineStatusChangePayload: MachineStatusFromWebSocketPayload,
    machinePayload: MachinePayload
  ): Machine {
    return {
      id: machineStatusChangePayload.id,
      name: machinePayload.name,
      statusHistory: [
        {
          status: machineStatusChangePayload.status,
          timeOfStatusChange: new Date(),
        },
      ],
    };
  }

  accumulateStatusHistory(machinesAcc: Machine[], updatedMachine: Machine): Machine[] {
    const machineExists = machinesAcc.find(m => m.id === updatedMachine.id);
    if (!machineExists) return [...machinesAcc, updatedMachine];

    return machinesAcc.map(machine =>
      machine.id === updatedMachine.id
        ? {
          ...machine,
          statusHistory: [...machine.statusHistory, ...updatedMachine.statusHistory],
        }
        : machine
    );
  }
}
