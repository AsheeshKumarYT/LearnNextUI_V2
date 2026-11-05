import { useCallback, useState } from 'react';
import { validate } from '@/utils/validation';

/**
 * Minimal form state + validation. Pairs with FormField / Input.
 *
 * const form = useForm({ email: '', password: '' }, { email: [required(), email()] });
 * <FormField label="Email" error={form.errors.email}>
 *   <Input {...form.field('email')} />
 * </FormField>
 * <form onSubmit={form.handleSubmit(async (values) => …)}>
 *
 * Errors show after a non-empty field is blurred, or for every field after the first submit.
 */
export function useForm(initialValues, schema = {}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allErrors = validate(values, schema);
  const errors = Object.fromEntries(Object.entries(allErrors).filter(([k]) => submitted || touched[k]));

  const setValue = useCallback((name, value) => setValues((v) => ({ ...v, [name]: value })), []);

  const field = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setValue(name, e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e),
    // Only flag a field on blur once the user has typed something — empty required
    // fields are reported on submit, which avoids layout jumps while tabbing through.
    onBlur: () => {
      const v = values[name];
      if (v !== '' && v != null) setTouched((t) => ({ ...t, [name]: true }));
    },
  });

  const handleSubmit = (onValid) => async (e) => {
    e?.preventDefault?.();
    setSubmitted(true);
    if (Object.keys(validate(values, schema)).length) return;
    setSubmitting(true);
    try {
      await onValid(values);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = (next = initialValues) => {
    setValues(next);
    setTouched({});
    setSubmitted(false);
  };

  return { values, setValues, setValue, errors, isValid: !Object.keys(allErrors).length, field, handleSubmit, submitting, reset };
}
