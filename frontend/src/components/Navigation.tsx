import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/uml-editor', label: 'Editor UML', icon: '📊' },
    { path: '/ui-generator', label: 'Generador de UI', icon: '🎨' }
  ];

  return (
    <nav style={{
      background: '#1f2937',
      padding: '1rem 2rem',
      borderBottom: '2px solid #374151'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo/Title */}
        <div style={{
          color: '#f9fafb',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🔧</span>
          AMABUID
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#60a5fa' : '#d1d5db',
                background: location.pathname === item.path ? '#1e40af' : 'transparent',
                border: '1px solid',
                borderColor: location.pathname === item.path ? '#2563eb' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
