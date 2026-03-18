import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../data/theme';
import { MOCK_ALERTS, MOCK_NOTIFICATIONS } from '../../data/mock';

function modeLabel(mode: string, threshold: number) {
  switch (mode) {
    case 'percentage': return `低於 ${threshold}%`;
    case 'fixed': return `低於 $${threshold}`;
    case 'historical': return '歷史最低價';
    default: return '';
  }
}

export default function AlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>低價提醒</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Active Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的提醒 ({alerts.length})</Text>
          {alerts.map(alert => (
            <TouchableOpacity
              key={alert.id}
              style={[styles.alertCard, !alert.enabled && styles.alertCardDisabled]}
              onPress={() => router.push(`/product/${alert.productId}`)}
            >
              <View style={styles.alertLeft}>
                <Text style={styles.alertEmoji}>{alert.emoji}</Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertName} numberOfLines={1}>{alert.productName}</Text>
                  <Text style={styles.alertMode}>
                    {modeLabel(alert.mode, alert.threshold)} · {alert.channels.join('、')}
                  </Text>
                  <Text style={styles.alertPrice}>
                    我的價格 ${alert.myLastPrice}（{alert.myLastChannel}）
                  </Text>
                </View>
              </View>
              <Switch
                value={alert.enabled}
                onValueChange={() => toggleAlert(alert.id)}
                trackColor={{ true: COLORS.primary, false: COLORS.border }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知紀錄</Text>
          {MOCK_NOTIFICATIONS.map(notif => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifCard, !notif.read && styles.notifUnread]}
              onPress={() => router.push(`/product/${notif.emoji === '🧻' ? 'p1' : notif.emoji === '🧴' ? 'p2' : 'p6'}`)}
            >
              <View style={styles.notifIcon}>
                <Ionicons name="notifications" size={20} color={notif.read ? COLORS.textSecondary : COLORS.accent} />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>
                  {notif.emoji} {notif.productName} 比你便宜 {notif.savingsPercent}%！
                </Text>
                <Text style={styles.notifDetail}>
                  ${notif.yourPrice}→${notif.newPrice}（{notif.channel}）· 常買{notif.qty}件可省${notif.totalSavings}
                </Text>
                <Text style={styles.notifDate}>{notif.date}</Text>
              </View>
              {!notif.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
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
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { ...FONTS.titleSm, color: COLORS.textPrimary, marginBottom: 12 },
  alertCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, marginBottom: 10, backgroundColor: COLORS.cardGray, borderRadius: 12 },
  alertCardDisabled: { opacity: 0.5 },
  alertLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  alertEmoji: { fontSize: 28, marginRight: 12 },
  alertInfo: { flex: 1 },
  alertName: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  alertMode: { ...FONTS.small, color: COLORS.primary, marginTop: 2 },
  alertPrice: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, marginBottom: 8, backgroundColor: COLORS.cardGray, borderRadius: 12 },
  notifUnread: { backgroundColor: '#FFF8E1' },
  notifIcon: { marginRight: 10, marginTop: 2 },
  notifContent: { flex: 1 },
  notifTitle: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  notifDetail: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 4 },
  notifDate: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, marginTop: 6 },
});
