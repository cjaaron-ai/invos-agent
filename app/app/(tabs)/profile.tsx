import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../data/theme';

const menuItems = [
  { icon: 'card-outline' as const, label: '載具管理', desc: '已綁定 2 組載具' },
  { icon: 'bar-chart-outline' as const, label: '消費統計', desc: '查看月度消費分析' },
  { icon: 'settings-outline' as const, label: '通知設定', desc: '推播時段與頻率' },
  { icon: 'help-circle-outline' as const, label: '使用說明', desc: '了解 AI 省錢功能' },
  { icon: 'information-circle-outline' as const, label: '關於', desc: 'Invos Agent v1.0.0' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>個人</Text>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color={COLORS.white} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Demo 使用者</Text>
          <Text style={styles.userSub}>已累計省下 $3,280</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>47</Text>
          <Text style={styles.statLabel}>發票數</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>10</Text>
          <Text style={styles.statLabel}>覆購商品</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>低價提醒</Text>
        </View>
      </View>

      {/* Menu */}
      {menuItems.map((item, idx) => (
        <TouchableOpacity key={idx} style={styles.menuRow}>
          <Ionicons name={item.icon} size={22} color={COLORS.primary} />
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuDesc}>{item.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { ...FONTS.titleLg, color: COLORS.textPrimary },
  userCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  userInfo: { marginLeft: 16 },
  userName: { ...FONTS.titleMd, color: COLORS.textPrimary },
  userSub: { ...FONTS.caption, color: COLORS.savingsGreen, marginTop: 4 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, padding: 16, backgroundColor: COLORS.cardGray, borderRadius: 12, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  statLabel: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuText: { flex: 1, marginLeft: 12 },
  menuLabel: { ...FONTS.bodyBold, color: COLORS.textPrimary },
  menuDesc: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
});
