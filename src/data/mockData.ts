// ─── Trade Incentive: daily reward brackets ─────────────────────────────────

export const tradeRewardBrackets = [
  { minTrades: 1000, reward: 5, label: '1K' },
  { minTrades: 5000, reward: 50, label: '5K' },
  { minTrades: 15000, reward: 200, label: '15K' },
  { minTrades: 50000, reward: 500, label: '50K+' },
]

// ─── Market Maker: daily reward brackets (no levels, bracket-based) ──────────

export const mmRewardBrackets = [
  { minTrades: 5000, reward: 50, rebate: 0, label: '5K' },
  { minTrades: 10000, reward: 100, rebate: 0, label: '10K' },
  { minTrades: 15000, reward: 200, rebate: 0, label: '15K' },
  { minTrades: 25000, reward: 300, rebate: 1, label: '25K' },
  { minTrades: 50000, reward: 500, rebate: 2, label: '50K+' },
]

// ─── MM enrollment eligibility (based on entry trades) ───────────────────────

export const mmEligibility = {
  minDailyTrades: 1000, // entry trades per day
  minDaysRequired: 3,
  altTotalTrades: 10000, // lifetime entry trades, not time-bound
}

// ─── New User data ──────────────────────────────────────────────────────────

export type DayTrade = {
  date: string
  entryTrades: number
  exitTrades: number
  reward: number
  inProgress?: boolean
}

export const newUserTradeData: DayTrade[] = [
  { date: 'Feb 19', entryTrades: 0, exitTrades: 0, reward: 0 },
  { date: 'Feb 20', entryTrades: 195, exitTrades: 125, reward: 0 },
  { date: 'Feb 21', entryTrades: 540, exitTrades: 350, reward: 0 },
  { date: 'Feb 22', entryTrades: 1050, exitTrades: 200, reward: 5 },
  { date: 'Feb 23', entryTrades: 270, exitTrades: 180, reward: 0 },
  { date: 'Feb 24', entryTrades: 470, exitTrades: 310, reward: 0 },
  { date: 'Feb 25', entryTrades: 390, exitTrades: 250, reward: 0, inProgress: true },
]

export const newUserLifetime = { entryTrades: 2915, exitTrades: 1415, rewards: 5 }

// ─── Market Maker User: trade data ──────────────────────────────────────────

export const mmUserTradeData: DayTrade[] = [
  { date: 'Feb 19', entryTrades: 7400, exitTrades: 5000, reward: 50 },
  { date: 'Feb 20', entryTrades: 15500, exitTrades: 2700, reward: 200 },
  { date: 'Feb 21', entryTrades: 15200, exitTrades: 1600, reward: 200 },
  { date: 'Feb 22', entryTrades: 7100, exitTrades: 4400, reward: 50 },
  { date: 'Feb 23', entryTrades: 1900, exitTrades: 1300, reward: 5 },
  { date: 'Feb 24', entryTrades: 16400, exitTrades: 5700, reward: 200 },
  { date: 'Feb 25', entryTrades: 8600, exitTrades: 5600, reward: 0, inProgress: true },
]

export const mmUserLifetime = { entryTrades: 214200, exitTrades: 128600, rewards: 8450 }

// ─── Market Maker User: enrolled maker trade data ────────────────────────────

export type DayMakerTrade = {
  date: string
  entryMakerTrades: number
  exitMakerTrades: number
  reward: number
  inProgress?: boolean
}

export const mmUserData = {
  lifetimeEntryMakerTrades: 186500,
  lifetimeExitMakerTrades: 98200,
  lifetimeMMRewards: 4200,
  last7Days: [
    { date: 'Feb 19', entryMakerTrades: 8500, exitMakerTrades: 4200, reward: 50 },
    { date: 'Feb 20', entryMakerTrades: 16200, exitMakerTrades: 7800, reward: 200 },
    { date: 'Feb 21', entryMakerTrades: 15800, exitMakerTrades: 8100, reward: 200 },
    { date: 'Feb 22', entryMakerTrades: 11200, exitMakerTrades: 5600, reward: 100 },
    { date: 'Feb 23', entryMakerTrades: 3200, exitMakerTrades: 1800, reward: 0 },
    { date: 'Feb 24', entryMakerTrades: 18500, exitMakerTrades: 9400, reward: 200 },
    { date: 'Feb 25', entryMakerTrades: 12400, exitMakerTrades: 6300, reward: 0, inProgress: true },
  ] as DayMakerTrade[],
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
