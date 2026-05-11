// src/screens/CelebrateScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, space, radius } from '../theme';

const MILESTONES = {
  5:   { emoji: '🌱', message: '5 tiny things.\nyou started something.' },
  10:  { emoji: '🎴', message: '10 cards in your deck.\nkeep going.' },
  25:  { emoji: '✦',  message: '25 tiny things.\nyou are a drawer now.' },
  50:  { emoji: '🌿', message: 'half a hundred.\nsomething has shifted in how you see.' },
  100: { emoji: '🌳', message: '100.\nlegendary observer.' },
};

export default function CelebrateScreen({ count, latestCard, onContinue }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const milestone = MILESTONES[count] || {
    emoji: '✦',
    message: `${count} tiny things.\nyou keep showing up.`,
  };

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={cs.root}>
      <Animated.View style={[cs.content, { opacity, transform: [{ scale }] }]}>
        <Text style={cs.emoji}>{milestone.emoji}</Text>
        <Text style={cs.count}>{count}</Text>
        <Text style={cs.message}>{milestone.message}</Text>

        {latestCard && (
          <View style={[cs.card, { borderTopColor: latestCard.color, borderTopWidth: 7 }]}>
            <Text style={cs.cardPrompt} numberOfLines={3}>{latestCard.prompt}</Text>
          </View>
        )}

        <Text style={cs.sub}>every card is proof{'\n'}you stopped and looked.</Text>
      </Animated.View>

      <TouchableOpacity style={cs.btn} onPress={onContinue} activeOpacity={0.85}>
        <Text style={cs.btnText}>keep going →</Text>
      </TouchableOpacity>
    </View>
  );
}

const cs = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.lg, paddingTop: 80, paddingBottom: space.xl },
  content:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  emoji:      { fontSize: 60 },
  count:      { fontFamily: 'serif', fontSize: 72, fontWeight: '900', color: colors.ink, lineHeight: 72 },
  message:    { fontFamily: 'serif', fontSize: 22, color: colors.ink, textAlign: 'center', lineHeight: 30, fontWeight: '700' },
  card:       { width: '100%', backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  cardPrompt: { fontSize: 14, fontWeight: '600', color: colors.ink, lineHeight: 21, fontFamily: 'serif' },
  sub:        { fontSize: 14, color: colors.inkLight, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
  btn:        { backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 18, alignItems: 'center' },
  btnText:    { color: colors.accentFg, fontSize: 16, fontWeight: '700' },
});
