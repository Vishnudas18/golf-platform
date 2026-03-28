import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  register,
  className = '',
  id,
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-body font-medium text-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-surface border ${
          error ? 'border-danger' : 'border-border'
        } rounded-lg px-4 py-3 text-text font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted/50`}
        {...register}
        {...rest}
      />
      {error && (
        <span className="text-xs font-body text-danger mt-1">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default Input;
