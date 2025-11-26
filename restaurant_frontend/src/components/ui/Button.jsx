import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button component with Ocean Professional styling and accessibility.
 * Variants: primary (default), secondary, ghost
 * Sizes: sm, md (default), lg
 */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  type,
  ...rest
}) {
  const isLink = Component === 'a';
  const base = 'ui-btn';
  const v = `ui-btn--${variant}`;
  const s = `ui-btn--${size}`;
  const state = disabled || loading ? 'ui-btn--disabled' : '';

  // For anchors styled as buttons, provide appropriate ARIA
  const ariaProps = isLink
    ? { role: 'button', 'aria-disabled': disabled || loading }
    : {};

  // If button element and no type provided, default to 'button'
  const btnType = Component === 'button' ? (type || 'button') : undefined;

  return (
    <Component
      className={[base, v, s, state, className].filter(Boolean).join(' ')}
      disabled={!isLink ? (disabled || loading) : undefined}
      data-variant={variant}
      data-size={size}
      {...ariaProps}
      type={btnType}
      {...rest}
    >
      {loading ? (
        <span className="ui-btn__spinner" aria-hidden="true" />
      ) : null}
      <span className="ui-btn__label">{children}</span>
    </Component>
  );
}
