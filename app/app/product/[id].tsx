import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../data/theme';
import { PRODUCTS, generatePriceHistory, CHANNELS } from '../../data/mock';

const screenWidth = Dimensions.get('window').width;

const CHANNEL_COLORS: Record<string, string> = {
  '好市多': '#E91E63',
  '全聯': '#4CAF50',
  '7-11': '#FF9800',
  '家樂福': '#2196F3',
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const [period, setPeriod] = useState<30 | 60 | 90>(30);

  const priceHistory = useMemo(() => generatePriceHistory(id || ''), [id]);

  if (!product) {
    return <View style={styles.container}><Text style={{ textAlign: 'center', marginTop: 40 }}>找不到商品</Text></View>;
  }

  // Filter by period
  const cutoff = new Date('2026-03-18');
  cutoff.setDate(cutoff.getDate() - period);
  const filtered = priceHistory.filter(p => new Date(p.date) >= cutoff);

  // Stats
  const allPrices = filtered.map(p => p.price);
  const lowestPrice = Math.min(...allPrices);
  const highestPrice = Math.max(...allPrices);
  const avgPrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);

  // Channel comparison (latest price per channel)
  const channelPrices = CHANNELS.map(ch => {
    const channelData = filtered.filter(p => p.channel === ch).sort((a, b) => b.date.localeCompare(a.date));
    return {
      channel: ch,
      price: channelData[0]?.price ?? null,
      date: channelData[0]?.date ?? null,
      isLowest: channelData[0]?.price === lowestPrice,
    };
  }).filter(c => c.price !== null);

  // Chart data - aggregate by date (average across channels)
  const dateMap: Record<string, number[]> = {};
  for (const p of filtered) {
    if (!dateMap[p.date]) dateMap[p.date] = [];
    dateMap[p.date].push(p.price);
  }
  const chartDates = Object.keys(dateMap).sort();
  const chartPrices = chartDates.map(d => Math.round(dateMap[d].reduce((a, b) => a + b, 0) / dateMap[d].length));

  // Only show every Nth label
  const labelStep = Math.max(1, Math.floor(chartDates.length / 6));
  const chartLabels = chartDates.map((d, i) => i % labelStep === 0 ? d.slice(5) : '');

  return (
    <ScrollView style={styles.container}>
      {/* Product Header */}
      <View style={styles.productHeader}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>{product.category} · {product.unit}</Text>
        </View>
      </View>

      {/* Price Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLORS.savingsBg }]}>
          <Text style={styles.statLabel}>歷史最低</Text>
          <Text style={[styles.statValue, { color: COLORS.savingsGreen }]}>${lowestPrice}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.aiCardStart }]}>
          <Text style={styles.statLabel}>平均價格</Text>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>${avgPrice}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.statLabel}>歷史最高</Text>
          <Text style={[styles.statValue, { color: COLORS.accent }]}>${highestPrice}</Text>
        </View>
      </View>

      {/* Period Toggle */}
      <View style={styles.periodToggle}>
        {([30, 60, 90] as const).map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
              {p}天
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Price Trend Chart */}
      {chartPrices.length > 1 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>價格趨勢</Text>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartPrices }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(51, 102, 255, ${opacity})`,
              labelColor: () => COLORS.textSecondary,
              propsForDots: { r: '3', strokeWidth: '1', stroke: COLORS.primary },
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>
      )}

      {/* Channel Comparison Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>各通路比價</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>通路</Text>
            <Text style={[styles.tableHeaderText, { width: 80, textAlign: 'right' }]}>價格</Text>
            <Text style={[styles.tableHeaderText, { width: 90, textAlign: 'right' }]}>日期</Text>
          </View>
          {channelPrices.sort((a, b) => (a.price ?? 999) - (b.price ?? 999)).map((cp, idx) => (
            <View key={idx} style={[styles.tableRow, cp.isLowest && styles.tableRowLowest]}>
              <View style={[styles.channelDot, { backgroundColor: CHANNEL_COLORS[cp.channel] || COLORS.textSecondary }]} />
              <Text style={[styles.tableCell, { flex: 1 }]}>{cp.channel}</Text>
              <Text style={[styles.tableCell, { width: 80, textAlign: 'right', fontWeight: cp.isLowest ? '700' : '400', color: cp.isLowest ? COLORS.savingsGreen : COLORS.textPrimary }]}>
                ${cp.price}{cp.isLowest ? ' 🏆' : ''}
              </Text>
              <Text style={[styles.tableCellSm, { width: 90, textAlign: 'right' }]}>{cp.date?.slice(5)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Set Alert Button */}
      <TouchableOpacity style={styles.alertBtn}>
        <Text style={styles.alertBtnText}>🔔 設定低價提醒</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  productHeader: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  productEmoji: { fontSize: 48 },
  productInfo: { marginLeft: 16 },
  productName: { ...FONTS.titleMd, color: COLORS.textPrimary },
  productCategory: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  statCard: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  statLabel: { ...FONTS.small, color: COLORS.textSecondary },
  statValue: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  periodToggle: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 8 },
  periodBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.cardGray },
  periodBtnActive: { backgroundColor: COLORS.primary },
  periodBtnText: { ...FONTS.caption, color: COLORS.textSecondary },
  periodBtnTextActive: { color: COLORS.white, fontWeight: '600' },
  chartContainer: { padding: 16 },
  section: { padding: 16 },
  sectionTitle: { ...FONTS.titleSm, color: COLORS.textPrimary, marginBottom: 12 },
  table: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  tableHeader: { flexDirection: 'row', padding: 12, backgroundColor: COLORS.cardGray },
  tableHeaderText: { ...FONTS.small, color: COLORS.textSecondary, fontWeight: '600' },
  tableRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  tableRowLowest: { backgroundColor: '#F1F8E9' },
  channelDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  tableCell: { ...FONTS.body, color: COLORS.textPrimary },
  tableCellSm: { ...FONTS.small, color: COLORS.textSecondary },
  alertBtn: { marginHorizontal: 16, padding: 16, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: 'center' },
  alertBtnText: { ...FONTS.bodyBold, color: COLORS.white },
});
