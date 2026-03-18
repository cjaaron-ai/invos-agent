import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  TextInput, Animated, Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../data/theme';

interface Message {
  id: string;
  type: 'agent' | 'user' | 'analysis' | 'action';
  text: string;
  timestamp: string;
  items?: AnalysisItem[];
  actions?: ActionButton[];
  typing?: boolean;
}

interface AnalysisItem {
  emoji: string;
  name: string;
  qty: number;
  yourPrice: number;
  bestPrice: number;
  bestChannel: string;
  savings: number;
}

interface ActionButton {
  label: string;
  icon: string;
  action: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    type: 'agent',
    text: '👋 嗨！我是你的 AI 省錢助手。我會自動分析你的發票，幫你找到更便宜的購買方案。',
    timestamp: '09:00',
  },
  {
    id: 'm2',
    type: 'agent',
    text: '📥 偵測到你剛存入一張新發票（全聯 3/16），讓我分析一下...',
    timestamp: '14:32',
  },
  {
    id: 'm3',
    type: 'analysis',
    text: '🔍 分析完成！這張發票有 4 個覆購商品，我幫你跟其他 2,847 位用戶的購買記錄比對過了：',
    timestamp: '14:32',
    items: [
      { emoji: '🧻', name: '舒潔衛生紙 100抽', qty: 3, yourPrice: 189, bestPrice: 126, bestChannel: '家樂福', savings: 189 },
      { emoji: '🧴', name: '白蘭洗衣精 2.5kg', qty: 1, yourPrice: 269, bestPrice: 225, bestChannel: '好市多', savings: 44 },
      { emoji: '🥛', name: '林鳳營鮮奶 936ml', qty: 2, yourPrice: 85, bestPrice: 79, bestChannel: '7-11', savings: 12 },
      { emoji: '🥤', name: '可口可樂 330ml', qty: 1, yourPrice: 29, bestPrice: 29, bestChannel: '全聯', savings: 0 },
    ],
    actions: [
      { label: '設定全部低價提醒', icon: 'notifications', action: 'subscribe_all' },
      { label: '查看詳細報告', icon: 'document-text', action: 'view_report' },
    ],
  },
  {
    id: 'm4',
    type: 'agent',
    text: '💡 小建議：舒潔衛生紙你在全聯買 $189/包，但家樂福上週只要 $126/包。下次可以在家樂福買，3包直接省 $189！\n\n要不要我幫你設定提醒？家樂福再出現這個價格時通知你。',
    timestamp: '14:33',
    actions: [
      { label: '好！幫我設定', icon: 'checkmark-circle', action: 'set_alert' },
      { label: '了解更多', icon: 'information-circle', action: 'more_info' },
    ],
  },
  {
    id: 'm5',
    type: 'user',
    text: '好！幫我設定',
    timestamp: '14:35',
  },
  {
    id: 'm6',
    type: 'agent',
    text: '✅ 已設定！我會監控以下通路的價格：\n\n🧻 舒潔衛生紙 — 低於 $160 通知你（比你上次買的便宜 15%）\n\n監控通路：好市多、全聯、7-11、家樂福\n\n放心交給我，有好價格第一時間通知你 🔔',
    timestamp: '14:35',
  },
  {
    id: 'm7',
    type: 'agent',
    text: '🔔 速報！剛剛有用戶在家樂福買到舒潔衛生紙 $126/包，比你的目標價 $160 還低！\n\n按你常買的 3 包計算，可以省 $189 💰\n\n要查看完整比價嗎？',
    timestamp: '18:20',
    actions: [
      { label: '查看比價', icon: 'bar-chart', action: 'view_price' },
      { label: '下次再說', icon: 'time', action: 'dismiss' },
    ],
  },
];

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, easing: Easing.ease, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, easing: Easing.ease, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.agentAvatarSmall}>
        <Text style={{ fontSize: 16 }}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { opacity: dot, transform: [{ scale: Animated.add(0.6, Animated.multiply(dot, 0.4)) }] }]}
          />
        ))}
      </View>
    </View>
  );
}

export default function AgentScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      id: `u${Date.now()}`,
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const agentMsg: Message = {
        id: `a${Date.now()}`,
        type: 'agent',
        text: '我來查看一下... 🔍\n\n根據過去 30 天的數據，你的覆購商品中，白蘭洗衣精的價格波動最大（好市多 $225 vs 全聯 $269），建議優先監控這個品項。\n\n要我幫你設定提醒嗎？',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: '好，幫我設定', icon: 'checkmark-circle', action: 'set_alert' },
          { label: '看其他商品', icon: 'list', action: 'view_all' },
        ],
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 2000);
  };

  const handleAction = (action: string) => {
    if (action === 'view_report') {
      router.push('/report/inv1');
    } else if (action === 'view_price') {
      router.push('/product/p1');
    } else {
      // Simulate tapping an action button
      const userMsg: Message = {
        id: `u${Date.now()}`,
        type: 'user',
        text: action === 'set_alert' ? '好！幫我設定' : action === 'subscribe_all' ? '全部設定提醒' : '了解更多',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const agentMsg: Message = {
          id: `a${Date.now()}`,
          type: 'agent',
          text: '✅ 收到！已經幫你處理好了。有任何問題隨時問我 😊',
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, agentMsg]);
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.agentAvatar}>
            <Text style={{ fontSize: 24 }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Invos AI 助手</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>分析中 · 監控 10 個商品</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Date separator */}
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>今天</Text>
        </View>

        {messages.map(msg => (
          <View key={msg.id}>
            {msg.type === 'user' ? (
              <View style={styles.userRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{msg.text}</Text>
                  <Text style={styles.timestamp}>{msg.timestamp}</Text>
                </View>
              </View>
            ) : msg.type === 'analysis' ? (
              <View style={styles.agentRow}>
                <View style={styles.agentAvatarSmall}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                </View>
                <View style={styles.analysisBubble}>
                  <Text style={styles.agentText}>{msg.text}</Text>

                  {/* Analysis Items */}
                  {msg.items?.map((item, idx) => (
                    <View key={idx} style={[styles.analysisItem, item.savings === 0 && styles.analysisItemGood]}>
                      <Text style={styles.analysisEmoji}>{item.emoji}</Text>
                      <View style={styles.analysisDetail}>
                        <Text style={styles.analysisName}>{item.name} ×{item.qty}</Text>
                        {item.savings > 0 ? (
                          <Text style={styles.analysisPriceBad}>
                            ${item.yourPrice} → ${item.bestPrice}（{item.bestChannel}）
                          </Text>
                        ) : (
                          <Text style={styles.analysisPriceGood}>
                            ${item.yourPrice} ✅ 已是最低價
                          </Text>
                        )}
                      </View>
                      {item.savings > 0 && (
                        <Text style={styles.analysisSavings}>省${item.savings}</Text>
                      )}
                    </View>
                  ))}

                  {/* Total */}
                  <View style={styles.analysisTotalRow}>
                    <Text style={styles.analysisTotal}>
                      💰 這張發票可省 ${msg.items?.reduce((sum, i) => sum + i.savings, 0)}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  {msg.actions && (
                    <View style={styles.actionRow}>
                      {msg.actions.map((act, idx) => (
                        <TouchableOpacity key={idx} style={styles.actionBtn} onPress={() => handleAction(act.action)}>
                          <Ionicons name={act.icon as any} size={16} color={COLORS.primary} />
                          <Text style={styles.actionBtnText}> {act.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <Text style={styles.timestampAgent}>{msg.timestamp}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.agentRow}>
                <View style={styles.agentAvatarSmall}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                </View>
                <View style={styles.agentBubble}>
                  <Text style={styles.agentText}>{msg.text}</Text>
                  {msg.actions && (
                    <View style={styles.actionRow}>
                      {msg.actions.map((act, idx) => (
                        <TouchableOpacity key={idx} style={styles.actionBtn} onPress={() => handleAction(act.action)}>
                          <Ionicons name={act.icon as any} size={16} color={COLORS.primary} />
                          <Text style={styles.actionBtnText}> {act.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <Text style={styles.timestampAgent}>{msg.timestamp}</Text>
                </View>
              </View>
            )}
          </View>
        ))}

        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Quick Actions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
        {['分析最新發票', '本月省錢報告', '哪些東西買貴了？', '推薦設定提醒'].map((q, i) => (
          <TouchableOpacity key={i} style={styles.quickChip} onPress={() => { setInputText(q); }}>
            <Text style={styles.quickChipText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="問我任何關於省錢的問題..."
          placeholderTextColor={COLORS.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  agentAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { ...FONTS.titleSm, color: COLORS.textPrimary },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C853', marginRight: 4 },
  onlineText: { ...FONTS.small, color: COLORS.textSecondary },
  messageList: { flex: 1 },
  messageContent: { padding: 16, paddingBottom: 8 },
  dateSeparator: { alignItems: 'center', marginVertical: 16 },
  dateSeparatorText: { ...FONTS.small, color: COLORS.textSecondary, backgroundColor: '#E8E8E8', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  // User messages
  userRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
  userBubble: { maxWidth: '75%', backgroundColor: COLORS.primary, padding: 12, borderRadius: 16, borderBottomRightRadius: 4 },
  userText: { ...FONTS.body, color: COLORS.white, lineHeight: 22 },
  timestamp: { ...FONTS.small, color: 'rgba(255,255,255,0.6)', marginTop: 4, textAlign: 'right' },
  // Agent messages
  agentRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  agentAvatarSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4 },
  agentBubble: { maxWidth: '78%', backgroundColor: COLORS.white, padding: 12, borderRadius: 16, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  agentText: { ...FONTS.body, color: COLORS.textPrimary, lineHeight: 22 },
  timestampAgent: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 6 },
  // Analysis bubble
  analysisBubble: { maxWidth: '85%', backgroundColor: COLORS.white, padding: 14, borderRadius: 16, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  analysisItem: { flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 8, backgroundColor: '#FFF3E0', borderRadius: 10 },
  analysisItemGood: { backgroundColor: '#E8F5E9' },
  analysisEmoji: { fontSize: 20, marginRight: 8 },
  analysisDetail: { flex: 1 },
  analysisName: { ...FONTS.caption, color: COLORS.textPrimary, fontWeight: '600' },
  analysisPriceBad: { ...FONTS.small, color: '#E65100', marginTop: 2 },
  analysisPriceGood: { ...FONTS.small, color: COLORS.savingsGreen, marginTop: 2 },
  analysisSavings: { ...FONTS.bodyBold, color: '#E65100' },
  analysisTotalRow: { marginTop: 10, padding: 10, backgroundColor: COLORS.savingsBg, borderRadius: 8 },
  analysisTotal: { ...FONTS.bodyBold, color: COLORS.savingsGreen, textAlign: 'center' },
  // Actions
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: '#F0F4FF' },
  actionBtnText: { ...FONTS.small, color: COLORS.primary, fontWeight: '600' },
  // Typing
  typingContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  typingBubble: { flexDirection: 'row', gap: 4, backgroundColor: COLORS.white, padding: 12, paddingHorizontal: 16, borderRadius: 16, borderBottomLeftRadius: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.textSecondary },
  // Quick actions
  quickActions: { maxHeight: 44, paddingHorizontal: 12, backgroundColor: '#F8F9FA' },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  quickChipText: { ...FONTS.small, color: COLORS.primary, fontWeight: '500' },
  // Input
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: 24, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
  input: { flex: 1, height: 42, backgroundColor: '#F0F0F0', borderRadius: 21, paddingHorizontal: 16, ...FONTS.body, color: COLORS.textPrimary },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
