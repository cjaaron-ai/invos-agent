import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../data/theme';

const { width: SW } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <Animated.View style={[s.hero, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <View style={s.heroTop}>
            <View>
              <Text style={s.heroLabel}>本月 AI 幫你找到</Text>
              <Text style={s.heroAmount}>$1,280</Text>
              <Text style={s.heroSub}>可節省金額</Text>
            </View>
            <View style={s.agentBubble}>
              <Text style={s.agentEmoji}>🤖</Text>
              <View style={s.agentDot} />
            </View>
          </View>
          <View style={s.heroBar}>
            <View style={s.heroBarFill} />
          </View>
          <Text style={s.heroBarLabel}>已省 $460 / 目標 $1,280</Text>
        </Animated.View>

        {/* ── Alert: Price Drop ── */}
        <TouchableOpacity style={s.alertCard} onPress={() => router.push('/product/p1')} activeOpacity={0.7}>
          <View style={s.alertDot} />
          <View style={s.alertContent}>
            <Text style={s.alertTitle}>🧻 舒潔衛生紙降價了</Text>
            <Text style={s.alertBody}>
              家樂福 <Text style={s.alertPrice}>$126</Text>
              <Text style={s.alertOld}>  原 $189</Text>
            </Text>
            <Text style={s.alertSave}>買 3 包省 $189</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* ── Recent Analysis ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>最近分析</Text>
        </View>

        <TouchableOpacity style={s.analysisCard} onPress={() => router.push('/report/inv1')} activeOpacity={0.7}>
          <View style={s.analysisHeader}>
            <View>
              <Text style={s.analysisStore}>全聯</Text>
              <Text style={s.analysisDate}>3/16 · 5 件商品</Text>
            </View>
            <View style={s.analysisBadge}>
              <Text style={s.analysisBadgeText}>可省 $245</Text>
            </View>
          </View>
          <View style={s.analysisItems}>
            {[
              { emoji: '🧻', name: '舒潔衛生紙', you: 189, best: 126, ch: '家樂福' },
              { emoji: '🧴', name: '白蘭洗衣精', you: 269, best: 225, ch: '好市多' },
              { emoji: '🥛', name: '林鳳營鮮奶', you: 85, best: 79, ch: '7-11' },
            ].map((item, i) => (
              <View key={i} style={s.analysisRow}>
                <Text style={s.analysisRowEmoji}>{item.emoji}</Text>
                <Text style={s.analysisRowName}>{item.name}</Text>
                <Text style={s.analysisRowPrice}>${item.best}</Text>
                <Text style={s.analysisRowSave}>-{Math.round((1 - item.best / item.you) * 100)}%</Text>
              </View>
            ))}
          </View>
          <View style={s.analysisFooter}>
            <Text style={s.analysisFooterText}>查看完整報告</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.analysisCard} onPress={() => router.push('/report/inv4')} activeOpacity={0.7}>
          <View style={s.analysisHeader}>
            <View>
              <Text style={s.analysisStore}>好市多</Text>
              <Text style={s.analysisDate}>3/15 · 7 件商品</Text>
            </View>
            <View style={[s.analysisBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[s.analysisBadgeText, { color: COLORS.savingsGreen }]}>可省 $104</Text>
            </View>
          </View>
          <View style={s.analysisItems}>
            {[
              { emoji: '🥣', name: '桂格燕麥片', you: 189, best: 165, ch: '家樂福' },
              { emoji: '📦', name: '好自在衛生棉', you: 149, best: 135, ch: '全聯' },
            ].map((item, i) => (
              <View key={i} style={s.analysisRow}>
                <Text style={s.analysisRowEmoji}>{item.emoji}</Text>
                <Text style={s.analysisRowName}>{item.name}</Text>
                <Text style={s.analysisRowPrice}>${item.best}</Text>
                <Text style={s.analysisRowSave}>-{Math.round((1 - item.best / item.you) * 100)}%</Text>
              </View>
            ))}
          </View>
          <View style={s.analysisFooter}>
            <Text style={s.analysisFooterText}>查看完整報告</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* ── Insights ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>AI 洞察</Text>
        </View>

        <View style={s.insightRow}>
          <View style={[s.insightCard, { backgroundColor: '#F0F4FF' }]}>
            <Text style={s.insightIcon}>🏪</Text>
            <Text style={s.insightLabel}>最划算通路</Text>
            <Text style={s.insightValue}>家樂福</Text>
          </View>
          <View style={[s.insightCard, { backgroundColor: '#FFF8E1' }]}>
            <Text style={s.insightIcon}>🔄</Text>
            <Text style={s.insightLabel}>覆購商品</Text>
            <Text style={s.insightValue}>10 項</Text>
          </View>
        </View>

        <View style={s.tipCard}>
          <Ionicons name="sparkles" size={18} color={COLORS.primary} />
          <Text style={s.tipText}>
            衛生紙和洗衣精固定在家樂福和好市多買，每月可省約 $680
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.scanButton} activeOpacity={0.85}>
          <Ionicons name="scan-outline" size={20} color={COLORS.white} />
          <Text style={s.scanText}>  掃描發票</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  scroll: { padding: 20, paddingTop: 16 },

  // Hero
  hero: { backgroundColor: COLORS.primary, borderRadius: 24, padding: 24, marginBottom: 16 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  heroAmount: { fontSize: 44, fontWeight: '900', color: '#FFF', marginTop: 4, letterSpacing: -1 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  agentBubble: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  agentEmoji: { fontSize: 28 },
  agentDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#00E676', borderWidth: 2, borderColor: COLORS.primary },
  heroBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 20 },
  heroBarFill: { height: 6, width: '36%', backgroundColor: '#00E676', borderRadius: 3 },
  heroBarLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 },

  // Alert
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', marginRight: 12 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  alertBody: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  alertPrice: { fontSize: 16, fontWeight: '800', color: COLORS.savingsGreen },
  alertOld: { fontSize: 13, color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  alertSave: { fontSize: 12, color: COLORS.savingsGreen, fontWeight: '600', marginTop: 2 },

  // Section
  section: { marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },

  // Analysis Card
  analysisCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  analysisHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  analysisStore: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  analysisDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  analysisBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  analysisBadgeText: { fontSize: 13, fontWeight: '700', color: '#E65100' },
  analysisItems: {},
  analysisRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  analysisRowEmoji: { fontSize: 18, width: 30 },
  analysisRowName: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  analysisRowPrice: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginRight: 8 },
  analysisRowSave: { fontSize: 13, fontWeight: '700', color: '#E65100', width: 40, textAlign: 'right' },
  analysisFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 4 },
  analysisFooterText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  // Insights
  insightRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  insightCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  insightIcon: { fontSize: 28, marginBottom: 8 },
  insightLabel: { fontSize: 12, color: COLORS.textSecondary },
  insightValue: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, marginTop: 4 },

  // Tip
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F0F4FF', borderRadius: 14, padding: 14, gap: 10, marginBottom: 16 },
  tipText: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 20, fontWeight: '500' },

  // Bottom
  bottomBar: { position: 'absolute', bottom: 90, left: 20, right: 20 },
  scanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  scanText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
