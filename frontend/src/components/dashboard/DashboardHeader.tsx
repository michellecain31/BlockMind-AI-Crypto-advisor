import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  CircleCheck,
  LogOut,
  RefreshCw,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import CryptoSearch from './CryptoSearch'

type StoredUser = {
  id: string
  name: string
  email: string
  onboardingCompleted: boolean
  preferences?: {
    assets: string[]
    investorStyle?: string
    contentPreferences: string[]
  }
}

type DashboardHeaderProps = {
  onRefresh: () => void
}

type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  type: 'market' | 'news' | 'system'
}

const assetLabels: Record<string, string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  solana: 'Solana',
  xrp: 'XRP',
  cardano: 'Cardano',
}

function DashboardHeader({
  onRefresh,
}: DashboardHeaderProps) {
  const navigate = useNavigate()

  const [isProfileOpen, setIsProfileOpen] =
    useState(false)

  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false)

  const storedUser = localStorage.getItem(
    'blockmind_user',
  )

  const user: StoredUser | null = storedUser
    ? JSON.parse(storedUser)
    : null

  const userName = user?.name || 'Investor'
  const firstLetter = userName
    .charAt(0)
    .toUpperCase()

  const investorStyle =
    user?.preferences?.investorStyle

  const investorStyleLabel =
    investorStyle === 'hodler'
      ? 'HODLer'
      : investorStyle === 'day-trader'
        ? 'Day Trader'
        : investorStyle === 'nft-collector'
          ? 'NFT Collector'
          : investorStyle === 'swing-trader'
            ? 'Swing Trader'
            : 'BlockMind investor'

  const notifications =
    useMemo<NotificationItem[]>(() => {
      const selectedAssets =
        user?.preferences?.assets || []

      const firstAsset = selectedAssets[0]
      const secondAsset = selectedAssets[1]

      const items: NotificationItem[] = []

      if (firstAsset) {
        items.push({
          id: `market-${firstAsset}`,
          title: `${
            assetLabels[firstAsset] || firstAsset
          } is on your watchlist`,
          description:
            'Fresh market data is available for one of your selected assets.',
          time: 'Now',
          type: 'market',
        })
      }

      if (secondAsset) {
        items.push({
          id: `news-${secondAsset}`,
          title: `New ${
            assetLabels[secondAsset] ||
            secondAsset
          } coverage`,
          description:
            'New market headlines may be relevant to your portfolio.',
          time: 'Recently',
          type: 'news',
        })
      }

      items.push({
        id: 'system-preferences',
        title: 'Your dashboard is personalized',
        description:
          'BlockMind is using your assets and investor style to tailor your experience.',
        time: 'Today',
        type: 'system',
      })

      return items
    }, [user])

  const notificationStorageKey = user?.id
    ? `blockmind_read_notifications_${user.id}`
    : 'blockmind_read_notifications'

  const [
    readNotificationIds,
    setReadNotificationIds,
  ] = useState<string[]>(() => {
    const saved = localStorage.getItem(
      notificationStorageKey,
    )

    if (!saved) {
      return []
    }

    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  })

  const unreadCount = notifications.filter(
    (notification) =>
      !readNotificationIds.includes(
        notification.id,
      ),
  ).length

  const markNotificationAsRead = (
    notificationId: string,
  ) => {
    if (
      readNotificationIds.includes(
        notificationId,
      )
    ) {
      return
    }

    const updated = [
      ...readNotificationIds,
      notificationId,
    ]

    setReadNotificationIds(updated)

    localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(updated),
    )
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(
      (notification) => notification.id,
    )

    setReadNotificationIds(allIds)

    localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(allIds),
    )
  }

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(
      (current) => !current,
    )

    setIsProfileOpen(false)
  }

  const handleProfileToggle = () => {
    setIsProfileOpen(
      (current) => !current,
    )

    setIsNotificationsOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem(
      'blockmind_token',
    )

    localStorage.removeItem(
      'blockmind_user',
    )

    navigate('/login', {
      replace: true,
    })
  }

  const getNotificationIcon = (
    type: NotificationItem['type'],
  ) => {
    if (type === 'market') {
      return <TrendingUp size={16} />
    }

    if (type === 'news') {
      return <Bell size={16} />
    }

    return <Sparkles size={16} />
  }

  return (
    <header className="mb-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            Your crypto intelligence
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Good morning, {userName}.
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Here&apos;s what&apos;s happening
            across your market today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CryptoSearch />

          <button
            type="button"
            onClick={onRefresh}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={18} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={
                handleNotificationsToggle
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[9px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#101522] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                  <div>
                    <p className="font-medium text-white">
                      Notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : 'You are all caught up'}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[420px] overflow-y-auto p-2">
                  {notifications.map(
                    (notification) => {
                      const isRead =
                        readNotificationIds.includes(
                          notification.id,
                        )

                      return (
                        <button
                          key={
                            notification.id
                          }
                          type="button"
                          onClick={() =>
                            markNotificationAsRead(
                              notification.id,
                            )
                          }
                          className={`flex w-full gap-3 rounded-xl px-3 py-3 text-left transition ${
                            isRead
                              ? 'hover:bg-white/[0.03]'
                              : 'bg-violet-500/[0.06] hover:bg-violet-500/[0.10]'
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                              isRead
                                ? 'border-white/[0.07] bg-white/[0.03] text-slate-500'
                                : 'border-violet-400/20 bg-violet-500/10 text-violet-300'
                            }`}
                          >
                            {getNotificationIcon(
                              notification.type,
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p
                                className={`text-sm font-medium ${
                                  isRead
                                    ? 'text-slate-400'
                                    : 'text-white'
                                }`}
                              >
                                {
                                  notification.title
                                }
                              </p>

                              {!isRead && (
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {
                                notification.description
                              }
                            </p>

                            <p className="mt-2 text-[11px] text-slate-600">
                              {
                                notification.time
                              }
                            </p>
                          </div>
                        </button>
                      )
                    },
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-white/[0.07] px-5 py-3 text-xs text-slate-600">
                  <CircleCheck size={14} />

                  Notifications are personalized
                  to your settings
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/settings')
            }
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={handleProfileToggle}
              className="ml-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
                {firstLetter}
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="max-w-32 truncate text-sm font-medium text-white">
                  {userName}
                </p>

                <p className="text-xs text-slate-500">
                  {investorStyleLabel}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-slate-500 transition-transform sm:block ${
                  isProfileOpen
                    ? 'rotate-180'
                    : ''
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#101522] p-2 shadow-2xl">
                <div className="border-b border-white/[0.07] px-3 py-3">
                  <p className="truncate text-sm font-medium text-white">
                    {userName}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 transition hover:bg-rose-400/10"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader