import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../data/theme';
import { INVOICES, CHANNELS } from '../../data/mock';

export default function SavingsReport() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = INVOICES.find(inv => inv.id === id);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [alertMode, setAlertMode] = useState<'percentage' | 'fixed' | 'historical'>('percentage');
  const [threshold, setThreshold] = useState('15');
  const [selectedChannels, setSelectedChannels] = useState<Record<string, boolean>>(
    Object.fromEntries(CHANNELS.map(c => [c, true]))
  );

  if (!invoice) {
    return <View style={styles.container}><Text>找不到發票</Text></View>;
  }

  const repurchaseItems = invoice.items.filter(i => i.isRepurchase);

  const openAlert = (productName: string) => {
    setSelectedProduct(productName);
    setShowAlertModal(true);
  };

  const toggleChannel = (ch: string) => {
    setSelectedChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Report Header */}
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>📋 發票分析</Text>
          <Text style={styles.reportSub}>{invoice.channel}　{invoice.date}</Text>
        </View>

        {/* Items */}
        {repurchaseItems.map((item, idx) => {
          const savings = (item.unitPrice - (item.lowestPrice ?? item.unitPrice)) * item.qty;
          const isLowest = (item.savingsPercent ?? 0) === 0;

          return (
            <View key={idx} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>×{item.qty}</Text>
                </View>
                {isLowest ? (
                  <Text style={styles.lowestBadge}>✅ 最低價</Text>
                ) : (
                  <View style={styles.itemRight}>
                    <Text style={styles.priceCompare}>
                      ${item.unitPrice}→<Text style={styles.lowPrice}>${item.lowestPrice}</Text>
                    </Text>
                    <Text style={styles.itemSource}>（{item.lowestChannel} {item.lowestDate}）</Text>
                  </View>
                )}
              </View>
              {!isLowest && (
                <View style={styles.itemFooter}>
                  <Text style={styles.savingsAmount}>省 ${savings}</Text>
                  <TouchableOpacity
                    style={styles.alertBtn}
                    onPress={() => openAlert(item.name)}
                  >
                    <Ionicons name="notifications-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.alertBtnText}> 設定提醒</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Non-repurchase items */}
        {invoice.items.filter(i => !i.isRepurchase).map((item, idx) => (
          <View key={`nr-${idx}`} style={[styles.itemCard, styles.itemCardGray]}>
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={[styles.itemName, { color: COLORS.textSecondary }]}>{item.name}</Text>
                <Text style={styles.itemQty}>×{item.qty}</Text>
              </View>
              <Text style={styles.nonRepurchase}>— 非覆購商品</Text>
            </View>
          </View>
        ))}

        {/* Total Savings */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>💰 本張發票覆購商品可省</Text>
          <Text style={styles.totalAmount}>${invoice.totalSavings}</Text>
        </View>

        {/* Subscribe All Button */}
        <TouchableOpacity style={styles.subscribeAllBtn} onPress={() => setShowAlertModal(true)}>
          <Ionicons name="notifications" size={18} color={COLORS.white} />
          <Text style={styles.subscribeAllText}>  全部設定低價提醒</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Alert Setup Modal (Bottom Sheet style) */}
      <Modal visible={showAlertModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>🔔 設定低價提醒</Text>
            {selectedProduct ? (
              <Text style={styles.modalSub}>{selectedProduct}</Text>
            ) : (
              <Text style={styles.modalSub}>全部覆購商品</Text>
            )}

            {/* Threshold Mode */}
            <Text style={styles.modalLabel}>提醒方式</Text>
            <TouchableOpacity style={styles.radioRow} onPress={() => setAlertMode('percentage')}>
              <Ionicons name={alertMode === 'percentage' ? 'radio-button-on' : 'radio-button-off'} size={20} color={COLORS.primary} />
              <Text style={styles.radioText}>  比我買的便宜</Text>
              {alertMode === 'percentage' && (
                <TextInput
                  style={styles.thresholdInput}
                  value={threshold}
                  onChangeText={setThreshold}
                  keyboardType="numeric"
                />
              )}
              {alertMode === 'percentage' && <Text style={styles.radioText}>%</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioRow} onPress={() => setAlertMode('fixed')}>
              <Ionicons name={alertMode === 'fixed' ? 'radio-button-on' : 'radio-button-off'} size={20} color={COLORS.primary} />
              <Text style={styles.radioText}>  低於固定價格 $</Text>
              {alertMode === 'fixed' && (
                <TextInput style={styles.thresholdInput} placeholder="金額" keyboardType="numeric" />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioRow} onPress={() => setAlertMode('historical')}>
              <Ionicons name={alertMode === 'historical' ? 'radio-button-on' : 'radio-button-off'} size={20} color={COLORS.primary} />
              <Text style={styles.radioText}>  出現歷史最低價時</Text>
            </TouchableOpacity>

            {/* Channel Selection */}
            <Text style={[styles.modalLabel, { marginTop: 16 }]}>監控通路</Text>
            <View style={styles.channelRow}>
              {CHANNELS.map(ch => (
                <TouchableOpacity key={ch} style={styles.channelChip} onPress={() => toggleChannel(ch)}>
                  <Ionicons
                    name={selectedChannels[ch] ? 'checkbox' : 'square-outline'}
                    size={18}
                    color={selectedChannels[ch] ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text style={styles.channelChipText}> {ch}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={() => setShowAlertModal(false)}>
              <Text style={styles.submitBtnText}>確認訂閱</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAlertModal(false)}>
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  reportHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  reportTitle: { ...FONTS.titleMd, color: COLORS.textPrimary },
  reportSub: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 },
  itemCard: { marginHorizontal: 16, marginTop: 12, padding: 14, backgroundColor: COLORS.cardGray, borderRadius: 12 },
  itemCardGray: { opacity: 0.6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemLeft: { flex: 1 },
  itemName: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  itemQty: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  itemRight: { alignItems: 'flex-end' },
  priceCompare: { ...FONTS.body, color: COLORS.textPrimary },
  lowPrice: { color: COLORS.savingsGreen, fontWeight: '700' },
  itemSource: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  lowestBadge: { ...FONTS.bodyBold, color: COLORS.savingsGreen },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  savingsAmount: { ...FONTS.bodyBold, color: COLORS.danger },
  alertBtn: { flexDirection: 'row', alignItems: 'center' },
  alertBtnText: { ...FONTS.small, color: COLORS.primary, fontWeight: '600' },
  nonRepurchase: { ...FONTS.caption, color: COLORS.textSecondary },
  totalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16, padding: 20, backgroundColor: COLORS.savingsBg, borderRadius: 12 },
  totalLabel: { ...FONTS.bodyBold, color: COLORS.savingsGreen },
  totalAmount: { fontSize: 28, fontWeight: '800', color: COLORS.savingsGreen },
  subscribeAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, padding: 16, backgroundColor: COLORS.primary, borderRadius: 12 },
  subscribeAllText: { ...FONTS.bodyBold, color: COLORS.white },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { ...FONTS.titleMd, color: COLORS.textPrimary },
  modalSub: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },
  modalLabel: { ...FONTS.bodyBold, color: COLORS.textPrimary, marginBottom: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  radioText: { ...FONTS.body, color: COLORS.textPrimary },
  thresholdInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, width: 60, marginLeft: 8, textAlign: 'center', ...FONTS.body },
  channelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  channelChip: { flexDirection: 'row', alignItems: 'center' },
  channelChipText: { ...FONTS.body, color: COLORS.textPrimary },
  submitBtn: { marginTop: 24, padding: 16, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { ...FONTS.bodyBold, color: COLORS.white },
  cancelBtn: { marginTop: 10, padding: 12, alignItems: 'center' },
  cancelBtnText: { ...FONTS.body, color: COLORS.textSecondary },
});
