import { NavLink } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

const navItems = [
  {
    to: '/insights',
    label: 'Insights',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    to: '/wallet',
    label: 'Wallet',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M16 12h.01" />
      </svg>
    ),
  },
  {
    to: '/transactions',
    label: 'Transactions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    to: '/learn',
    label: 'Learn More',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  return (
    <aside className="w-14 lg:w-52 shrink-0 h-screen flex flex-col glass-strong border-r border-white/8 sticky top-0 transition-all duration-200">
      {/* Logo */}
      <div className="px-3 lg:px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="hidden lg:block text-sm font-semibold text-foreground/90 tracking-tight">RewardSense</span>
        </div>
      </div>

      <Separator className="opacity-30" />

      {/* Nav */}
      <nav className="flex-1 px-2 lg:px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-2.5 lg:px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-sidebar-foreground hover:bg-white/7 hover:text-foreground border border-transparent',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{icon}</span>
                <span className="hidden lg:block">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 lg:px-4 py-4">
        <Separator className="opacity-30 mb-4" />
        <p className="hidden lg:block text-xs text-muted-foreground/60 text-center">Powered by Method Financial</p>
      </div>
    </aside>
  )
}
