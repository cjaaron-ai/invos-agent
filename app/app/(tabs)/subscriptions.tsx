import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  Modal, Linking, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../data/theme';
import {
  SUBSCRIPTIONS, Subscription,
  MONTHLY_SUB_TOTAL, YEARLY_ESTIMATE, CANCEL_SAVINGS, SUB_HISTORY,
} from '../../data/subscriptions';

const SW = Dimensions.get('window').width;

const STATUS_CONFIG = {
  active: { label: '使用中', color: COLORS.savingsGreen, bg: '#E8F5E9' },
  review: { label: '建議檢視', color: '#FF8C00', bg: '#FFF3E0' },
  cancel: { label: '建議取消', color: '#FF3B30', bg: '#FFEBEE' },
};

const CATEGORY_ORDER = ['影音串流', '音樂串流', '外送平台', '雲端儲存', '軟體工具', '健身運動'];

export default function SubscriptionsScreen() {
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [subs, setSubs] = useState(SUBSCRIPTIONS);

  const grouped: Record<string, Subscription[]> = {};
  for (const s of subs) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }

  const activeCount = subs.filter(s => s.status !== 'cancel').length;
  const reviewCount = subs.filter(s => s.status === 'review' || s.status === 'cancel').length;

  return (
    <SafeAreaView style={st.container}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={st.title}>訂閱管理</Text>
        <Text style={st.subtitle}>AI 自動從發票中偵測到的訂閱服務</Text>

        {/* Summary */}
        <View style={st.summaryCard}>
          <View style={st.summaryMain}>
            <Text style={st.summaryLabel}>每月訂閱支出</Text>
            <Text style={st.summaryAmount}>${MONTHLY_SUB_TOTAL.toLocaleString()}</Text>
            <Text style={st.summaryYear}>年度預估 ${YEARLY_ESTIMATE.toLocaleString()}</Text>
          </View>
          <View style={st.summaryRight}>
            <View style={st.summaryBadge}>
              <Text style={st.summaryBadgeNum}>{activeCount}</Text>
              <Text style={st.summaryBadgeLabel}>進行中</Text>
            </View>
            {reviewCount > 0 && (
              <View style={[st.summaryBadge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[st.summaryBadgeNum, { color: '#FF8C00' }]}>{reviewCount}</Text>
                <Text style={[st.summaryBadgeLabel, { color: '#FF8C00' }]}>需檢視</Text>
              </View>
            )}
          </View>
        </View>

        {/* AI Savings suggestion */}
        {CANCEL_SAVINGS > 0 && (
          <View style={st.aiTip}>
            <Ionicons name="sparkles" size={18} color={COLORS.primary} />
            <Text style={st.aiTipText}>
              AI 建議檢視 {reviewCount} 個訂閱，取消後每月可省 <Text style={{ fontWeight: '800' }}>${CANCEL_SAVINGS.toLocaleString()}</Text>
            </Text>
          </View>
        )}

        {/* Subscription List by Category */}
        {CATEGORY_ORDER.filter(c => grouped[c]).map(category => (
          <View key={category}>
            <Text style={st.categoryTitle}>{category}</Text>
            {grouped[category].map(sub => {
              const cfg = STATUS_CONFIG[sub.status];
              return (
                <TouchableOpacity
                  key={sub.id}
                  style={st.subCard}
                  onPress={() => setSelected(sub)}
                  activeOpacity={0.7}
                >
                  <Text style={st.subIcon}>{sub.icon}</Text>
                  <View style={st.subInfo}>
                    <Text style={st.subName}>{sub.name}</Text>
                    <Text style={st.subMeta}>${sub.monthlyAmount}/月 · 下次 {sub.nextBilling.slice(5)}</Text>
                    {sub.aiReason && (
                      <Text style={st.subReason} numberOfLines={1}>⚡ {sub.aiReason}</Text>
                    )}
                  </View>
                  <View style={[st.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[st.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Trend Chart */}
        <Text style={[st.categoryTitle, { marginTop: 24 }]}>支出趨勢</Text>
        <View style={st.chartWrap}>
          <LineChart
            data={{
              labels: SUB_HISTORY.map(h => h.month),
              datasets: [{ data: SUB_HISTORY.map(h => h.amount) }],
            }}
            width={SW - 64}
            height={160}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              decimalPlaces: 0,
              color: (o = 1) => `rgba(51,102,255,${o})`,
              labelColor: () => COLORS.textSecondary,
              propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={st.modalOverlay}>
          <View style={st.modalContent}>
            <View style={st.modalHandle} />

            {selected && (
              <>
                {/* Header */}
                <View style={st.modalHeader}>
                  <Text style={st.modalIcon}>{selected.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={st.modalName}>{selected.name}</Text>
                    <Text style={st.modalCategory}>{selected.category}</Text>
                  </View>
                  <View style={[st.statusBadge, { backgroundColor: STATUS_CONFIG[selected.status].bg }]}>
                    <Text style={[st.statusText, { color: STATUS_CONFIG[selected.status].color }]}>{STATUS_CONFIG[selected.status].label}</Text>
                  </View>
                </View>

                {/* Price */}
                <View style={st.modalPriceRow}>
                  <View style={st.modalPriceItem}>
                    <Text style={st.modalPriceLabel}>金額</Text>
                    <Text style={st.modalPriceValue}>${selected.monthlyAmount}/月</Text>
                  </View>
                  <View style={st.modalPriceItem}>
                    <Text style={st.modalPriceLabel}>下次扣款</Text>
                    <Text style={st.modalPriceValue}>{selected.nextBilling}</Text>
                  </View>
                  <View style={st.modalPriceItem}>
                    <Text style={st.modalPriceLabel}>年度費用</Text>
                    <Text style={st.modalPriceValue}>${(selected.monthlyAmount * 12).toLocaleString()}</Text>
                  </View>
                </View>

                {/* AI Analysis */}
                {selected.aiReason && (
                  <View style={st.aiBox}>
                    <Text style={st.aiBoxTitle}>🤖 AI 分析</Text>
                    <Text style={st.aiBoxReason}>{selected.aiReason}</Text>
                    {selected.aiSuggestion && (
                      <Text style={st.aiBoxSuggest}>💡 {selected.aiSuggestion}</Text>
                    )}
                    {selected.usageNote && (
                      <Text style={st.aiBoxUsage}>📊 {selected.usageNote}</Text>
                    )}
                  </View>
                )}

                {/* Cancel Guide */}
                <View style={st.cancelBox}>
                  <Text style={st.cancelTitle}>取消方式</Text>
                  <Text style={st.cancelNote}>{selected.cancelNote}</Text>
                </View>

                {/* Actions */}
                <TouchableOpacity
                  style={st.cancelBtn}
                  onPress={() => {
                    if (selected.cancelUrl) Linking.openURL(selected.cancelUrl);
                    setSelected(null);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color="#FFF" />
                  <Text style={st.cancelBtnText}>
                    {selected.cancelMethod === 'appstore' ? '  前往 App Store 取消' :
                     selected.cancelMethod === 'contact' ? '  聯繫客服取消' :
                     '  前往取消頁面'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={st.keepBtn} onPress={() => setSelected(null)}>
                  <Text style={st.keepBtnText}>繼續保留</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginBottom: 16 },

  // Summary
  summaryCard: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, marginBottom: 12 },
  summaryMain: { flex: 1 },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  summaryAmount: { fontSize: 36, fontWeight: '900', color: '#FFF', marginTop: 4 },
  summaryYear: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  summaryRight: { justifyContent: 'center', gap: 8 },
  summaryBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  summaryBadgeNum: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  summaryBadgeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // AI Tip
  aiTip: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F0F4FF', borderRadius: 14, padding: 14, gap: 10, marginBottom: 20 },
  aiTipText: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 20 },

  // Category
  categoryTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1 },

  // Sub Card
  subCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  subIcon: { fontSize: 28, marginRight: 12 },
  subInfo: { flex: 1 },
  subName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  subMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  subReason: { fontSize: 11, color: '#FF8C00', marginTop: 3, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // Chart
  chartWrap: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginTop: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalIcon: { fontSize: 40, marginRight: 14 },
  modalName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  modalCategory: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  modalPriceRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modalPriceItem: { flex: 1, backgroundColor: '#F8F9FC', borderRadius: 12, padding: 12, alignItems: 'center' },
  modalPriceLabel: { fontSize: 11, color: COLORS.textSecondary },
  modalPriceValue: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginTop: 4 },
  aiBox: { backgroundColor: '#F0F4FF', borderRadius: 14, padding: 14, marginBottom: 16 },
  aiBoxTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  aiBoxReason: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 20 },
  aiBoxSuggest: { fontSize: 13, color: COLORS.primary, marginTop: 8, lineHeight: 20 },
  aiBoxUsage: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6 },
  cancelBox: { backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14, marginBottom: 20 },
  cancelTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 6 },
  cancelNote: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 20 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF3B30', paddingVertical: 16, borderRadius: 14 },
  cancelBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  keepBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  keepBtnText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
});
