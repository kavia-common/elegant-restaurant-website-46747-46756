import React, { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * Toast (inline) notification component.
 * Variants: info (default), success, warning, error
 * Auto-dismiss with duration (ms). Accessible via role="status" and aria-live.
 */
export default function Toast({
  variant = 'info',
  title,
  message,
  duration = 0, // 0 = persistent
  onClose,
  className = '',
  ...rest
}) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  // ARIA: status for non-error; alert for error
  const isError = variant === 'error';
  const role = isError ? 'alert' : 'status';
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={['ui-toast', `ui-toast--${variant}`, className].join(' ')}
      {...rest}
    >
      <div className="ui-toast__content">
        {title ? <div className="ui-toast__title">{title}</div> : null}
        {message ? <div className="ui-toast__message">{message}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          className="ui-toast__close ui-btn ui-btn--ghost ui-btn--sm"
          aria-label="Close notification"
          onClick={onClose}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
