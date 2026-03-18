export interface Subscription {
  id: string;
  name: string;
  icon: string; // emoji
  category: string;
  amount: number;
  cycle: '月' | '季' | '年';
  monthlyAmount: number; // normalized
  nextBilling: string;
  status: 'active' | 'review' | 'cancel';
  aiReason?: string;
  aiSuggestion?: string;
  cancelUrl?: string;
  cancelMethod: 'url' | 'appstore' | 'contact';
  cancelNote: string;
  lastSeen: string; // last invoice date
  usageNote?: string;
}

export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 's1', name: 'Netflix', icon: '🎬', category: '影音串流',
    amount: 390, cycle: '月', monthlyAmount: 390,
    nextBilling: '2026-04-01', status: 'active',
    cancelUrl: 'https://www.netflix.com/cancelplan',
    cancelMethod: 'url', cancelNote: '登入 Netflix → 帳戶 → 取消會員資格',
    lastSeen: '2026-03-01',
  },
  {
    id: 's2', name: 'Spotify Premium', icon: '🎵', category: '音樂串流',
    amount: 149, cycle: '月', monthlyAmount: 149,
    nextBilling: '2026-03-25', status: 'active',
    cancelMethod: 'url', cancelUrl: 'https://www.spotify.com/account/subscription/',
    cancelNote: '登入 Spotify → 帳戶 → 訂閱 → 變更方案',
    lastSeen: '2026-02-25',
  },
  {
    id: 's3', name: 'KKBOX', icon: '🎶', category: '音樂串流',
    amount: 149, cycle: '月', monthlyAmount: 149,
    nextBilling: '2026-03-28', status: 'review',
    aiReason: '你同時訂了 Spotify 和 KKBOX，功能重複',
    aiSuggestion: '取消其中一個，每月省 $149',
    cancelMethod: 'appstore', cancelNote: 'App Store → 你的帳號 → 訂閱項目 → KKBOX → 取消',
    lastSeen: '2026-02-28',
  },
  {
    id: 's4', name: 'YouTube Premium', icon: '▶️', category: '影音串流',
    amount: 199, cycle: '月', monthlyAmount: 199,
    nextBilling: '2026-04-05', status: 'active',
    cancelMethod: 'url', cancelUrl: 'https://www.youtube.com/paid_memberships',
    cancelNote: '登入 YouTube → 購買內容與會員資格 → 管理會員資格 → 停用',
    lastSeen: '2026-03-05',
  },
  {
    id: 's5', name: 'Foodpanda Pro', icon: '🐼', category: '外送平台',
    amount: 99, cycle: '月', monthlyAmount: 99,
    nextBilling: '2026-03-20', status: 'cancel',
    aiReason: '近 60 天只叫了 1 次外送，月費 $99 不划算',
    aiSuggestion: '取消後單次運費約 $39，一個月叫不到 3 次就不需要',
    cancelMethod: 'url', cancelUrl: 'https://www.foodpanda.com.tw',
    cancelNote: 'Foodpanda App → 我的 → pandapro → 管理訂閱 → 取消',
    lastSeen: '2026-02-20', usageNote: '近 60 天僅 1 筆外送訂單',
  },
  {
    id: 's6', name: 'Uber One', icon: '🚗', category: '外送平台',
    amount: 120, cycle: '月', monthlyAmount: 120,
    nextBilling: '2026-04-02', status: 'review',
    aiReason: '近 30 天有 3 筆 UberEats 訂單，但省下的運費約 $80，低於月費 $120',
    aiSuggestion: '目前使用量剛好在損益邊緣，建議觀察一個月',
    cancelMethod: 'url', cancelUrl: 'https://www.ubereats.com',
    cancelNote: 'Uber App → 帳戶 → Uber One → 管理會員資格',
    lastSeen: '2026-03-02', usageNote: '近 30 天 3 筆訂單，省運費 $80',
  },
  {
    id: 's7', name: 'iCloud+ 200GB', icon: '☁️', category: '雲端儲存',
    amount: 90, cycle: '月', monthlyAmount: 90,
    nextBilling: '2026-04-10', status: 'active',
    cancelMethod: 'appstore', cancelNote: '設定 → Apple ID → 訂閱項目 → iCloud+ → 取消',
    lastSeen: '2026-03-10',
  },
  {
    id: 's8', name: 'ChatGPT Plus', icon: '🧠', category: '軟體工具',
    amount: 20, cycle: '月', monthlyAmount: 640, // USD 20 ≈ NTD 640
    nextBilling: '2026-04-08', status: 'active',
    cancelMethod: 'url', cancelUrl: 'https://chat.openai.com/',
    cancelNote: '登入 ChatGPT → 設定 → 訂閱 → 管理訂閱',
    lastSeen: '2026-03-08',
  },
  {
    id: 's9', name: '健身工廠', icon: '💪', category: '健身運動',
    amount: 1188, cycle: '月', monthlyAmount: 1188,
    nextBilling: '2026-04-01', status: 'review',
    aiReason: '近 3 個月發票記錄中無健身工廠消費（可能刷卡非載具）',
    aiSuggestion: '確認是否仍有在使用，若無可考慮暫停或取消',
    cancelMethod: 'contact', cancelNote: '需親自到櫃台辦理退會，或致電客服 0800-888-123',
    lastSeen: '2026-01-01', usageNote: '近 90 天無相關消費記錄',
  },
];

export const MONTHLY_SUB_TOTAL = SUBSCRIPTIONS
  .filter(s => s.status !== 'cancel')
  .reduce((sum, s) => sum + s.monthlyAmount, 0);

export const YEARLY_ESTIMATE = MONTHLY_SUB_TOTAL * 12;

export const CANCEL_SAVINGS = SUBSCRIPTIONS
  .filter(s => s.status === 'cancel' || s.status === 'review')
  .reduce((sum, s) => sum + s.monthlyAmount, 0);

export const SUB_HISTORY = [
  { month: '10月', amount: 2100 },
  { month: '11月', amount: 2100 },
  { month: '12月', amount: 2849 },
  { month: '1月', amount: 2849 },
  { month: '2月', amount: 2849 },
  { month: '3月', amount: 2849 },
];
