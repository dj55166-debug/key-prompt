import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ITEMS = [
  {
    key: 'home',
    path: '/',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    key: 'trending',
    path: '/search',
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  },
  {
    key: 'upload',
    path: '/submit',
    isPrimary: true,
    icon: 'M12 4.5v15m7.5-7.5h-15',
  },
  {
    key: 'saved',
    path: '/library',
    icon: 'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z',
  },
  {
    key: 'profile',
    path: '/library',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  },
]

export default function BottomNav({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const handleNav = (item) => {
    if (item.key === 'upload' && !user) { navigate('/login'); return }
    if (item.key === 'saved' && !user) { navigate('/login'); return }
    if (item.key === 'profile' && !user) { navigate('/login'); return }
    navigate(item.path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-800 flex sm:hidden z-40">
      {ITEMS.map((item) => {
        const isActive = location.pathname === item.path
        if (item.isPrimary) {
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center -mt-5 shadow-lg shadow-violet-900/60">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-gray-500">{t(`nav.${item.key}`)}</span>
            </button>
          )
        }
        return (
          <button
            key={item.key}
            onClick={() => handleNav(item)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              isActive ? 'text-violet-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="text-[10px] font-medium">{t(`nav.${item.key}`)}</span>
          </button>
        )
      })}
    </div>
  )
}
