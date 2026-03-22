import { Outlet, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/programmes', label: 'Train', icon: '🎓' },
  { to: '/log-session', label: 'Log', icon: '📝' },
  { to: '/incidents', label: 'Incidents', icon: '⚠️' },
  { to: '/history', label: 'History', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  const location = useLocation();
  const currentNav = navItems.find((n) => {
    if (n.to === '/') return location.pathname === '/';
    return location.pathname.startsWith(n.to);
  });

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">Bruno's Training</h1>
        {currentNav && currentNav.to !== '/' && (
          <span className="header-subtitle">{currentNav.label}</span>
        )}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="app-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
