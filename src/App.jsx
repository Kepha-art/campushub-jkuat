import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import SearchWithFilters from '../SearchWithFilters.jsx';
import VendorDashboard from '../VendorDashboard.jsx';
import ServiceBooking from '../serviceBooking.jsx';
import Househunting from '../Househunting.jsx';

const navItems = [
  { label: 'Marketplace', path: '/' },
  { label: 'Vendor Dashboard', path: '/vendor' },
  { label: 'House Hunting', path: '/house' },
  { label: 'Laundry', path: '/service/laundry' },
  { label: 'Salon', path: '/service/salon' },
  { label: 'Treatment', path: '/service/treatment' },
];

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--jkuat-muted)] text-[var(--jkuat-text)]">
        <header className="sticky top-0 z-50 border-b border-[var(--jkuat-green-600)]/10 bg-[rgba(255,255,255,0.95)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div>
              <h1 className="text-xl font-semibold text-[var(--jkuat-text)]">CampusHub JKUAT</h1>
              <p className="text-sm text-[var(--jkuat-text)]/75">Student marketplace and service booking portal.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[var(--jkuat-green-600)] text-white'
                        : 'bg-[var(--jkuat-white)] text-[var(--jkuat-green-600)] hover:bg-[rgba(14,122,54,0.08)]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<SearchWithFilters />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/service/:type" element={<ServiceBooking />} />
            <Route path="/house" element={<Househunting />} />
            <Route path="*" element={<SearchWithFilters />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
