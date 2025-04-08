import { computed, inject, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { ParamsComputed, ParamsConfig } from './models';
import { filter, map, startWith } from 'rxjs';

/**
 * Creates a signal store feature that maps dynamic route parameters into computed signals.
 *
 * This utility allows you to declaratively bind route parameters to computed signals
 * inside a signal store. Each parameter is transformed using a user-defined mapping function.
 *
 * @template Config A mapping object that defines how each route parameter should be transformed.
 * @param {Config} config An object where keys are parameter names and values are transform functions.
 * @returns A signal store feature that injects the transformed route parameters into the store.
 */
export function withRouteParams<Config extends ParamsConfig>(config: Config) {
  return signalStoreFeature(
    withComputed(() => {
      const routeParams = injectRouteParams();

      return Object.keys(config).reduce(
        (acc, key) => ({
          ...acc,
          [key]: computed(() => {
            const value = routeParams()[key];
            return config[key](value);
          }),
        }),
        {} as ParamsComputed<Config>,
      );
    }),
  );
}

/**
 * Returns a signal of route parameters extracted from the current URL.
 *
 * This function listens to Angular router navigation events and converts the current URL
 * into a signal, from which specific route parameters (like `machineId`) can be derived.
 * It's designed for simple route patterns (e.g., `/machines/:id`)`.
 *
 * @returns {Signal<Record<string, string | undefined>>} A computed signal containing key-value route parameters.
 */
function injectRouteParams(): Signal<Record<string, string | undefined>> {
  //Used the Router and not the ActivatedRoute, since the Store is provided in the context of AppComponent
  const router = inject(Router);

  // Create an observable that emits the current URL on each navigation end event
  const urlChanges$ = router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => router.url),
    startWith(router.url),
  );

  const urlSignal = toSignal(urlChanges$, { initialValue: router.url });

  return computed(() => ({ machineId: urlSignal().replace('/machines/', '') }));
}
