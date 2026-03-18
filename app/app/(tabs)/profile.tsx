import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../data/theme';
import { SUBSCRIPTIONS, MONTHLY_SUB_TOTAL } from '../../data/subscriptions';
import { MOCK_ALERTS } from '../../data/mock';

export default function ProfileScreen() {
  const activeSubs = SUBSCRIPTIONS.filter(s => s.status !== 'cancel');
  const activeAlerts = MOCK_ALERTS.filter(a => a.enabled);

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>個人</Text>

        {/* User */}
        <View style={s.userCard}>
          <View style={s.avatar}>
            <Ionicons name="person" size={28} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName}>Demo 使用者</Text>
            <Text style={s.userSub}>已累計省下 $3,280</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNum}>47</Text>
            <Text style={s.statLabel}>發票</Text>
          </View>
          <View style={s.statDiv} />
          <View style={s.statItem}>
            <Text style={s.statNum}>10</Text>
            <Text style={s.statLabel}>覆購商品</Text>
          </View>
          <View style={s.statDiv} />
          <View style={s.statItem}>
            <Text style={s.statNum}>{activeSubs.length}</Text>
            <Text style={s.statLabel}>訂閱中</Text>
          </View>
        </View>

        {/* Subscriptions Summary */}
        <Text style={s.sectionTitle}>🔄 訂閱服務</Text>
        <View style={s.subSummary}>
          <Text style={s.subTotal}>${MONTHLY_SUB_TOTAL.toLocaleString()}/月</Text>
          <Text style={s.subCount}>{activeSubs.length} 個進行中</Text>
        </View>
        {activeSubs.slice(0, 4).map(sub => (
          <View key={sub.id} style={s.subRow}>
            <Text style={s.subIcon}>{sub.icon}</Text>
            <Text style={s.subName}>{sub.name}</Text>
            <Text style={s.subPrice}>${sub.monthlyAmount}/月</Text>
          </View>
        ))}
        {activeSubs.length > 4 && (
          <TouchableOpacity style={s.moreBtn}>
            <Text style={s.moreBtnText}>查看全部 {activeSubs.length} 個訂閱 →</Text>
          </TouchableOpacity>
        )}

        {/* Alerts Summary */}
        <Text style={s.sectionTitle}>🔔 低價提醒</Text>
        {activeAlerts.map(alert => (
          <View key={alert.id} style={s.alertRow}>
            <Text style={s.alertEmoji}>{alert.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.alertName}>{alert.productName}</Text>
              <Text style={s.alertMeta}>
                {alert.mode === 'percentage' ? `低於 ${alert.threshold}%` :
                 alert.mode === 'fixed' ? `低於 $${alert.threshold}` : '歷史最低價'}
              </Text>
            </View>
            <View style={s.alertActive}><Text style={s.alertActiveText}>監控中</Text></View>
          </View>
        ))}

        {/* Settings */}
        <Text style={s.sectionTitle}>⚙️ 設定</Text>
        {[
          { icon: 'card-outline' as const, label: '載具管理' },
          { icon: 'time-outline' as const, label: '通知時段' },
          { icon: 'help-circle-outline' as const, label: '使用說明' },
          { icon: 'information-circle-outline' as const, label: '關於' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={s.menuRow}>
            <Ionicons name={item.icon} size={20} color={COLORS.primary} />
            <Text style={s.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },

  userCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  userName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  userSub: { fontSize: 13, color: COLORS.savingsGreen, marginTop: 2, fontWeight: '600' },

  statsRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 11, color: '#999', marginTop: 4 },
  statDiv: { width: 1, backgroundColor: '#F0F0F0' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 10, marginTop: 8 },

  subSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  subTotal: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  subCount: { fontSize: 12, color: '#999' },
  subRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 6 },
  subIcon: { fontSize: 20, marginRight: 10 },
  subName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  subPrice: { fontSize: 13, color: '#999', fontWeight: '600' },
  moreBtn: { alignItems: 'center', paddingVertical: 10 },
  moreBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  alertRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 6 },
  alertEmoji: { fontSize: 20, marginRight: 10 },
  alertName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  alertMeta: { fontSize: 11, color: '#999', marginTop: 2 },
  alertActive: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  alertActiveText: { fontSize: 10, fontWeight: '700', color: COLORS.savingsGreen },

  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 6, gap: 10 },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
});
