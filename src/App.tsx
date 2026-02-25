import { useState } from 'react'
import { Users, TrendingUp, Shield, Zap, Wallet } from 'lucide-react'
import ReferralTab from './components/ReferralTab'
import TradeIncentiveTab from './components/TradeIncentiveTab'
import MarketMakerTab from './components/MarketMakerTab'

type Tab = 'tradeIncentive' | 'referral' | 'marketMaker'
type DemoMode = 'new' | 'mm'

export default function App() {
  const [demoMode, setDemoMode] = useState<DemoMode>('new')
  const [activeTab, setActiveTab] = useState<Tab>('tradeIncentive')
  const [mmEnrolled, setMmEnrolled] = useState(false)

  const isMarketMaker = demoMode === 'mm'

  const handleSwitchDemo = (mode: DemoMode) => {
    setDemoMode(mode)
    setMmEnrolled(mode === 'mm')
    setActiveTab('tradeIncentive')
  }

  const handleEnrollMM = () => {
    setMmEnrolled(true)
    setActiveTab('marketMaker')
  }

  const tabs: Array<{ id: Tab; label: string; icon: typeof Users; show: boolean }> = [
    { id: 'tradeIncentive', label: 'Trade Incentive', icon: TrendingUp, show: true },
    { id: 'marketMaker', label: 'Market Maker', icon: Shield, show: mmEnrolled },
    { id: 'referral', label: 'Referral', icon: Users, show: true },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/80 sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-white tracking-tight">Photon</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-xs">
                <Wallet className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-400 font-mono">0x8f3a...d4c2</span>
              </div>
              <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-semibold text-zinc-300">
                PK
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Demo Mode Switcher */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Rewards</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isMarketMaker ? 'Market Maker view' : 'New trader view'}
            </p>
          </div>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => handleSwitchDemo('new')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                demoMode === 'new'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              New Trader
            </button>
            <button
              onClick={() => handleSwitchDemo('mm')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                demoMode === 'mm'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Market Maker
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-zinc-800/80 mb-6">
          {tabs
            .filter((t) => t.show)
            .map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    isActive
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
        </div>

        {/* Content */}
        {activeTab === 'tradeIncentive' && (
          <TradeIncentiveTab
            isMarketMaker={isMarketMaker}
            mmEnrolled={mmEnrolled}
            onEnrollMM={handleEnrollMM}
          />
        )}
        {activeTab === 'marketMaker' && mmEnrolled && <MarketMakerTab />}
        {activeTab === 'referral' && <ReferralTab />}
      </main>

      <footer className="border-t border-zinc-800/50 mt-16 py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-xs text-zinc-600">
          Photon Prediction Markets &middot; Rewards credited to your Photon wallet
        </div>
      </footer>
    </div>
  )
}
