import { uuid } from './uuid.interface';

export enum MachineStatus {
  ON = 'on',
  OFF = 'off',
}

// when retrieving a machine from the REST endpoint (`/machines/:machineId`)
// you'll get an object of the following type
export interface MachinePayload {
  id: uuid;
  name: string;
}

// when subscribing to the websocket and the event 'MACHINE_STATUS_CHANGES'
// you'll get events of the following type
export interface MachineStatusFromWebSocketPayload {
  id: uuid;
  status: MachineStatus;
}

//----------------------------------------------------------------------------------------------------------------------
//Store Model
//----------------------------------------------------------------------------------------------------------------------
export interface Machine {
  id: uuid;
  name: string;
  statusHistory: MachineStatusHistory[];
}

export interface MachineStatusHistory {
  status: MachineStatus;
  timeOfStatusChange: Date;
}

//----------------------------------------------------------------------------------------------------------------------
//UI Model
//----------------------------------------------------------------------------------------------------------------------

export interface MachinesListView {
  id: uuid;
  name: string;
  numberOfStatusChanges: number;
  latestStatus: MachineStatus;
}
