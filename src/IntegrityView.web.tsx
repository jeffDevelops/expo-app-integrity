import * as React from 'react';

import { IntegrityViewProps } from './Integrity.types';

export default function IntegrityView(props: IntegrityViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
