// ─── Trade Incentive: daily reward brackets ─────────────────────────────────

export const tradeRewardBrackets = [
  { minTrades: 1000, reward: 5, label: '1K' },
  { minTrades: 5000, reward: 50, label: '5K' },
  { minTrades: 15000, reward: 200, label: '15K' },
  { minTrades: 50000, reward: 500, label: '50K+' },
]

// ─── Market Maker: level definitions ────────────────────────────────────────

export const mmLevels = [
  { level: 1, target: 5000, reward: 50, rebate: 0 },
  { level: 2, target: 10000, reward: 100, rebate: 0 },
  { level: 3, target: 15000, reward: 200, rebate: 0 },
  { level: 4, target: 25000, reward: 300, rebate: 1 },
  { level: 5, target: 50000, reward: 500, rebate: 2 },
]

// ─── MM enrollment eligibility ──────────────────────────────────────────────

export const mmEligibility = {
  minDailyTrades: 1000,
  minDaysRequired: 3,
  altTotalTrades: 10000, // lifetime, not time-bound
}

// ─── New User data ──────────────────────────────────────────────────────────

export type DayTrade = {
  date: string
  trades: number
  reward: number
  inProgress?: boolean
}

export const newUserTradeData: DayTrade[] = [
  { date: 'Feb 19', trades: 0, reward: 0 },
  { date: 'Feb 20', trades: 320, reward: 0 },
  { date: 'Feb 21', trades: 890, reward: 0 },
  { date: 'Feb 22', trades: 1250, reward: 5 },
  { date: 'Feb 23', trades: 450, reward: 0 },
  { date: 'Feb 24', trades: 780, reward: 0 },
  { date: 'Feb 25', trades: 640, reward: 0, inProgress: true },
]

export const newUserLifetime = { trades: 4330, rewards: 5 }

// ─── Market Maker User: trade data ──────────────────────────────────────────

export const mmUserTradeData: DayTrade[] = [
  { date: 'Feb 19', trades: 12400, reward: 50 },
  { date: 'Feb 20', trades: 18200, reward: 200 },
  { date: 'Feb 21', trades: 16800, reward: 200 },
  { date: 'Feb 22', trades: 11500, reward: 50 },
  { date: 'Feb 23', trades: 3200, reward: 5 },
  { date: 'Feb 24', trades: 22100, reward: 200 },
  { date: 'Feb 25', trades: 14200, reward: 0, inProgress: true },
]

export const mmUserLifetime = { trades: 342800, rewards: 8450 }

// ─── Market Maker User: enrolled data ───────────────────────────────────────

export type DayLiquidity = {
  date: string
  liquidityTrades: number
  reward: number
  inProgress?: boolean
}

export const mmUserData = {
  currentLevelIndex: 2, // Level 3
  todayLiquidityTrades: 12400,
  lifetimeMMRewards: 4200,
  last7Days: [
    { date: 'Feb 19', liquidityTrades: 8500, reward: 50 },
    { date: 'Feb 20', liquidityTrades: 16200, reward: 200 },
    { date: 'Feb 21', liquidityTrades: 15800, reward: 200 },
    { date: 'Feb 22', liquidityTrades: 11200, reward: 100 },
    { date: 'Feb 23', liquidityTrades: 3200, reward: 0 },
    { date: 'Feb 24', liquidityTrades: 18500, reward: 200 },
    { date: 'Feb 25', liquidityTrades: 12400, reward: 0, inProgress: true },
  ] as DayLiquidity[],
}

// ─── Referral (unchanged) ───────────────────────────────────────────────────

export const referralMilestones = [
  { trades: 10, totalPayout: 0.10, referrerGets: 0.05, referredGets: 0.05 },
  { trades: 50, totalPayout: 0.25, referrerGets: 0.125, referredGets: 0.125 },
  { trades: 100, totalPayout: 0.35, referrerGets: 0.175, referredGets: 0.175 },
  { trades: 250, totalPayout: 0.65, referrerGets: 0.325, referredGets: 0.325 },
  { trades: 500, totalPayout: 0.90, referrerGets: 0.45, referredGets: 0.45 },
]

export const referralCaps = {
  perReferredUser: 2.25,
  dailyCap: 20,
  lifetimeCap: 500,
}

export const userReferralData = {
  referralCode: 'PHOTON-A7X3',
  referralLink: 'https://photon.markets/ref/PHOTON-A7X3',
  totalEarned: 1.85,
  pendingRewards: 0.65,
  activeReferrals: 5,
  referrals: [
    { id: 'user_1', displayName: '0x7a3...f2d1', signupDate: 'Feb 10, 2026', trades: 142, lastMilestoneHit: 100, nextMilestone: 250 as number | null, rewardCredited: 0.35, status: 'active' as const },
    { id: 'user_2', displayName: '0x9c1...b4e7', signupDate: 'Feb 12, 2026', trades: 53, lastMilestoneHit: 50, nextMilestone: 100 as number | null, rewardCredited: 0.175, status: 'active' as const },
    { id: 'user_3', displayName: '0x2f8...a9c3', signupDate: 'Feb 15, 2026', trades: 8, lastMilestoneHit: 0, nextMilestone: 10 as number | null, rewardCredited: 0, status: 'active' as const },
    { id: 'user_4', displayName: '0x5d4...e1b6', signupDate: 'Feb 18, 2026', trades: 502, lastMilestoneHit: 500, nextMilestone: null as number | null, rewardCredited: 1.125, status: 'completed' as const },
    { id: 'user_5', displayName: '0x1a9...c7f2', signupDate: 'Feb 20, 2026', trades: 0, lastMilestoneHit: 0, nextMilestone: 10 as number | null, rewardCredited: 0, status: 'pending_verification' as const },
  ],
}
