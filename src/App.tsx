import { useState } from 'react'
import { Users, TrendingUp, Shield, Zap, Wallet } from 'lucide-react'
import ReferralTab from './components/ReferralTab'
import TradeIncentiveTab from './components/TradeIncentiveTab'
import MarketMakerTab from './components/MarketMakerTab'
import { userTradeData } from './data/mockData'

type Tab = 'referral' | 'tradeIncentive' | 'marketMaker'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tradeIncentive')
  const [isMMEnrolled, setIsMMEnrolled] = useState(false)

  // User is eligible for MM if they've done ≥10K trades on any day in last 7
  const isMMEligible = userTradeData.last7Days.some((d) => d.total >= 10000)

  const handleEnrollMM = () => {
    setIsMMEnrolled(true)
    setActiveTab('marketMaker')
  }

  const tabs: Array<{ id: Tab; label: string; icon: typeof Users; show: boolean }> = [
    { id: 'tradeIncentive', label: 'Trade Incentive', icon: TrendingUp, show: true },
    { id: 'marketMaker', label: 'Market Maker', icon: Shield, show: isMMEligible || isMMEnrolled },
    { id: 'referral', label: 'Referral', icon: Users, show: true },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Photon<span className="text-violet-400">.</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm">
                <Wallet className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 font-mono text-xs">0x8f3a...d4c2</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                PK
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Rewards Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your rewards, climb tiers, and earn more by trading and referring friends.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs
            .filter((t) => t.show)
            .map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'marketMaker' && !isMMEnrolled && isMMEligible && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  )}
                </button>
              )
            })}
        </div>

        {/* Tab Content */}
        {activeTab === 'tradeIncentive' && (
          <TradeIncentiveTab onEnrollMM={handleEnrollMM} isMMEnrolled={isMMEnrolled} />
        )}
        {activeTab === 'marketMaker' && (
          <MarketMakerTab enrolled={isMMEnrolled} onEnroll={handleEnrollMM} />
        )}
        {activeTab === 'referral' && <ReferralTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-slate-600">
          <span>Photon Prediction Markets</span>
          <span>Rewards are credited to your Photon wallet</span>
        </div>
      </footer>
    </div>
  )
}
