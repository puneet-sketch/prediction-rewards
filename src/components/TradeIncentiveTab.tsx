import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts'
import {
  TrendingUp,
  Target,
  Flame,
  DollarSign,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from 'lucide-react'
import { userTradeData, tradeIncentiveTiers } from '../data/mockData'

interface Props {
  onEnrollMM: () => void
  isMMEnrolled: boolean
}

export default function TradeIncentiveTab({ onEnrollMM, isMMEnrolled }: Props) {
  const tier = tradeIncentiveTiers[userTradeData.currentTierIndex]
  const nextTier = tradeIncentiveTiers[userTradeData.currentTierIndex + 1]
  const isMMEligible = userTradeData.last7Days.some((d) => d.total >= 10000)

  const todayData = userTradeData.last7Days[userTradeData.last7Days.length - 1]
  const todayProgress = Math.min(100, Math.round((todayData.total / todayData.target) * 100))

  const chartData = userTradeData.last7Days.map((d) => ({
    name: d.dayLabel,
    trades: d.total,
    target: d.target,
    hit: d.hit,
    inProgress: d.inProgress || false,
    entries: d.entries,
    exits: d.exits,
    reward: d.reward,
    date: d.date,
  }))

  // Retention check
  const daysHit = userTradeData.weeklyTargetHits
  const daysNeeded = tier.retentionDays
  const atRisk = daysHit < daysNeeded && !userTradeData.last7Days.some((d) => d.inProgress)

  return (
    <div className="space-y-6">
      {/* MM Eligibility Banner */}
      {isMMEligible && !isMMEnrolled && (
        <div className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-indigo-300">
                You qualify for the Market Maker Program!
              </p>
              <p className="text-sm text-slate-400">
                Your trading volume makes you eligible for additional liquidity rewards and
                commission rebates.
              </p>
            </div>
          </div>
          <button
            onClick={onEnrollMM}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            Enroll Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Target className="w-4 h-4" />
            Current Tier
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {tier.name}
          </div>
          <div className="text-xs text-slate-500 mt-1">{tier.range} trades/day</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            Today&apos;s Trades
          </div>
          <div className="text-2xl font-bold text-white">
            {todayData.total.toLocaleString()}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Target: {todayData.target.toLocaleString()}</span>
              <span>{todayProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className={`rounded-full h-1.5 transition-all ${todayProgress >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                style={{ width: `${todayProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Flame className="w-4 h-4" />
            Daily Streak
          </div>
          <div className="text-2xl font-bold text-orange-400">
            {userTradeData.currentStreak} days
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {nextTier
              ? `Need ${tier.upgradeStreak} consecutive for upgrade`
              : 'Max tier reached'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            Rewards This Week
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${userTradeData.totalRewardsThisWeek.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Credited to Photon wallet</div>
        </div>
      </div>

      {/* Retention Warning */}
      {atRisk && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-300">Tier Retention At Risk</p>
            <p className="text-sm text-slate-400 mt-1">
              You&apos;ve hit your target {daysHit}/{tier.retentionWindow} days this week. You
              need at least {daysNeeded}/{tier.retentionWindow} days to retain{' '}
              <span className="text-white font-medium">{tier.name}</span>. Missing the
              threshold will result in an immediate downgrade to{' '}
              <span className="text-white font-medium">
                {tradeIncentiveTiers[userTradeData.currentTierIndex - 1]?.name || 'unenrolled'}
              </span>{' '}
              with no grace period.
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">7-Day Trading Activity</h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Target Hit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Missed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500 opacity-60 inline-block" /> In
              Progress
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => `${(val / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value: number, name: string) => {
                if (name === 'trades') return [value.toLocaleString(), 'Total Trades']
                return [value, name]
              }}
              labelFormatter={(label: string) => `${label}`}
            />
            <ReferenceLine
              y={userTradeData.dailyTarget}
              stroke="#6366f1"
              strokeDasharray="8 4"
              strokeWidth={2}
            >
              <Label value={`Target: ${userTradeData.dailyTarget.toLocaleString()}`} fill="#818cf8" fontSize={11} position="right" />
            </ReferenceLine>
            <Bar dataKey="trades" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.inProgress ? '#6366f1' : entry.hit ? '#22c55e' : '#ef4444'
                  }
                  opacity={entry.inProgress ? 0.6 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Daily Breakdown</h3>
          <p className="text-sm text-slate-400 mt-1">
            Only entry trades count toward your target. Exit trades are tracked separately.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Entry Trades</th>
                <th className="px-4 py-3 text-right font-medium">Exit Trades</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-right font-medium">Target</th>
                <th className="px-4 py-3 text-right font-medium">Reward</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {userTradeData.last7Days.map((day, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-200">
                    {day.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-200">
                    {day.entries.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-500">
                    {day.exits.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-white">
                    {day.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-400">
                    {day.target.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {day.reward > 0 ? (
                      <span className="text-green-400 font-medium">
                        ${day.reward.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {day.inProgress ? (
                      <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 px-2.5 py-1 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" /> In Progress
                      </span>
                    ) : day.hit ? (
                      <span className="inline-flex items-center gap-1 bg-green-500/15 text-green-300 px-2.5 py-1 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Hit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-300 px-2.5 py-1 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" /> Missed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Information */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Tier Levels</h3>
          <p className="text-sm text-slate-400 mt-1">
            Target = 1.3x your rolling 7-day median trade count. Hit the target for consecutive
            days to upgrade.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3 text-left font-medium">Tier</th>
                <th className="px-4 py-3 text-left font-medium">Daily Trades</th>
                <th className="px-4 py-3 text-center font-medium">Upgrade Streak</th>
                <th className="px-4 py-3 text-center font-medium">Retention</th>
                <th className="px-4 py-3 text-left font-medium">Downgrade</th>
              </tr>
            </thead>
            <tbody>
              {tradeIncentiveTiers.map((t, i) => {
                const isCurrent = i === userTradeData.currentTierIndex
                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-800/50 transition-colors ${isCurrent ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500' : 'hover:bg-slate-800/30'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${isCurrent ? 'text-indigo-400' : 'text-slate-300'}`}
                        >
                          {t.name}
                        </span>
                        {isCurrent && (
                          <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-medium px-1.5 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{t.range}</td>
                    <td className="px-4 py-3 text-sm text-center text-slate-300">
                      {t.upgradeStreak} consecutive days
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-300">
                      ≥ {t.retentionDays}/{t.retentionWindow} days
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      &lt; {t.downgradeBelow}/{t.retentionWindow} days → down 1 tier
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-800/30 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Downgrades are applied immediately with no grace period. Reward is 1% of additional
            revenue from extra 30% trades above your target.
          </p>
        </div>
      </div>
    </div>
  )
}
