'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { Input } from '@/vibes/soul/form/input';
import { Button } from '@/vibes/soul/primitives/button';

import { schema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type SignInAction = Action<SubmissionResult | null, FormData>;

type Props = {
  action: SignInAction;
  emailLabel?: string;
  passwordLabel?: string;
  submitLabel?: string;
};

export function SignInForm({
  action,
  emailLabel = 'Email',
  passwordLabel = 'Password',
  submitLabel = 'Sign in',
}: Props) {
  const [lastResult, formAction] = useFormState(action, null);
  const [form, fields] = useForm({
    defaultValue: { email: '', password: '' },
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    if (lastResult?.error) console.log(lastResult.error);
  }, [lastResult]);

  return (
    <form {...getFormProps(form)} action={formAction} className="flex flex-grow flex-col gap-5">
      <Input
        {...getInputProps(fields.email, { type: 'text' })}
        errors={fields.email.errors}
        key={fields.email.id}
        label={emailLabel}
      />
      <Input
        {...getInputProps(fields.password, { type: 'password' })}
        className="mb-6"
        errors={fields.password.errors}
        key={fields.password.id}
        label={passwordLabel}
      />
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-auto w-full" loading={pending} type="submit" variant="secondary">
      {children}
    </Button>
  );
}
