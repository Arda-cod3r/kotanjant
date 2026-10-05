"use client";

import { useState } from "react";
import { formatPhoneTR, normalizePhone } from "@/lib/utils";

/**
 * Türk telefonu girişi: yalnızca rakam kabul eder, 10 haneyle sınırlar ve
 * yazarken "0555 000 00 00" biçiminde maskeler. Action'a normalize edilmiş
 * değer gönderilir (name ile).
 */
export default function PhoneInput({
  name,
  id,
  defaultValue = "",
  required = false,
  placeholder = "0555 000 00 00",
  className = "",
}: {
  name: string;
  id?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue ? formatPhoneTR(defaultValue) : "");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(formatPhoneTR(event.target.value));
  }

  return (
    <div className={className}>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={14}
        pattern="0[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
        title="Türk cep telefonu numarası girin (05XX XXX XX XX)"
        className="mt-1.5 h-11 w-full border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
      />
      {/* Action'a yalnızca 10 haneli normalize edilmiş numara gider */}
      <input type="hidden" name={name} value={normalizePhone(value)} />
    </div>
  );
}
