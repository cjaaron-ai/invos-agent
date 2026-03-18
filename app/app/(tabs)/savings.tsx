import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../data/theme';

const screenWidth = Dimensions.get('window').width;

const monthlySavings = [
  { month: '10月', amount: 320 },
  { month: '11月', amount: 580 },
  { month: '12月', amount: 890 },
  { month: '1月', amount: 1050 },
  { month: '2月', amount: 760 },
  { month: '3月', amount: 1280 },
];

const topOverpriced = [
  { emoji: '🧻', name: '舒潔衛生紙 100抽', overpaid: 189, percent: 33, channel: '全聯→家樂福' },
  { emoji: '🥣', name: '桂格燕麥片 800g', overpaid: 48, percent: 13, channel: '好市多→家樂福' },
  { emoji: '🧴', name: '白蘭洗衣精 2.5kg', overpaid: 44, percent: 16, channel: '全聯→好市多' },
  { emoji: '💧', name: '舒跑運動飲料 590ml', overpaid: 10, percent: 20, channel: '7-11→家樂福' },
  { emoji: '🍫', name: '金莎巧克力 3入', overpaid: 20, percent: 18, channel: '全聯→好市多' },
];

export default function SavingsOverview() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>省錢總覽</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.savingsBg }]}>
            <Text style={styles.summaryLabel}>本月可省</Text>
            <Text style={[styles.summaryValue, { color: COLORS.savingsGreen }]}>$1,280</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.aiCardStart }]}>
            <Text style={styles.summaryLabel}>已省下</Text>
            <Text style={[styles.summaryValue, { color: COLORS.primary }]}>$460</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.summaryLabel}>分析發票</Text>
            <Text style={[styles.summaryValue, { color: COLORS.accent }]}>47 張</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.summaryLabel}>覆購商品</Text>
            <Text style={[styles.summaryValue, { color: '#9C27B0' }]}>10 項</Text>
          </View>
        </View>

        {/* Savings Trend Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>省錢趨勢</Text>
          <LineChart
            data={{
              labels: monthlySavings.map(m => m.month),
              datasets: [{ data: monthlySavings.map(m => m.amount) }],
            }}
            width={screenWidth - 32}
            height={200}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(51, 102, 255, ${opacity})`,
              labelColor: () => COLORS.textSecondary,
              propsForDots: { r: '5', strokeWidth: '2', stroke: COLORS.primary },
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* Top Overpriced Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最多可省排行</Text>
          {topOverpriced.map((item, idx) => (
            <View key={idx} style={styles.rankRow}>
              <Text style={styles.rankNum}>#{idx + 1}</Text>
              <Text style={styles.rankEmoji}>{item.emoji}</Text>
              <View style={styles.rankDetail}>
                <Text style={styles.rankName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.rankChannel}>{item.channel}</Text>
              </View>
              <View style={styles.rankRight}>
                <Text style={styles.rankSavings}>省${item.overpaid}</Text>
                <Text style={styles.rankPercent}>-{item.percent}%</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { ...FONTS.titleLg, color: COLORS.textPrimary },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, padding: 16, borderRadius: 12 },
  summaryLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 24, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 8, marginBottom: 16 },
  sectionTitle: { ...FONTS.titleSm, color: COLORS.textPrimary, marginBottom: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rankNum: { width: 30, ...FONTS.bodyBold, color: COLORS.textSecondary },
  rankEmoji: { fontSize: 24, marginRight: 8 },
  rankDetail: { flex: 1 },
  rankName: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  rankChannel: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  rankRight: { alignItems: 'flex-end' },
  rankSavings: { ...FONTS.bodyBold, color: COLORS.savingsGreen },
  rankPercent: { ...FONTS.small, color: COLORS.danger },
});
