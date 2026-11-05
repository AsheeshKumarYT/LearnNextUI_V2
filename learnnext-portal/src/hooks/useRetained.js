import { useRef } from 'react';

/**
 * Returns the last non-null value. Lets a Drawer/Modal keep rendering its
 * content while it animates closed after the selected item was cleared.
 */
export function useRetained(value) {
  const ref = useRef(value);
  if (value != null) ref.current = value;
  return ref.current;
}
