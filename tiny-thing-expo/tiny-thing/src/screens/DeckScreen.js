// src/screens/DeckScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, Modal, Dimensions,
} from 'react-native';
import { colors, space, radius } from '../theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - space.lg * 2 - 10) / 2;
const CARD_H = CARD_W * 1.4;

function MiniCard({ card, onPress }) {
  return (
    <TouchableOpacity style={[mc.root, { borderTopColor: card.color, width: CARD_W, height: CARD_H }]} onPress={onPress} activeOpacity={0.85}>
      {card.thumbnail ? (
        <Image source={{ uri: card.thumbnail }} style={mc.thumb} />
      ) : null}
      <Text style={mc.prompt} numberOfLines={card.thumbnail ? 2 : 5}>
        {card.prompt}
      </Text>
      <View style={mc.meta}>
        <Text style={mc.day}>#{card.day}</Text>
        <Text style={mc.type}>{card.drawingType === 'photo' ? '📷' : '✏️'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const mc = StyleSheet.create({
  root:    { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderTopWidth: 7, padding: 12, justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  thumb:   { width: '100%', height: 80, borderRadius: radius.sm, marginBottom: 8, resizeMode: 'cover' },
  prompt:  { fontSize: 12, fontWeight: '600', color: colors.ink, lineHeight: 17, fontFamily: 'serif', flex: 1 },
  meta:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  day:     { fontSize: 10, color: colors.inkFaint },
  type:    { fontSize: 12 },
});

// ─── Card Detail Modal ────────────────────────────────────────────────────────
function CardModal({ card, onClose, onDrawAgain }) {
  return (
    <Modal visible={!!card} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={cm.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={cm.box}>
          <View style={[cm.topBar, { backgroundColor: card?.color }]} />
          {card?.thumbnail && (
            <Image source={{ uri: card.thumbnail }} style={cm.img} />
          )}
          <View style={cm.body}>
            <Text style={cm.day}>card #{card?.day}</Text>
            <Text style={cm.prompt}>{card?.prompt}</Text>
            <Text style={cm.hint}>{card?.hint}</Text>
            {card?.daysAgo > 0 && (
              <Text style={cm.when}>{card.daysAgo} days ago</Text>
            )}
          </View>
          <TouchableOpacity style={cm.againBtn} onPress={onDrawAgain}>
            <Text style={cm.againText}>draw this again →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cm.closeBtn} onPress={onClose}>
            <Text style={cm.closeText}>close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const cm = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: space.lg },
  box:       { width: '100%', backgroundColor: colors.bgCard, borderRadius: radius.xl, overflow: 'hidden' },
  topBar:    { height: 8 },
  img:       { width: '100%', height: 220, resizeMode: 'cover' },
  body:      { padding: space.lg, gap: 6 },
  day:       { fontSize: 11, color: colors.inkFaint, fontWeight: '600' },
  prompt:    { fontSize: 18, fontWeight: '700', color: colors.ink, fontFamily: 'serif', lineHeight: 26 },
  hint:      { fontSize: 13, color: colors.inkLight, fontStyle: 'italic' },
  when:      { fontSize: 12, color: colors.inkFaint, marginTop: 4 },
  againBtn:  { marginHorizontal: space.lg, marginBottom: 10, backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  againText: { color: colors.accentFg, fontSize: 15, fontWeight: '700' },
  closeBtn:  { marginBottom: space.lg, alignItems: 'center', paddingVertical: 8 },
  closeText: { color: colors.inkLight, fontSize: 14 },
});

// ─── Deck Screen ──────────────────────────────────────────────────────────────
export default function DeckScreen({ deck, onBack, onDrawAgain }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={dk.root}>
      <View style={dk.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={dk.back}>← back</Text>
        </TouchableOpacity>
        <Text style={dk.count}>{deck.length} cards</Text>
      </View>
      <Text style={dk.title}>my deck</Text>

      <FlatList
        data={deck}
        keyExtractor={c => String(c.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
        contentContainerStyle={{ paddingBottom: 48 }}
        renderItem={({ item }) => (
          <MiniCard card={item} onPress={() => setSelected(item)} />
        )}
        ListEmptyComponent={
          <Text style={dk.empty}>no cards yet.{'\n'}make your first tiny thing.</Text>
        }
      />

      <CardModal
        card={selected}
        onClose={() => setSelected(null)}
        onDrawAgain={() => { setSelected(null); onDrawAgain(selected); }}
      />
    </View>
  );
}

const dk = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.bg, paddingTop: 60, paddingHorizontal: space.lg },
  header:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  back:  { fontSize: 14, color: colors.inkLight },
  count: { fontSize: 13, color: colors.inkLight, fontWeight: '600' },
  title: { fontFamily: 'serif', fontSize: 28, fontWeight: '900', color: colors.ink, marginBottom: 20 },
  empty: { textAlign: 'center', color: colors.inkLight, fontSize: 15, lineHeight: 24, marginTop: 60 },
});
