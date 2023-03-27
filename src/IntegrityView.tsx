import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { IntegrityViewProps } from './Integrity.types';

const NativeView: React.ComponentType<IntegrityViewProps> =
  requireNativeViewManager('Integrity');

export default function IntegrityView(props: IntegrityViewProps) {
  return <NativeView {...props} />;
}
