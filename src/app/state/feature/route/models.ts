import { Signal } from '@angular/core';

/**
 * Use this config to declare how to transform raw route param values into types you want (e.g., parse a number, enum, etc).
 */
export type ParamsConfig = Record<string, (param: string | undefined) => unknown>;

/**
 * Takes a ParamsConfig and converts each entry into a Signal of the transformed value.
 */
export type ParamsComputed<Config extends ParamsConfig> = {
  [Key in keyof Config]: Config[Key] extends infer TransformFn
    ? TransformFn extends (...args: any[]) => any
      ? Signal<ReturnType<TransformFn>>
      : never
    : never;
};
