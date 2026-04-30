'use client'

import { useState, useEffect, useRef } from 'react'

type DropdownItem = { label: string; icon: React.ReactNode }
type NavItem = { label: string; hasDropdown: boolean; header?: string; items?: DropdownItem[] }

const SOLUTIONS_ITEMS: DropdownItem[] = [
  {
    label: 'Farm Supply',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3V21H21" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16L12 11L16 15L21 10" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Livestock Feed',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 11V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V11" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 19V13C7 12.45 7.45 12 8 12H16C16.55 12 17 12.45 17 13V19" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2V8" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Store Locator',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#CC0000" strokeWidth="2" />
        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const INDUSTRY_ITEMS: DropdownItem[] = [
  {
    label: 'Agriculture',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6V20C3 20.55 3.45 21 4 21H20C20.55 21 21 20.55 21 20V6L18 2H6Z" stroke="#2D5F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6H21" stroke="#2D5F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Livestock',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C7 2 3 6 3 11C3 16 7 21 12 21C17 21 21 16 21 11C21 6 17 2 12 2Z" stroke="#2D5F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Home & Garden',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" stroke="#2D5F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V12H15V21" stroke="#2D5F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Pet Care',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2V22M2 12H22" stroke="#2D5F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const RESOURCES_ITEMS: DropdownItem[] = [
  {
    label: 'Success Stories',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="14" rx="2" stroke="#2D5F2D" strokeWidth="2" />
        <rect x="7" y="3" width="10" height="4" rx="1" stroke="#2D5F2D" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: 'Blog',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#2D5F2D" strokeWidth="2" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="#2D5F2D" strokeWidth="2" />
        <line x1="8" y1="12" x2="16" y2="12" stroke="#2D5F2D" strokeWidth="2" />
        <line x1="8" y1="16" x2="12" y2="16" stroke="#2D5F2D" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: 'Webinars',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="10" rx="2" stroke="#2D5F2D" strokeWidth="2" />
        <circle cx="12" cy="17" r="2" stroke="#2D5F2D" strokeWidth="2" />
      </svg>
    ),
  },
]

const NAV_ITEMS: NavItem[] = [
  { label: 'SOLUTIONS', hasDropdown: true, header: 'SOLUTIONS', items: SOLUTIONS_ITEMS },
  { label: 'INDUSTRY', hasDropdown: true, header: 'INDUSTRIES', items: INDUSTRY_ITEMS },
  { label: 'RESOURCES', hasDropdown: true, header: 'RESOURCES', items: RESOURCES_ITEMS },
  { label: 'COMPANY', hasDropdown: false },
]

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-white"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
    >
      <div className="max-w-[1400px] mx-auto h-[72px] flex items-center justify-between">
        {/* Left — TSC logo, ml-[30px] matching Nurix */}
        <div className="flex items-center" style={{ marginLeft: 30 }}>
          <a href="#" className="flex items-baseline">
            <span style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-0.04em', color: '#1a1a2e' }}>
              NURI
            </span>
            <span style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-0.04em', color: '#4F46E5' }}>
              X
            </span>
          </a>
        </div>

        {/* Middle — nav links */}
        <div className="flex items-center gap-10">
          {/* TscPLAY brand link */}
          <a
            href="#"
            className="nav-link"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: '#111827',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontWeight: 300 }}>Nu</span>
            <span style={{ fontWeight: 700 }}>PLAY</span>
          </a>

          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.hasDropdown ? (
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 400,
                      fontSize: '10.2px',
                      lineHeight: '15.12px',
                      textTransform: 'uppercase',
                      color: '#111827',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.label}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 2 }}>
                    <path d="M2 4L6 8L10 4" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  {/* Dropdown menu — exact Nurix styling */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      padding: '16px',
                      minWidth: '240px',
                      opacity: activeDropdown === item.label ? 1 : 0,
                      visibility: activeDropdown === item.label ? 'visible' : 'hidden',
                      transition: 'all 0.3s ease',
                      zIndex: 1000,
                      marginTop: '12px',
                    }}
                  >
                    {/* Triangle arrow */}
                    <span
                      style={{
                        content: "''",
                        position: 'absolute',
                        top: '-6px',
                        left: '20px',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '6px solid white',
                        filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.1))',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {item.header}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {item.items?.map((ditem) => (
                        <a
                          key={ditem.label}
                          href="#"
                          className="dropdown-item-hover"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '6px 0',
                            color: '#111827',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            transition: 'color 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '18px',
                              height: '18px',
                              flexShrink: 0,
                            }}
                          >
                            {ditem.icon}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.2' }}>
                            {ditem.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  href="#"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                    fontSize: '10.2px',
                    lineHeight: '15.12px',
                    textTransform: 'uppercase',
                    color: '#111827',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Right — Let's Talk button */}
        <div style={{ marginRight: 20 }}>
          <a href="#" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <div
              className="flex items-center gap-2.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                background: '#CC0000',
                padding: '12px 24px',
                height: '48px',
              }}
            >
              <span className="w-[6px] h-[6px] rounded-full bg-white inline-block" />
              <span
                style={{
                  color: 'white',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                LET&apos;S TALK
              </span>
            </div>
          </a>
        </div>
      </div>

      <style jsx>{`
        .dropdown-item-hover:hover {
          color: #CC0000 !important;
        }
      `}</style>
    </nav>
  )
}
