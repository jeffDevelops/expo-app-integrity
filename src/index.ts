import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to Integrity.web.ts
// and on native platforms to Integrity.ts
import IntegrityModule from './IntegrityModule';
import IntegrityView from './IntegrityView';
import { ChangeEventPayload, IntegrityViewProps } from './Integrity.types';

// Get the native constant value.
export const PI = IntegrityModule.PI;

export function hello(): string {
  return IntegrityModule.hello();
}

export async function setValueAsync(value: string) {
  return await IntegrityModule.setValueAsync(value);
}

const emitter = new EventEmitter(IntegrityModule ?? NativeModulesProxy.Integrity);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { IntegrityView, IntegrityViewProps, ChangeEventPayload };
