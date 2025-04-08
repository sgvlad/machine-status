import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, of, scan, tap } from 'rxjs';
import { Machine, MachinePayload, MachineStatusFromWebSocketPayload } from '../interfaces/machine.interface';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { uuid } from '../interfaces/uuid.interface';
import { environment } from '../../environments/environment';
import { MachinesMapperService } from './machines-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class MachinesDataService {
  readonly #socket = inject(Socket);
  readonly #httpClient = inject(HttpClient);
  readonly #mapper = inject(MachinesMapperService);
  readonly #cache$ = new BehaviorSubject<Map<string, MachinePayload>>(new Map());

  /**
   * Listens to the web socket machine status changes that triggers a backend request to take the machine name if it is not already cached and
   * maps the payloads into an object used by UI. Multiple status changes for the same machine accumulates for the existing created machine.
   *
   *   WebSocket emits:       --A-----B--A----D---
   *                          (A emits again later)
   *
   *   HTTP request timing:     \-->   \
   *                            \------->    (A is cached now, no HTTP)
   *                                      \---->
   *                            (async requests triggered for each event)
   *
   *   Enriched output:        --A+--B+--A+--D+
   *                           (machine + name + statusHistory[] that accumulates)
   */
  public machines$: Observable<Machine[]> = this.#socket
    .fromEvent<MachineStatusFromWebSocketPayload, 'MACHINE_STATUS_CHANGES'>('MACHINE_STATUS_CHANGES')
    .pipe(
      mergeMap((machineStatusChange) =>
        this._getCachedMachine(machineStatusChange.id).pipe(
          map((payload) => this.#mapper.toMachine(machineStatusChange, payload)),
        ),
      ),
      scan(this.#mapper.accumulateStatusHistory, []),
    );

  /** Get a single machine reactively, loads if not cached */
  private _getCachedMachine(id: string): Observable<MachinePayload> {
    const cache = this.#cache$.value;
    if (cache.has(id)) {
      return of(cache.get(id)!);
    }

    return this.getMachine(id).pipe(
      tap((machine) => {
        const updated = new Map(this.#cache$.value);
        updated.set(id, machine);
        this.#cache$.next(updated);
      }),
    );
  }

  private getMachine(machineId: uuid) {
    return this.#httpClient.get<MachinePayload>(`${environment.urlBackend}/machines/${machineId}`);
  }
}
