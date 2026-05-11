// src/screens/HomeScreen.js
import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Pressable, Dimensions,
} from 'react-native';
import { colors, space, radius } from '../theme';

const { width } = Dimensions.get('window');
const CARD_W = 200;
const CARD_H = 270;

// ─── Mini card for stack ──────────────────────────────────────────────────────
function StackCard({ card, index, total, onPress }) {
  const isTop = index === total - 1;
  const offset = index * 3.5;
  const rotate = (index - Math.floor(total / 2)) * 1.6;

  return (
    <Pressable
      onPress={isTop ? onPress : undefined}
      style={[
        styles.stackCard,
        {
          top: offset,
          left: offset / 2,
          zIndex: index + 1,
          transform: [{ rotate: `${rotate}deg` }],
          borderColor: card.color,
          borderTopWidth: 7,
        },
      ]}
    >
      {/* prompt text */}
      <Text style={styles.stackPrompt} numberOfLines={4}>
        {card.prompt}
      </Text>

      {/* bottom meta */}
      <View style={styles.stackMeta}>
        <Text style={styles.stackDay}>#{card.day}</Text>
        <Text style={styles.stackDays}>
          {card.daysAgo === 0 ? 'today' : `${card.daysAgo}d ago`}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ deck, onDraw, onFlip, onOpenDeck }) {
  const total = deck.length;
  const show  = deck.slice(0, 5);
  const milestoneDots = 10;
  const progress = total % milestoneDots;
  const toNext = milestoneDots - progress;

  return (
    <View style={styles.root}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>tiny{'\n'}thing.</Text>
          <Text style={styles.sub}>a small drawing, every day.</Text>
        </View>
        <TouchableOpacity onPress={onOpenDeck} style={styles.deckBtn}>
          <Text style={styles.deckBtnText}>deck ({total})</Text>
        </TouchableOpacity>
      </View>

      {/* Stack */}
      <View style={styles.stackWrap}>
        <Text style={styles.stackHint}>tap top card to flip a memory</Text>
        <View style={styles.stack}>
          {show.map((card, i) => (
            <StackCard
              key={card.id}
              card={card}
              index={i}
              total={show.length}
              onPress={onFlip}
            />
          ))}
          {total === 0 && (
            <View style={[styles.stackCard, styles.emptyCard]}>
              <Text style={styles.emptyText}>your first card{'\n'}is waiting.</Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: milestoneDots }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i < progress ? colors.ink : colors.inkFaint },
            ]}
          />
        ))}
        <Text style={styles.dotsLabel}>{toNext} to milestone</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.bigBtn} onPress={onDraw} activeOpacity={0.85}>
        <Text style={styles.bigBtnText}>draw something tiny</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: space.lg,
    paddingTop: 60,
    paddingBottom: space.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: space.lg,
  },
  logo: {
    fontFamily: 'serif',
    fontSize: 38,
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 38,
    letterSpacing: -1,
  },
  sub: {
    fontSize: 13,
    color: colors.inkLight,
    marginTop: 6,
  },
  deckBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(26,26,26,0.07)',
    borderRadius: radius.sm,
  },
  deckBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkLight,
  },
  stackWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackHint: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  stack: {
    width: CARD_W,
    height: CARD_H,
    position: 'relative',
  },
  stackCard: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: radius.lg,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: colors.inkFaint,
    borderWidth: 1.5,
    borderTopWidth: 1.5,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.inkLight,
    fontSize: 15,
    fontFamily: 'serif',
    lineHeight: 22,
  },
  stackPrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 20,
    fontFamily: 'serif',
  },
  stackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stackDay: {
    fontSize: 10,
    color: colors.inkFaint,
    fontWeight: '600',
  },
  stackDays: {
    fontSize: 10,
    color: colors.inkFaint,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotsLabel: {
    fontSize: 11,
    color: colors.inkFaint,
    marginLeft: 4,
  },
  bigBtn: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bigBtnText: {
    color: colors.accentFg,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
