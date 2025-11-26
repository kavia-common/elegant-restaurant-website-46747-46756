import React from 'react';
import { Card, Button } from '../components/ui';

/**
 * PUBLIC_INTERFACE
 * Menu section rendering categories and sample items in a responsive grid.
 * Categories: Starters, Mains, Desserts, Drinks
 * Uses Card and Button primitives; aligns with Ocean Professional theme.
 */
export default function Menu() {
  const categories = [
    {
      id: 'starters',
      title: 'Starters',
      items: [
        { name: 'Seared Scallops', description: 'Citrus glaze, micro greens', price: '$14' },
        { name: 'Crispy Calamari', description: 'Lemon aioli, pepper flakes', price: '$12' },
        { name: 'Bay Oysters', description: 'Mignonette, lemon', price: '$18' },
      ],
    },
    {
      id: 'mains',
      title: 'Mains',
      items: [
        { name: 'Grilled Salmon', description: 'Herb butter, asparagus', price: '$26' },
        { name: 'Lobster Risotto', description: 'Saffron, parmesan', price: '$32' },
        { name: 'Seafood Linguine', description: 'Clams, mussels, prawns', price: '$28' },
      ],
    },
    {
      id: 'desserts',
      title: 'Desserts',
      items: [
        { name: 'Citrus Tart', description: 'Shortbread crust, cream', price: '$10' },
        { name: 'Chocolate Mousse', description: 'Sea salt, olive oil', price: '$10' },
        { name: 'Panna Cotta', description: 'Berry coulis', price: '$9' },
      ],
    },
    {
      id: 'drinks',
      title: 'Drinks',
      items: [
        { name: 'House Spritz', description: 'Aperitif, citrus, bubbles', price: '$11' },
        { name: 'Chardonnay', description: 'Coastal, bright finish', price: '$12' },
        { name: 'Sparkling Water', description: 'Lemon twist', price: '$4' },
      ],
    },
  ];

  return (
    <div
      aria-label="Menu categories"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {categories.map((cat) => (
        <Card
          key={cat.id}
          aria-labelledby={`menu-${cat.id}-title`}
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <h3 id={`menu-${cat.id}-title`} style={{ margin: 0 }}>
                {cat.title}
              </h3>
              <Button as="a" href="#reservations" variant="ghost" className="mb-0" aria-label={`Reserve to enjoy ${cat.title}`}>
                Reserve
              </Button>
            </div>
          }
        >
          <ul
            style={{
              display: 'grid',
              gap: 'var(--space-3)',
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >
            {cat.items.map((it, idx) => (
              <li
                key={`${cat.id}-${idx}`}
                style={{
                  display: 'grid',
                  gap: '2px',
                  borderBottom: '1px dashed var(--color-border)',
                  paddingBottom: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', alignItems: 'baseline' }}>
                  <strong style={{ color: 'var(--color-text)' }}>{it.name}</strong>
                  <span style={{ color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>{it.price}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>{it.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
