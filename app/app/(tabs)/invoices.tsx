import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../data/theme';
import { INVOICES, MARCH_TOTAL, MARCH_SAVINGS } from '../../data/mock';

export default function InvoiceList() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的發票</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={24} color={COLORS.textPrimary} />
        </View>
      </View>

      <View style={styles.periodNav}>
        <TouchableOpacity><Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.periodText}>115年 3-4月</Text>
        <TouchableOpacity><Ionicons name="chevron-forward" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.monthHeader}>
          <View>
            <Text style={styles.monthTitle}>三月</Text>
            <Text style={styles.monthTotal}>${MARCH_TOTAL.toLocaleString()}</Text>
          </View>
          <View style={styles.savingsBadge}>
            <Ionicons name="sparkles" size={14} color={COLORS.savingsGreen} />
            <Text style={styles.savingsText}> AI 分析可省 ${MARCH_SAVINGS.toLocaleString()}</Text>
          </View>
        </View>

        {INVOICES.map((inv) => (
          <TouchableOpacity
            key={inv.id}
            style={styles.invoiceRow}
            onPress={() => router.push(`/invoice/${inv.id}`)}
          >
            <View style={styles.dateCol}>
              <Text style={styles.dateDay}>{parseInt(inv.date.split('-')[2])}</Text>
              <Text style={styles.dateDow}>{inv.dayOfWeek}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.channelName} numberOfLines={1}>{inv.channel}</Text>
              <View style={styles.carrierRow}>
                <View style={styles.carrierBadge}>
                  <Text style={styles.carrierBadgeText}>載具</Text>
                </View>
                <Text style={styles.carrierNumber}>{inv.carrierNumber}</Text>
              </View>
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.amount}>${inv.total.toLocaleString()}</Text>
              {inv.totalSavings > 0 && (
                <Text style={styles.rowSavings}>可省 ${inv.totalSavings}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  headerTitle: { ...FONTS.titleLg, color: COLORS.textPrimary },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  periodNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  periodText: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  scrollView: { flex: 1 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  monthTitle: { ...FONTS.titleMd, color: COLORS.textPrimary },
  monthTotal: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  savingsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.savingsBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  savingsText: { ...FONTS.small, color: COLORS.savingsGreen, fontWeight: '600' },
  invoiceRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dateCol: { width: 44, alignItems: 'center' },
  dateDay: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  dateDow: { ...FONTS.small, color: COLORS.textSecondary },
  detailCol: { flex: 1, marginHorizontal: 12 },
  channelName: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  carrierRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  carrierBadge: { backgroundColor: COLORS.border, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 },
  carrierBadgeText: { ...FONTS.small, color: COLORS.textSecondary },
  carrierNumber: { ...FONTS.small, color: COLORS.textSecondary },
  rightCol: { alignItems: 'flex-end' },
  amount: { ...FONTS.titleSm, color: COLORS.textPrimary },
  rowSavings: { ...FONTS.small, color: COLORS.savingsGreen, fontWeight: '600', marginTop: 2 },
});
