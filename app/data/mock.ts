// Mock data for Invos Agent demo

export interface Product {
  id: string;
  name: string;
  emoji: string;
  category: string;
  unit: string;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  // comparison data
  isRepurchase: boolean;
  lowestPrice?: number;
  lowestChannel?: string;
  lowestDate?: string;
  savingsPercent?: number;
}

export interface Invoice {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  channel: string;
  channelFull: string; // company full name
  carrierNumber: string;
  total: number;
  items: InvoiceItem[];
  totalSavings: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  emoji: string;
  mode: 'percentage' | 'fixed' | 'historical';
  threshold: number; // percentage or fixed price
  myLastPrice: number;
  myLastChannel: string;
  channels: string[];
  enabled: boolean;
  createdAt: string;
  triggeredAt?: string;
  triggeredPrice?: number;
  triggeredChannel?: string;
}

export interface PriceHistory {
  date: string;
  price: number;
  channel: string;
}

export interface NotificationItem {
  id: string;
  productName: string;
  emoji: string;
  yourPrice: number;
  newPrice: number;
  channel: string;
  savingsPercent: number;
  totalSavings: number;
  qty: number;
  date: string;
  read: boolean;
}

export const CHANNELS = ['好市多', '全聯', '7-11', '家樂福'];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: '舒潔衛生紙 100抽', emoji: '🧻', category: '日用品', unit: '包' },
  { id: 'p2', name: '白蘭洗衣精 2.5kg', emoji: '🧴', category: '清潔用品', unit: '瓶' },
  { id: 'p3', name: '林鳳營鮮奶 936ml', emoji: '🥛', category: '食品', unit: '瓶' },
  { id: 'p4', name: '可口可樂 330ml', emoji: '🥤', category: '飲料', unit: '罐' },
  { id: 'p5', name: '黑松沙士 330ml', emoji: '🥤', category: '飲料', unit: '罐' },
  { id: 'p6', name: '桂格燕麥片 800g', emoji: '🥣', category: '食品', unit: '罐' },
  { id: 'p7', name: '金莎巧克力 3入', emoji: '🍫', category: '零食', unit: '盒' },
  { id: 'p8', name: '妙管家洗碗精 1000ml', emoji: '🫧', category: '清潔用品', unit: '瓶' },
  { id: 'p9', name: '好自在衛生棉', emoji: '📦', category: '日用品', unit: '包' },
  { id: 'p10', name: '舒跑運動飲料 590ml', emoji: '💧', category: '飲料', unit: '瓶' },
];

export const INVOICES: Invoice[] = [
  {
    id: 'inv1',
    date: '2026-03-16',
    dayOfWeek: '週一',
    channel: '全聯',
    channelFull: '全聯實業股份有限公司忠孝分公司',
    carrierNumber: 'YG-02669210',
    total: 1135,
    items: [
      { productId: 'p1', name: '舒潔衛生紙 100抽', qty: 3, unitPrice: 189, subtotal: 567, isRepurchase: true, lowestPrice: 126, lowestChannel: '家樂福', lowestDate: '3/12', savingsPercent: 33 },
      { productId: 'p2', name: '白蘭洗衣精 2.5kg', qty: 1, unitPrice: 269, subtotal: 269, isRepurchase: true, lowestPrice: 225, lowestChannel: '好市多', lowestDate: '3/15', savingsPercent: 16 },
      { productId: 'p3', name: '林鳳營鮮奶 936ml', qty: 2, unitPrice: 85, subtotal: 170, isRepurchase: true, lowestPrice: 79, lowestChannel: '7-11', lowestDate: '3/16', savingsPercent: 7 },
      { productId: 'p4', name: '可口可樂 330ml', qty: 1, unitPrice: 29, subtotal: 29, isRepurchase: true, lowestPrice: 29, lowestChannel: '全聯', lowestDate: '3/16', savingsPercent: 0 },
      { productId: 'misc1', name: '購物袋', qty: 1, unitPrice: 2, subtotal: 2, isRepurchase: false },
    ],
    totalSavings: 245,
  },
  {
    id: 'inv2',
    date: '2026-03-16',
    dayOfWeek: '週一',
    channel: '7-11',
    channelFull: '統一超商股份有限公司台北市第四三一分公司',
    carrierNumber: 'YT-79955508',
    total: 89,
    items: [
      { productId: 'p4', name: '可口可樂 330ml', qty: 1, unitPrice: 32, subtotal: 32, isRepurchase: true, lowestPrice: 29, lowestChannel: '全聯', lowestDate: '3/16', savingsPercent: 9 },
      { productId: 'p10', name: '舒跑運動飲料 590ml', qty: 2, unitPrice: 25, subtotal: 50, isRepurchase: true, lowestPrice: 20, lowestChannel: '家樂福', lowestDate: '3/10', savingsPercent: 20 },
      { productId: 'misc2', name: '關東煮', qty: 1, unitPrice: 7, subtotal: 7, isRepurchase: false },
    ],
    totalSavings: 13,
  },
  {
    id: 'inv3',
    date: '2026-03-15',
    dayOfWeek: '週日',
    channel: '家樂福',
    channelFull: '家福股份有限公司中和分公司',
    carrierNumber: 'YV-87198303',
    total: 892,
    items: [
      { productId: 'p1', name: '舒潔衛生紙 100抽', qty: 6, unitPrice: 126, subtotal: 756, isRepurchase: true, lowestPrice: 126, lowestChannel: '家樂福', lowestDate: '3/15', savingsPercent: 0 },
      { productId: 'p7', name: '金莎巧克力 3入', qty: 2, unitPrice: 49, subtotal: 98, isRepurchase: true, lowestPrice: 45, lowestChannel: '好市多', lowestDate: '3/8', savingsPercent: 8 },
      { productId: 'p8', name: '妙管家洗碗精 1000ml', qty: 1, unitPrice: 38, subtotal: 38, isRepurchase: true, lowestPrice: 35, lowestChannel: '全聯', lowestDate: '3/14', savingsPercent: 8 },
    ],
    totalSavings: 11,
  },
  {
    id: 'inv4',
    date: '2026-03-15',
    dayOfWeek: '週日',
    channel: '好市多',
    channelFull: '好市多股份有限公司中和店',
    carrierNumber: 'YW-83612385',
    total: 2680,
    items: [
      { productId: 'p2', name: '白蘭洗衣精 2.5kg', qty: 3, unitPrice: 225, subtotal: 675, isRepurchase: true, lowestPrice: 225, lowestChannel: '好市多', lowestDate: '3/15', savingsPercent: 0 },
      { productId: 'p6', name: '桂格燕麥片 800g', qty: 2, unitPrice: 189, subtotal: 378, isRepurchase: true, lowestPrice: 165, lowestChannel: '家樂福', lowestDate: '3/5', savingsPercent: 13 },
      { productId: 'p9', name: '好自在衛生棉', qty: 4, unitPrice: 149, subtotal: 596, isRepurchase: true, lowestPrice: 135, lowestChannel: '全聯', lowestDate: '3/12', savingsPercent: 9 },
      { productId: 'misc3', name: '烤雞', qty: 1, unitPrice: 299, subtotal: 299, isRepurchase: false },
      { productId: 'misc4', name: '麵包組合', qty: 1, unitPrice: 159, subtotal: 159, isRepurchase: false },
      { productId: 'p5', name: '黑松沙士 330ml', qty: 24, unitPrice: 15, subtotal: 360, isRepurchase: true, lowestPrice: 15, lowestChannel: '好市多', lowestDate: '3/15', savingsPercent: 0 },
      { productId: 'misc5', name: '雜貨', qty: 1, unitPrice: 213, subtotal: 213, isRepurchase: false },
    ],
    totalSavings: 104,
  },
  {
    id: 'inv5',
    date: '2026-03-14',
    dayOfWeek: '週六',
    channel: '全聯',
    channelFull: '全聯實業股份有限公司復興分公司',
    carrierNumber: 'ZG-28212811',
    total: 456,
    items: [
      { productId: 'p3', name: '林鳳營鮮奶 936ml', qty: 2, unitPrice: 82, subtotal: 164, isRepurchase: true, lowestPrice: 79, lowestChannel: '7-11', lowestDate: '3/16', savingsPercent: 4 },
      { productId: 'p8', name: '妙管家洗碗精 1000ml', qty: 1, unitPrice: 35, subtotal: 35, isRepurchase: true, lowestPrice: 35, lowestChannel: '全聯', lowestDate: '3/14', savingsPercent: 0 },
      { productId: 'p5', name: '黑松沙士 330ml', qty: 3, unitPrice: 20, subtotal: 60, isRepurchase: true, lowestPrice: 15, lowestChannel: '好市多', lowestDate: '3/15', savingsPercent: 25 },
      { productId: 'misc6', name: '便當', qty: 1, unitPrice: 89, subtotal: 89, isRepurchase: false },
      { productId: 'p7', name: '金莎巧克力 3入', qty: 2, unitPrice: 55, subtotal: 110, isRepurchase: true, lowestPrice: 45, lowestChannel: '好市多', lowestDate: '3/8', savingsPercent: 18 },
    ],
    totalSavings: 31,
  },
  {
    id: 'inv6',
    date: '2026-03-12',
    dayOfWeek: '週四',
    channel: '7-11',
    channelFull: '統一超商股份有限公司台北市第二一八分公司',
    carrierNumber: 'YT-55832109',
    total: 145,
    items: [
      { productId: 'p3', name: '林鳳營鮮奶 936ml', qty: 1, unitPrice: 89, subtotal: 89, isRepurchase: true, lowestPrice: 79, lowestChannel: '7-11', lowestDate: '3/16', savingsPercent: 11 },
      { productId: 'p10', name: '舒跑運動飲料 590ml', qty: 1, unitPrice: 25, subtotal: 25, isRepurchase: true, lowestPrice: 20, lowestChannel: '家樂福', lowestDate: '3/10', savingsPercent: 20 },
      { productId: 'misc7', name: '御飯糰', qty: 1, unitPrice: 31, subtotal: 31, isRepurchase: false },
    ],
    totalSavings: 15,
  },
];

export const MARCH_TOTAL = 21433;
export const MARCH_SAVINGS = 1280;

// Price history for trend charts
export function generatePriceHistory(productId: string): PriceHistory[] {
  const baseData: Record<string, { channels: Record<string, { base: number; variance: number }> }> = {
    p1: { channels: { '全聯': { base: 185, variance: 15 }, '家樂福': { base: 135, variance: 20 }, '好市多': { base: 145, variance: 10 }, '7-11': { base: 199, variance: 5 } } },
    p2: { channels: { '全聯': { base: 265, variance: 15 }, '好市多': { base: 229, variance: 10 }, '家樂福': { base: 249, variance: 20 }, '7-11': { base: 289, variance: 5 } } },
    p3: { channels: { '全聯': { base: 83, variance: 5 }, '7-11': { base: 85, variance: 8 }, '家樂福': { base: 82, variance: 6 }, '好市多': { base: 79, variance: 3 } } },
    p4: { channels: { '全聯': { base: 29, variance: 3 }, '7-11': { base: 32, variance: 2 }, '家樂福': { base: 28, variance: 4 }, '好市多': { base: 25, variance: 2 } } },
    p5: { channels: { '全聯': { base: 20, variance: 3 }, '好市多': { base: 16, variance: 2 }, '7-11': { base: 22, variance: 2 }, '家樂福': { base: 18, variance: 3 } } },
    p6: { channels: { '好市多': { base: 175, variance: 20 }, '家樂福': { base: 169, variance: 15 }, '全聯': { base: 195, variance: 10 }, '7-11': { base: 209, variance: 5 } } },
    p7: { channels: { '好市多': { base: 46, variance: 5 }, '全聯': { base: 55, variance: 8 }, '家樂福': { base: 50, variance: 6 }, '7-11': { base: 59, variance: 3 } } },
    p8: { channels: { '全聯': { base: 36, variance: 4 }, '家樂福': { base: 38, variance: 5 }, '好市多': { base: 42, variance: 3 }, '7-11': { base: 45, variance: 2 } } },
    p9: { channels: { '全聯': { base: 139, variance: 12 }, '家樂福': { base: 142, variance: 15 }, '好市多': { base: 149, variance: 8 }, '7-11': { base: 159, variance: 5 } } },
    p10: { channels: { '家樂福': { base: 21, variance: 3 }, '全聯': { base: 23, variance: 2 }, '7-11': { base: 25, variance: 2 }, '好市多': { base: 20, variance: 2 } } },
  };

  const data = baseData[productId];
  if (!data) return [];

  const history: PriceHistory[] = [];
  const now = new Date('2026-03-18');

  for (let i = 90; i >= 0; i -= 3) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    for (const [channel, { base, variance }] of Object.entries(data.channels)) {
      if (Math.random() > 0.4) { // not every channel has data every day
        const price = Math.round(base + (Math.random() - 0.5) * variance * 2);
        history.push({ date: dateStr, price, channel });
      }
    }
  }

  return history;
}

export const MOCK_ALERTS: PriceAlert[] = [
  {
    id: 'a1', productId: 'p1', productName: '舒潔衛生紙 100抽', emoji: '🧻',
    mode: 'percentage', threshold: 15, myLastPrice: 189, myLastChannel: '全聯',
    channels: ['好市多', '全聯', '7-11', '家樂福'], enabled: true, createdAt: '2026-03-16',
    triggeredAt: '2026-03-15', triggeredPrice: 126, triggeredChannel: '家樂福',
  },
  {
    id: 'a2', productId: 'p2', productName: '白蘭洗衣精 2.5kg', emoji: '🧴',
    mode: 'fixed', threshold: 230, myLastPrice: 269, myLastChannel: '全聯',
    channels: ['好市多', '家樂福'], enabled: true, createdAt: '2026-03-16',
    triggeredAt: '2026-03-15', triggeredPrice: 225, triggeredChannel: '好市多',
  },
  {
    id: 'a3', productId: 'p6', productName: '桂格燕麥片 800g', emoji: '🥣',
    mode: 'historical', threshold: 0, myLastPrice: 189, myLastChannel: '好市多',
    channels: ['好市多', '全聯', '7-11', '家樂福'], enabled: true, createdAt: '2026-03-15',
  },
  {
    id: 'a4', productId: 'p3', productName: '林鳳營鮮奶 936ml', emoji: '🥛',
    mode: 'percentage', threshold: 10, myLastPrice: 85, myLastChannel: '全聯',
    channels: ['全聯', '7-11', '家樂福'], enabled: false, createdAt: '2026-03-14',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1', productName: '舒潔衛生紙 100抽', emoji: '🧻',
    yourPrice: 189, newPrice: 126, channel: '家樂福',
    savingsPercent: 33, totalSavings: 189, qty: 3,
    date: '2026-03-15', read: false,
  },
  {
    id: 'n2', productName: '白蘭洗衣精 2.5kg', emoji: '🧴',
    yourPrice: 269, newPrice: 225, channel: '好市多',
    savingsPercent: 16, totalSavings: 44, qty: 1,
    date: '2026-03-15', read: true,
  },
  {
    id: 'n3', productName: '桂格燕麥片 800g', emoji: '🥣',
    yourPrice: 189, newPrice: 165, channel: '家樂福',
    savingsPercent: 13, totalSavings: 48, qty: 2,
    date: '2026-03-05', read: true,
  },
];
