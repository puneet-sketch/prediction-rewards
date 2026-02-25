import { useState } from 'react'
import {
  Users,
  DollarSign,
  Clock,
  Trophy,
  Copy,
  Check,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Gift,
  Info,
} from 'lucide-react'
import {
  userReferralData,
  referralMilestones,
  referralCaps,
} from '../data/mockData'

export default function ReferralTab() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(userReferralData.referralLink).catch(() => {
      // fallback: do nothing
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-teal-600/15 to-cyan-600/20 border border-emerald-500/30 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Invite Friends &amp; Earn Rewards
            </h2>
            <p className="text-sm text-slate-400">
              Both you and your friend earn rewards when they hit trade milestones.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-300 font-mono truncate">
            {userReferralData.referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>Your code:</span>
          <span className="bg-slate-800 text-emerald-300 font-mono px-2 py-0.5 rounded">
            {userReferralData.referralCode}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            Total Earned
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${userReferralData.totalEarned.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Lifetime cap: ${referralCaps.lifetimeCap}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Users className="w-4 h-4" />
            Active Referrals
          </div>
          <div className="text-2xl font-bold text-white">
            {userReferralData.activeReferrals}
          </div>
          <div className="text-xs text-slate-500 mt-1">Friends referred</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Clock className="w-4 h-4" />
            Pending Rewards
          </div>
          <div className="text-2xl font-bold text-amber-400">
            ${userReferralData.pendingRewards.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">From active referrals</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Trophy className="w-4 h-4" />
            Per-Referral Cap
          </div>
          <div className="text-2xl font-bold text-white">
            ${referralCaps.perReferredUser.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Max per friend (500 trades)
          </div>
        </div>
      </div>

      {/* Milestone Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Reward Milestones</h3>
          <p className="text-sm text-slate-400 mt-1">
            Rewards unlock when your referred friend hits these trade milestones. Both of you
            earn.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3 text-left font-medium">Milestone (Trades)</th>
                <th className="px-4 py-3 text-right font-medium">Total Payout</th>
                <th className="px-4 py-3 text-right font-medium">You Earn</th>
                <th className="px-4 py-3 text-right font-medium">Friend Earns</th>
              </tr>
            </thead>
            <tbody>
              {referralMilestones.map((m, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-white">
                        {m.trades.toLocaleString()} trades
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-300">
                    ${m.totalPayout.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-400 font-medium">
                    ${m.referrerGets.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-emerald-400 font-medium">
                    ${m.referredGets.toFixed(3)}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-800/30">
                <td className="px-4 py-3 text-sm font-semibold text-white">
                  Total (cap per friend)
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-white">$2.25</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-green-400">
                  $1.125
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-emerald-400">
                  $1.125
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Referee Progress */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Your Referrals</h3>
          <p className="text-sm text-slate-400 mt-1">
            Track each friend&apos;s progress toward the next milestone.
          </p>
        </div>
        <div className="divide-y divide-slate-800/50">
          {userReferralData.referrals.map((ref) => {
            const nextMs = ref.nextMilestone
            const progress = nextMs
              ? Math.min(100, Math.round((ref.trades / nextMs) * 100))
              : 100

            return (
              <div
                key={ref.id}
                className="p-4 hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-mono text-slate-400">
                      {ref.displayName.slice(2, 5)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white font-mono">
                        {ref.displayName}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        Joined {ref.signupDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ref.status === 'active' && (
                      <span className="inline-flex items-center gap-1 bg-green-500/15 text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                    {ref.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        <Trophy className="w-3 h-3" /> Completed
                      </span>
                    )}
                    {ref.status === 'pending_verification' && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        <AlertCircle className="w-3 h-3" /> Pending verification
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-11">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">
                      {ref.trades.toLocaleString()} trades
                      {nextMs && (
                        <span className="text-slate-600">
                          {' '}
                          <ArrowRight className="w-3 h-3 inline" /> Next milestone:{' '}
                          {nextMs.toLocaleString()}
                        </span>
                      )}
                      {!nextMs && (
                        <span className="text-violet-400"> — All milestones reached</span>
                      )}
                    </span>
                    <span className="text-green-400 font-medium">
                      Earned: ${ref.rewardCredited.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div
                      className={`rounded-full h-1.5 transition-all ${
                        ref.status === 'completed'
                          ? 'bg-violet-500'
                          : ref.status === 'pending_verification'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Milestone dots */}
                  {ref.status !== 'pending_verification' && (
                    <div className="flex items-center gap-1 mt-2">
                      {referralMilestones.map((m, i) => {
                        const reached = ref.trades >= m.trades
                        return (
                          <div key={i} className="flex items-center gap-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                reached
                                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                                  : 'bg-slate-800 text-slate-600 border border-slate-700'
                              }`}
                            >
                              {reached ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                m.trades >= 1000
                                  ? `${m.trades / 1000}K`
                                  : m.trades
                              )}
                            </div>
                            {i < referralMilestones.length - 1 && (
                              <div
                                className={`w-4 h-px ${reached ? 'bg-emerald-500/50' : 'bg-slate-700'}`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="p-3 bg-slate-800/30 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Daily referrer cap: ${referralCaps.dailyCap}/day. Lifetime cap: $
            {referralCaps.lifetimeCap}. Only matched trades count toward milestones.
            &quot;Pending verification&quot; rewards are under review — no action needed from
            you.
          </p>
        </div>
      </div>
    </div>
  )
}
