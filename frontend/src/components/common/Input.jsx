/**
 * Input - Reusable form input components using DaisyUI
 */
import React from 'react';

export function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  error,
  required = false,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) {
  const sizeClasses = {
    sm: 'input-sm',
    md: '',
    lg: 'input-lg',
  };

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`input input-bordered w-full ${sizeClasses[size]} ${Icon ? 'pl-12' : ''} ${error ? 'input-error' : ''} focus:input-primary`}
          {...props}
        />
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) {
  const sizeClasses = {
    sm: 'select-sm',
    md: '',
    lg: 'select-lg',
  };

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`select select-bordered w-full ${sizeClasses[size]} ${error ? 'select-error' : ''} focus:select-primary`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export function Textarea({
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''} focus:textarea-primary`}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  icon: Icon,
  className = '',
}) {
  return (
    <div className={`form-control ${className}`}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input input-bordered w-full ${Icon ? 'pl-12' : ''} focus:input-primary`}
        />
      </div>
    </div>
  );
}

export default Input;
