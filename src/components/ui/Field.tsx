import { useId } from "react";

type Props = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  /**
   * Present = renders a <select>. The first entry is a non-selectable prompt so
   * the control has no accidental default, which matters for fields like
   * "product of interest" where a wrong default silently mis-routes the lead.
   */
  options?: { value: string; label: string }[];
  prompt?: string;
  defaultValue?: string;
};

export function Field({
  name,
  label,
  type = "text",
  required = false,
  multiline = false,
  options,
  prompt,
  defaultValue,
}: Props) {
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {options ? (
        <select id={id} name={name} required={required} defaultValue={defaultValue ?? ""}>
          {prompt && (
            <option value="" disabled>
              {prompt}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea id={id} name={name} required={required} rows={5} defaultValue={defaultValue} />
      ) : (
        <input id={id} name={name} type={type} required={required} defaultValue={defaultValue} />
      )}
    </div>
  );
}
