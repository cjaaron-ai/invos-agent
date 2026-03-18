import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../data/theme';

const SW = Dimensions.get('window').width;

// ── Hero Card ──
function HeroCard() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.hero, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={s.heroRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.heroLabel}>本月可優化</Text>
          <Text style={s.heroAmount}>$4,129</Text>
        </View>
        <View style={s.heroRight}>
          <View style={s.heroSplit}>
            <Text style={s.heroSplitNum}>$1,280</Text>
            <Text style={s.heroSplitLabel}>比價省</Text>
          </View>
          <View style={s.heroSplit}>
            <Text style={s.heroSplitNum}>$2,849</Text>
            <Text style={s.heroSplitLabel}>訂閱省</Text>
          </View>
        </View>
      </View>
      <View style={s.heroBar}><View style={s.heroBarFill} /></View>
      <Text style={s.heroBarLabel}>已優化 $460 / 目標 $4,129</Text>
    </Animated.View>
  );
}

// ── Renewal Reminder Card ──
function RenewalCard() {
  return (
    <View style={[s.card, s.cardUrgent]}>
      <View style={s.cardHeader}>
        <View style={s.urgentDot} />
        <Text style={s.cardHeaderText}>續約提醒</Text>
        <Text style={s.cardTime}>明天到期</Text>
      </View>
      <View style={s.renewRow}>
        <Text style={s.renewIcon}>🎵</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.renewName}>Spotify Premium</Text>
          <Text style={s.renewMeta}>$149/月 · 3/25 自動續約</Text>
        </View>
      </View>
      <View style={s.renewActions}>
        <TouchableOpacity style={s.renewKeep}><Text style={s.renewKeepText}>繼續訂閱</Text></TouchableOpacity>
        <TouchableOpacity style={s.renewCancel}><Text style={s.renewCancelText}>取消</Text></TouchableOpacity>
      </View>
    </View>
  );
}

// ── Price Drop Card ──
function PriceDropCard({ router }: { router: any }) {
  return (
    <TouchableOpacity style={[s.card, s.cardDrop]} onPress={() => router.push('/product/p1')} activeOpacity={0.7}>
      <View style={s.cardHeader}>
        <View style={s.dropDot} />
        <Text style={s.cardHeaderText}>降價速報</Text>
        <Text style={s.cardTime}>2 小時前</Text>
      </View>
      <View style={s.dropBody}>
        <Text style={s.dropEmoji}>🧻</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.dropName}>舒潔衛生紙降到歷史低價</Text>
          <View style={s.dropPriceRow}>
            <Text style={s.dropOld}>$189</Text>
            <Ionicons name="arrow-forward" size={12} color="#999" />
            <Text style={s.dropNew}>$126</Text>
            <Text style={s.dropPercent}>↓33%</Text>
          </View>
          <Text style={s.dropSave}>家樂福 · 買 3 包省 $189</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Invoice Analysis Card ──
function AnalysisCard({ router }: { router: any }) {
  const items = [
    { emoji: '🧻', name: '舒潔衛生紙', price: '$126', save: '-33%' },
    { emoji: '🧴', name: '白蘭洗衣精', price: '$225', save: '-16%' },
    { emoji: '🥛', name: '林鳳營鮮奶', price: '$79', save: '-7%' },
  ];
  return (
    <TouchableOpacity style={s.card} onPress={() => router.push('/report/inv1')} activeOpacity={0.7}>
      <View style={s.cardHeader}>
        <Ionicons name="receipt" size={14} color={COLORS.primary} />
        <Text style={[s.cardHeaderText, { marginLeft: 4 }]}>發票比價分析</Text>
        <Text style={s.cardTime}>今天 14:32</Text>
      </View>
      <View style={s.analysisTop}>
        <Text style={s.analysisStore}>全聯 3/16</Text>
        <View style={s.analysisBadge}><Text style={s.analysisBadgeText}>可省 $245</Text></View>
      </View>
      {items.map((item, i) => (
        <View key={i} style={s.analysisRow}>
          <Text style={s.analysisEmoji}>{item.emoji}</Text>
          <Text style={s.analysisName}>{item.name}</Text>
          <Text style={s.analysisPrice}>{item.price}</Text>
          <Text style={s.analysisSave}>{item.save}</Text>
        </View>
      ))}
      <View style={s.cardFooter}>
        <Text style={s.cardFooterText}>查看完整報告 →</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Subscription Alert Card ──
function SubAlertCard() {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <Ionicons name="repeat" size={14} color="#FF8C00" />
        <Text style={[s.cardHeaderText, { marginLeft: 4 }]}>訂閱偵測</Text>
        <Text style={s.cardTime}>今天 14:32</Text>
      </View>
      <Text style={s.subAlertTitle}>發現功能重複的訂閱</Text>
      <View style={s.subCompare}>
        <View style={s.subCompareItem}>
          <Text style={s.subCompareIcon}>🎵</Text>
          <Text style={s.subCompareName}>Spotify</Text>
          <Text style={s.subComparePrice}>$149/月</Text>
        </View>
        <Text style={s.subVs}>vs</Text>
        <View style={s.subCompareItem}>
          <Text style={s.subCompareIcon}>🎶</Text>
          <Text style={s.subCompareName}>KKBOX</Text>
          <Text style={s.subComparePrice}>$149/月</Text>
        </View>
      </View>
      <View style={s.subAlertTip}>
        <Ionicons name="sparkles" size={14} color={COLORS.primary} />
        <Text style={s.subAlertTipText}> 都是音樂串流，取消一個每月省 $149</Text>
      </View>
      <View style={s.subActions}>
        <TouchableOpacity style={s.subActionBtn}>
          <Text style={s.subActionText}>取消 KKBOX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.subActionBtnOutline}>
          <Text style={s.subActionTextOutline}>比較功能</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Foodpanda Card ──
function FoodpandaCard() {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <Ionicons name="repeat" size={14} color="#FF3B30" />
        <Text style={[s.cardHeaderText, { marginLeft: 4 }]}>訂閱健檢</Text>
        <Text style={s.cardTime}>昨天</Text>
      </View>
      <View style={s.fpRow}>
        <Text style={s.fpIcon}>🐼</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.fpName}>Foodpanda Pro</Text>
          <Text style={s.fpMeta}>$99/月 · 近 60 天只叫了 1 次外送</Text>
        </View>
        <View style={s.fpBadge}><Text style={s.fpBadgeText}>建議取消</Text></View>
      </View>
      <Text style={s.fpReason}>
        💡 取消後單次運費 $39，一個月叫不到 3 次就不划算。每月省 $99，年省 $1,188。
      </Text>
      <TouchableOpacity style={s.fpCancelBtn}>
        <Text style={s.fpCancelText}>前往取消</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Monthly Report Card ──
function MonthlyCard() {
  return (
    <View style={[s.card, { backgroundColor: '#F8F9FC' }]}>
      <View style={s.cardHeader}>
        <Ionicons name="bar-chart" size={14} color={COLORS.primary} />
        <Text style={[s.cardHeaderText, { marginLeft: 4 }]}>月度報告</Text>
        <Text style={s.cardTime}>3月</Text>
      </View>
      <Text style={s.monthTitle}>📊 三月消費摘要</Text>
      <View style={s.monthGrid}>
        <View style={s.monthItem}>
          <Text style={s.monthNum}>$21,433</Text>
          <Text style={s.monthLabel}>總消費</Text>
        </View>
        <View style={s.monthItem}>
          <Text style={[s.monthNum, { color: COLORS.savingsGreen }]}>$1,280</Text>
          <Text style={s.monthLabel}>比價可省</Text>
        </View>
        <View style={s.monthItem}>
          <Text style={[s.monthNum, { color: '#FF8C00' }]}>$2,849</Text>
          <Text style={s.monthLabel}>訂閱支出</Text>
        </View>
        <View style={s.monthItem}>
          <Text style={[s.monthNum, { color: COLORS.primary }]}>家樂福</Text>
          <Text style={s.monthLabel}>最划算通路</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ──
export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <HeroCard />

        {/* Section: Needs Action */}
        <Text style={s.sectionLabel}>🔴 需要你的注意</Text>
        <RenewalCard />
        <PriceDropCard router={router} />

        {/* Section: New Analysis */}
        <Text style={s.sectionLabel}>🟡 最新分析</Text>
        <AnalysisCard router={router} />
        <SubAlertCard />
        <FoodpandaCard />

        {/* Section: Reports */}
        <Text style={s.sectionLabel}>📊 報告</Text>
        <MonthlyCard />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Scan Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.scanBtn} activeOpacity={0.85}>
          <Ionicons name="scan-outline" size={20} color="#FFF" />
          <Text style={s.scanText}>  掃描發票</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  scroll: { padding: 16, paddingTop: 12 },

  // Hero
  hero: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, marginBottom: 20 },
  heroRow: { flexDirection: 'row' },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  heroAmount: { fontSize: 40, fontWeight: '900', color: '#FFF', marginTop: 2, letterSpacing: -1 },
  heroRight: { justifyContent: 'center', gap: 6 },
  heroSplit: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  heroSplitNum: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  heroSplitLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  heroBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, marginTop: 16 },
  heroBarFill: { height: 5, width: '11%', backgroundColor: '#00E676', borderRadius: 3 },
  heroBarLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 },

  // Section
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#999', marginBottom: 10, marginTop: 8, letterSpacing: 0.5 },

  // Card base
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  cardUrgent: { borderLeftWidth: 3, borderLeftColor: '#FF8C00' },
  cardDrop: { borderLeftWidth: 3, borderLeftColor: '#FF3B30' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeaderText: { fontSize: 12, fontWeight: '700', color: '#999', flex: 1 },
  cardTime: { fontSize: 11, color: '#CCC' },
  cardFooter: { alignItems: 'center', marginTop: 12 },
  cardFooterText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  // Urgent dots
  urgentDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 6 },
  dropDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 6 },

  // Renewal
  renewRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  renewIcon: { fontSize: 28, marginRight: 12 },
  renewName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  renewMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  renewActions: { flexDirection: 'row', gap: 10 },
  renewKeep: { flex: 1, backgroundColor: '#F0F0F0', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  renewKeepText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  renewCancel: { flex: 1, backgroundColor: '#FFEBEE', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  renewCancelText: { fontSize: 14, fontWeight: '600', color: '#FF3B30' },

  // Price Drop
  dropBody: { flexDirection: 'row', alignItems: 'center' },
  dropEmoji: { fontSize: 32, marginRight: 12 },
  dropName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  dropPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dropOld: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  dropNew: { fontSize: 18, fontWeight: '900', color: COLORS.savingsGreen },
  dropPercent: { fontSize: 12, fontWeight: '700', color: '#E65100', backgroundColor: '#FFF3E0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dropSave: { fontSize: 12, color: '#999', marginTop: 4 },

  // Analysis
  analysisTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  analysisStore: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  analysisBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  analysisBadgeText: { fontSize: 12, fontWeight: '700', color: '#E65100' },
  analysisRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  analysisEmoji: { fontSize: 16, width: 28 },
  analysisName: { flex: 1, fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  analysisPrice: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginRight: 8 },
  analysisSave: { fontSize: 12, fontWeight: '700', color: '#E65100', width: 38, textAlign: 'right' },

  // Sub alert
  subAlertTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  subCompare: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  subCompareItem: { alignItems: 'center', flex: 1 },
  subCompareIcon: { fontSize: 32 },
  subCompareName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginTop: 4 },
  subComparePrice: { fontSize: 12, color: '#999', marginTop: 2 },
  subVs: { fontSize: 14, fontWeight: '700', color: '#CCC', marginHorizontal: 8 },
  subAlertTip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4FF', borderRadius: 10, padding: 10, marginBottom: 12 },
  subAlertTipText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  subActions: { flexDirection: 'row', gap: 10 },
  subActionBtn: { flex: 1, backgroundColor: '#FF3B30', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  subActionText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  subActionBtnOutline: { flex: 1, borderWidth: 1.5, borderColor: COLORS.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  subActionTextOutline: { fontSize: 14, fontWeight: '600', color: COLORS.primary },

  // Foodpanda
  fpRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  fpIcon: { fontSize: 28, marginRight: 12 },
  fpName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  fpMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  fpBadge: { backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  fpBadgeText: { fontSize: 11, fontWeight: '700', color: '#FF3B30' },
  fpReason: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 12 },
  fpCancelBtn: { backgroundColor: '#FF3B30', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  fpCancelText: { fontSize: 14, fontWeight: '600', color: '#FFF' },

  // Monthly
  monthTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthItem: { width: (SW - 72) / 2, backgroundColor: '#FFF', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  monthNum: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  monthLabel: { fontSize: 11, color: '#999', marginTop: 4 },

  // Bottom
  bottomBar: { position: 'absolute', bottom: 90, left: 16, right: 16 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  scanText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
