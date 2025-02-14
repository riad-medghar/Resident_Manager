import React from 'react';

const PaymentMethodSelect = ({ value, onChange, error }) => {
  const methods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' }
  ];

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Payment Method
        <span className="text-red-500 ml-1">*</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        {methods.map((method) => (
          <option key={method.value} value={method.value}>
            {method.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default PaymentMethodSelect;