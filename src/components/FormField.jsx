import React from 'react';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  error,
  onChange,
  required = false,
  placeholder,
  step,
  max,
  min,
  rows,
  ...props
}) => {
  const inputClass = `w-full p-2 border rounded ${
    error ? 'border-red-500' : 'border-gray-300'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          className={inputClass}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
      ) : (
        <input
          className={inputClass}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          step={step}
          max={max}
          min={min}
          {...props}
        />
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;