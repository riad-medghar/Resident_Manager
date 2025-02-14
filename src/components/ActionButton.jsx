import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ActionButton({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  as: Component = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center rounded-md font-medium transition-colors focus:outline-none';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-blue-300 text-gray-700 border border-gray-300 hover:bg-gray-50',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    sofiane: 'bg-pink-300 text-green-700 hover:bg-blue-300'

  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base'
  };

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" className="mr-2" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {children}
    </Component>
  );
}