import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Section wrapper with Ocean Professional spacing and optional soft background.
 * Props:
 * - id: string (required for anchor)
 * - title: string | node (rendered in h2 by default)
 * - description: string | node (optional)
 * - soft: boolean (applies gradient-soft background)
 * - as: element type (defaults to section)
 * - titleAs: element type for title (defaults to h2)
 */
export default function Section({
  id,
  title,
  description,
  soft = false,
  as: Component = 'section',
  titleAs: TitleTag = 'h2',
  children,
  className = '',
  ...rest
}) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <Component
      id={id}
      aria-labelledby={titleId}
      className={['ui-section', soft ? 'ui-section--soft' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div className="container">
        {title != null ? (
          <header className="ui-section__header">
            <TitleTag id={titleId} className="ui-section__title">
              {title}
            </TitleTag>
            {description ? (
              <p className="ui-section__description">{description}</p>
            ) : null}
          </header>
        ) : null}
        <div className="ui-section__content">{children}</div>
      </div>
    </Component>
  );
}
