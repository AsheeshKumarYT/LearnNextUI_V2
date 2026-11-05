import { createContext, useContext } from 'react';

/** Provided by <FormField>; read by controls to wire id / aria-describedby / invalid automatically. */
export const FormFieldContext = createContext(null);
export const useFormField = () => useContext(FormFieldContext) ?? {};
