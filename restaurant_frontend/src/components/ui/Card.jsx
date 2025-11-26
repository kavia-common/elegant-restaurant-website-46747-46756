import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card component with Ocean Professional styling.
 * Variants: elevated (default), outlined
 * Sections: header, body (children), footer
 */
export default function Card({
  variant = 'elevated',
  as: Component = 'div',
  header,
  footer,
  children,
  className = '',
  ...rest
}) {
  const base = 'ui-card';
  const v = `ui-card--${variant}`;

  return (
    <Component className={[base, v, className].filter(Boolean).join(' ')} {...rest}>
      {header ? <div className="ui-card__header">{header}</div> : null}
      <div className="ui-card__body">{children}</div>
      {footer ? <div className="ui-card__footer">{footer}</div> : null}
    </Component>
  );
}
