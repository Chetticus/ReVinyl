export const telephoneHref = (phone: string) =>
  `tel:${phone.replace(/[^+\d]/g, '')}`;

export function contactDraftHref(
  email: string,
  values: { name: string; email: string; topic: string; message: string }
) {
  const body = `${values.name}\n${values.email}\n\n${values.message}`;
  return `mailto:${email}?subject=${encodeURIComponent(values.topic)}&body=${encodeURIComponent(body)}`;
}
