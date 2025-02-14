import React from 'react';

export default function StatusBadge({ status }) {
  const statusConfig = {
    paid: {
      color: 'green',
      text: 'Paid'
    },
    unpaid: {
      color: 'red',
      text: 'Unpaid'
    },
    partial: {
      color: 'yellow',
      text: 'Partial'
    },
    overdue: {
      color: 'orange',
      text: 'Overdue'
    }
  };

  const { color, text } = statusConfig[status] || { color: 'gray', text: 'Unknown' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
      {text}
    </span>
  );
}