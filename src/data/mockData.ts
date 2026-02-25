// ─── Trade Incentive Configuration & Data ───────────────────────────────────

export const tradeIncentiveTiers = [
  {
    name: 'T1',
    range: '1,000 – 2,500',
    min: 1000,
    max: 2500,
    targetMultiplier: 1.3,
    upgradeStreak: 3,
    retentionDays: 3,
    retentionWindow: 7,
    downgradeBelow: 3,
  },
  {
    name: 'T2',
    range: '2,501 – 5,000',
    min: 2501,
    max: 5000,
    targetMultiplier: 1.3,
    upgradeStreak: 5,
    retentionDays: 3,
    retentionWindow: 7,
    downgradeBelow: 3,
  },
  {
    name: 'T3',
    range: '5,001 – 10,000',
    min: 5001,
    max: 10000,
    targetMultiplier: 1.3,
    upgradeStreak: 7,
    retentionDays: 4,
    retentionWindow: 7,
    downgradeBelow: 4,
  },
  {
    name: 'T4',
    range: '10,001 – 25,000',
    min: 10001,
    max: 25000,
    targetMultiplier: 1.3,
    upgradeStreak: 10,
    retentionDays: 4,
    retentionWindow: 7,
    downgradeBelow: 4,
  },
  {
    name: 'T5',
    range: '25,001 – 50,000',
    min: 25001,
    max: 50000,
    targetMultiplier: 1.3,
    upgradeStreak: 15,
    retentionDays: 5,
    retentionWindow: 7,
    downgradeBelow: 5,
  },
]

export const userTradeData = {
  currentTierIndex: 2, // T3
  currentStreak: 4,
  weeklyTargetHits: 4,
  totalRewardsThisWeek: 43.50,
  rollingMedian: 7500,
  dailyTarget: 9750, // 7500 × 1.3
  last7Days: [
    { date: 'Feb 19', dayLabel: 'Wed', entries: 5200, exits: 3000, total: 8200, target: 9750, reward: 0, hit: false },
    { date: 'Feb 20', dayLabel: 'Thu', entries: 6800, exits: 3300, total: 10100, target: 9750, reward: 3.50, hit: true },
    { date: 'Feb 21', dayLabel: 'Fri', entries: 7500, exits: 4000, total: 11500, target: 9750, reward: 17.50, hit: true },
    { date: 'Feb 22', dayLabel: 'Sat', entries: 6400, exits: 3400, total: 9800, target: 9750, reward: 0.50, hit: true },
    { date: 'Feb 23', dayLabel: 'Sun', entries: 4500, exits: 2700, total: 7200, target: 9750, reward: 0, hit: false },
    { date: 'Feb 24', dayLabel: 'Mon', entries: 7800, exits: 4200, total: 12000, target: 9750, reward: 22.00, hit: true },
    { date: 'Feb 25', dayLabel: 'Today', entries: 4500, exits: 2323, total: 6823, target: 9750, reward: 0, hit: false, inProgress: true },
  ] as Array<{
    date: string
    dayLabel: string
    entries: number
    exits: number
    total: number
    target: number
    reward: number
    hit: boolean
    inProgress?: boolean
  }>,
}

// ─── Market Maker Configuration & Data ──────────────────────────────────────

export const mmTiers = [
  {
    name: 'MM1',
    qualification: '≥ 10K trades/day',
    target: 5000,
    rewardType: 'Fixed daily incentive',
    reward: '1% of additional trade revenue',
    upgradeStreak: 3,
    retentionDays: 3,
    retentionWindow: 7,
    rebate: '0%',
    rebateValue: 0,
  },
  {
    name: 'MM2',
    qualification: '≥ 10K trades/day',
    target: 10000,
    rewardType: 'Fixed daily incentive',
    reward: '1% of additional trade revenue',
    upgradeStreak: 5,
    retentionDays: 3,
    retentionWindow: 7,
    rebate: '0%',
    rebateValue: 0,
  },
  {
    name: 'MM3',
    qualification: '≥ 10K trades/day',
    target: 25000,
    rewardType: 'Fixed daily incentive',
    reward: '1% of additional trade revenue',
    upgradeStreak: 7,
    retentionDays: 4,
    retentionWindow: 7,
    rebate: '0%',
    rebateValue: 0,
  },
  {
    name: 'MM4',
    qualification: '≥ 10K trades/day',
    target: 50000,
    rewardType: 'Incentive + rebate unlock',
    reward: '1% of additional trade revenue',
    upgradeStreak: 10,
    retentionDays: 4,
    retentionWindow: 7,
    rebate: '1%',
    rebateValue: 1,
  },
  {
    name: 'MM5',
    qualification: '≥ 10K trades/day',
    target: 100000,
    rewardType: 'Incentive + higher rebate',
    reward: '1% of additional trade revenue',
    upgradeStreak: 15,
    retentionDays: 5,
    retentionWindow: 7,
    rebate: '2%',
    rebateValue: 2,
  },
]

export const userMMData = {
  enrolled: true,
  currentTierIndex: 1, // MM2
  currentStreak: 3,
  todayLiquidityTrades: 7450,
  todayTotalTrades: 11200,
  dailyTarget: 10000,
  weeklyTargetHits: 3,
  totalRewardsThisWeek: 128.50,
  estimatedRebate: 0,
  last7Days: [
    { date: 'Feb 19', liquidityTrades: 8500, target: 10000, hit: false, reward: 0 },
    { date: 'Feb 20', liquidityTrades: 11200, target: 10000, hit: true, reward: 12.00 },
    { date: 'Feb 21', liquidityTrades: 13500, target: 10000, hit: true, reward: 35.00 },
    { date: 'Feb 22', liquidityTrades: 10800, target: 10000, hit: true, reward: 8.00 },
    { date: 'Feb 23', liquidityTrades: 6200, target: 10000, hit: false, reward: 0 },
    { date: 'Feb 24', liquidityTrades: 15200, target: 10000, hit: true, reward: 52.00 },
    { date: 'Feb 25', liquidityTrades: 7450, target: 10000, hit: false, reward: 0, inProgress: true },
  ] as Array<{
    date: string
    liquidityTrades: number
    target: number
    hit: boolean
    reward: number
    inProgress?: boolean
  }>,
}

// ─── Referral Configuration & Data ──────────────────────────────────────────

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
    {
      id: 'user_1',
      displayName: '0x7a3...f2d1',
      signupDate: 'Feb 10, 2026',
      trades: 142,
      lastMilestoneHit: 100,
      nextMilestone: 250,
      rewardCredited: 0.35,
      status: 'active' as const,
    },
    {
      id: 'user_2',
      displayName: '0x9c1...b4e7',
      signupDate: 'Feb 12, 2026',
      trades: 53,
      lastMilestoneHit: 50,
      nextMilestone: 100,
      rewardCredited: 0.175,
      status: 'active' as const,
    },
    {
      id: 'user_3',
      displayName: '0x2f8...a9c3',
      signupDate: 'Feb 15, 2026',
      trades: 8,
      lastMilestoneHit: 0,
      nextMilestone: 10,
      rewardCredited: 0,
      status: 'active' as const,
    },
    {
      id: 'user_4',
      displayName: '0x5d4...e1b6',
      signupDate: 'Feb 18, 2026',
      trades: 502,
      lastMilestoneHit: 500,
      nextMilestone: null,
      rewardCredited: 1.125,
      status: 'completed' as const,
    },
    {
      id: 'user_5',
      displayName: '0x1a9...c7f2',
      signupDate: 'Feb 20, 2026',
      trades: 0,
      lastMilestoneHit: 0,
      nextMilestone: 10,
      rewardCredited: 0,
      status: 'pending_verification' as const,
    },
  ],
}
