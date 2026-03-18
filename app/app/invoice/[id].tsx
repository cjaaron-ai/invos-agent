import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../data/theme';
import { INVOICES } from '../../data/mock';

export default function InvoiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const invoice = INVOICES.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>找不到發票</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Invoice Header */}
      <View style={styles.invoiceHeader}>
        <Text style={styles.channelName}>{invoice.channel}</Text>
        <Text style={styles.channelFull}>{invoice.channelFull}</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerLabel}>{invoice.date} {invoice.dayOfWeek}</Text>
          <Text style={styles.headerTotal}>${invoice.total.toLocaleString()}</Text>
        </View>
        <View style={styles.carrierRow}>
          <View style={styles.carrierBadge}><Text style={styles.carrierBadgeText}>載具</Text></View>
          <Text style={styles.carrierNumber}>{invoice.carrierNumber}</Text>
        </View>
      </View>

      {/* Savings Summary */}
      {invoice.totalSavings > 0 && (
        <View style={styles.savingsBanner}>
          <Text style={styles.savingsBannerText}>
            💰 這張發票的覆購商品可省 ${invoice.totalSavings}
          </Text>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => router.push(`/report/${invoice.id}`)}
          >
            <Text style={styles.reportBtnText}>查看省錢報告</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Items List */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>商品明細</Text>
        {invoice.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <View style={styles.itemMain}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>×{item.qty}　${item.unitPrice}/{item.qty > 1 ? '件' : '件'}　小計 ${item.subtotal}</Text>
            </View>

            {/* Price comparison status */}
            {item.isRepurchase ? (
              (item.savingsPercent ?? 0) > 0 ? (
                <View style={styles.comparisonWarn}>
                  <Text style={styles.comparisonWarnText}>
                    ⚠️ 其他用戶 ${item.lowestPrice}（{item.lowestChannel}）省{item.savingsPercent}%
                  </Text>
                  <TouchableOpacity style={styles.alertMiniBtn}>
                    <Ionicons name="notifications-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.alertMiniBtnText}> 設定提醒</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.comparisonGood}>
                  <Text style={styles.comparisonGoodText}>✅ 已是最低價！</Text>
                </View>
              )
            ) : (
              <View style={styles.comparisonNone}>
                <Text style={styles.comparisonNoneText}>— 非覆購商品</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  errorText: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: 40 },
  invoiceHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  channelName: { ...FONTS.titleLg, color: COLORS.textPrimary },
  channelFull: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  headerLabel: { ...FONTS.body, color: COLORS.textSecondary },
  headerTotal: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  carrierRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  carrierBadge: { backgroundColor: COLORS.border, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 },
  carrierBadgeText: { ...FONTS.small, color: COLORS.textSecondary },
  carrierNumber: { ...FONTS.small, color: COLORS.textSecondary },
  savingsBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 16, padding: 14, backgroundColor: COLORS.savingsBg, borderRadius: 12 },
  savingsBannerText: { ...FONTS.bodyBold, color: COLORS.savingsGreen, flex: 1 },
  reportBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  reportBtnText: { ...FONTS.small, color: COLORS.white, fontWeight: '600' },
  itemsSection: { padding: 16 },
  sectionTitle: { ...FONTS.titleSm, color: COLORS.textPrimary, marginBottom: 12 },
  itemRow: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemMain: { marginBottom: 8 },
  itemName: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  itemQty: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 },
  comparisonWarn: { backgroundColor: '#FFF3E0', padding: 10, borderRadius: 8 },
  comparisonWarnText: { ...FONTS.small, color: '#E65100' },
  alertMiniBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  alertMiniBtnText: { ...FONTS.small, color: COLORS.primary, fontWeight: '600' },
  comparisonGood: { backgroundColor: COLORS.savingsBg, padding: 10, borderRadius: 8 },
  comparisonGoodText: { ...FONTS.small, color: COLORS.savingsGreen },
  comparisonNone: { padding: 10 },
  comparisonNoneText: { ...FONTS.small, color: COLORS.textSecondary },
});
