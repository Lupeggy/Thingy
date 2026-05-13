// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { colors, space, radius } from '../theme';

const { width } = Dimensions.get('window');
const CARD_W = 200;
const CARD_H = 270;

function StackCard({ card, isTop, onPress }) {
  return (
    <TouchableOpacity onPress={isTop ? onPress : undefined} activeOpacity={isTop ? 0.85 : 1}
      style={[styles.card, { borderTopColor: card.color, borderTopWidth: 7 }]}>
      {card.thumbnail ? <Image source={{ uri: card.thumbnail }} style={styles.cardThumb}/> : null}
      <Text style={styles.cardPrompt} numberOfLines={4}>{card.prompt}</Text>
      <View style={styles.cardMeta}>
        <Text style={styles.cardDay}>#{card.day}</Text>
        <Text style={styles.cardAgo}>{card.daysAgo === 0 ? 'today' : `${card.daysAgo}d ago`}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Full-screen flip modal
function FlipModal({ card, visible, onClose, onDrawAgain }) {
  if (!card) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={flip.overlay}>
        <View style={flip.box}>
          <View style={[flip.topBar, { backgroundColor: card.color }]}/>
          {card.thumbnail && <Image source={{ uri: card.thumbnail }} style={flip.img}/>}
          <View style={flip.body}>
            <Text style={flip.ago}>{card.daysAgo > 0 ? `${card.daysAgo} days ago` : 'today'} · card #{card.day}</Text>
            <Text style={flip.prompt}>{card.prompt}</Text>
            <Text style={flip.hint}>{card.hint || ''}</Text>
            <Text style={flip.sub}>your hand remembered something.</Text>
          </View>
          <TouchableOpacity style={flip.againBtn} onPress={onDrawAgain}>
            <Text style={flip.againTxt}>draw it again →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={flip.closeBtn} onPress={onClose}>
            <Text style={flip.closeTxt}>close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const flip = StyleSheet.create({
  overlay:  { flex:1, backgroundColor:'rgba(0,0,0,0.65)', alignItems:'center', justifyContent:'center', padding:24 },
  box:      { width:'100%', backgroundColor:'#fdf9f3', borderRadius:24, overflow:'hidden' },
  topBar:   { height:8 },
  img:      { width:'100%', height:200, resizeMode:'cover' },
  body:     { padding:24, gap:8 },
  ago:      { fontSize:11, color:'rgba(26,26,26,0.3)', fontWeight:'600' },
  prompt:   { fontSize:20, fontWeight:'800', color:'#1a1a1a', lineHeight:28 },
  hint:     { fontSize:13, color:'rgba(26,26,26,0.4)', fontStyle:'italic' },
  sub:      { fontSize:13, color:'rgba(26,26,26,0.4)', marginTop:4 },
  againBtn: { marginHorizontal:24, marginBottom:10, backgroundColor:'#1a1a1a', borderRadius:14, paddingVertical:14, alignItems:'center' },
  againTxt: { color:'#f5f0e8', fontSize:15, fontWeight:'700' },
  closeBtn: { marginBottom:24, alignItems:'center', paddingVertical:8 },
  closeTxt: { color:'rgba(26,26,26,0.4)', fontSize:14 },
});

export default function HomeScreen({ deck, onDraw, onOpenDeck, onDrawAgain }) {
  const [flippedCard, setFlippedCard] = useState(null);
  const show = deck.slice(0, 5);
  const total = deck.length;
  const progress = total % 10;

  function handleFlip() {
    const card = deck[Math.floor(Math.random() * deck.length)];
    setFlippedCard(card);
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>tiny{'\n'}thing.</Text>
          <Text style={styles.sub}>a small drawing, every day.</Text>
        </View>
        <TouchableOpacity onPress={onOpenDeck} style={styles.deckBtn}>
          <Text style={styles.deckTxt}>deck ({total})</Text>
        </TouchableOpacity>
      </View>

      {/* Stack */}
      <View style={styles.stackWrap}>
        <Text style={styles.hint}>tap top card to flip a memory</Text>
        <View style={styles.stack}>
          {show.length === 0 ? (
            <View style={[styles.card, styles.emptyCard]}>
              <Text style={styles.emptyTxt}>your first card{'\n'}is waiting.</Text>
            </View>
          ) : (
            show.map((card, i) => {
              const isTop = i === show.length - 1;
              const offset = i * 3.5;
              const rotate = (i - Math.floor(show.length / 2)) * 1.6;
              return (
                <View key={card.id} style={{ position:'absolute', top:offset, left:offset/2, zIndex:i+1, transform:[{rotate:`${rotate}deg`}] }}>
                  <StackCard card={card} isTop={isTop} onPress={handleFlip}/>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({length:10}).map((_,i) => (
          <View key={i} style={[styles.dot, {backgroundColor: i < progress ? '#1a1a1a' : 'rgba(26,26,26,0.12)'}]}/>
        ))}
        <Text style={styles.dotsLabel}>{10 - progress} to milestone</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.bigBtn} onPress={onDraw} activeOpacity={0.85}>
        <Text style={styles.bigBtnTxt}>draw something tiny</Text>
      </TouchableOpacity>

      {/* Flip modal */}
      <FlipModal
        card={flippedCard}
        visible={!!flippedCard}
        onClose={() => setFlippedCard(null)}
        onDrawAgain={() => { setFlippedCard(null); onDrawAgain && onDrawAgain(flippedCard); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:      { flex:1, backgroundColor:'#f5f0e8', paddingHorizontal:24, paddingTop:60, paddingBottom:40 },
  header:    { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  logo:      { fontSize:38, fontWeight:'900', color:'#1a1a1a', lineHeight:38, letterSpacing:-1 },
  sub:       { fontSize:13, color:'rgba(26,26,26,0.38)', marginTop:6 },
  deckBtn:   { paddingHorizontal:14, paddingVertical:8, backgroundColor:'rgba(26,26,26,0.07)', borderRadius:10 },
  deckTxt:   { fontSize:13, fontWeight:'600', color:'rgba(26,26,26,0.5)' },
  stackWrap: { flex:1, alignItems:'center', justifyContent:'center' },
  hint:      { fontSize:11, color:'rgba(26,26,26,0.28)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:14 },
  stack:     { width:CARD_W, height:CARD_H, position:'relative' },
  card:      { position:'absolute', width:CARD_W, height:CARD_H, borderRadius:18, backgroundColor:'#fdf9f3', borderWidth:1, borderColor:'rgba(0,0,0,0.08)', padding:14, justifyContent:'space-between', shadowColor:'#000', shadowOpacity:0.1, shadowRadius:12, shadowOffset:{width:0,height:4}, elevation:4 },
  emptyCard: { alignItems:'center', justifyContent:'center', borderStyle:'dashed', borderColor:'rgba(26,26,26,0.15)', borderWidth:1.5, borderTopWidth:1.5 },
  emptyTxt:  { textAlign:'center', color:'rgba(26,26,26,0.4)', fontSize:15, lineHeight:22 },
  cardThumb: { width:'100%', height:70, borderRadius:8, marginBottom:6, resizeMode:'cover' },
  cardPrompt:{ fontSize:13, fontWeight:'600', color:'#1a1a1a', lineHeight:19, flex:1 },
  cardMeta:  { flexDirection:'row', justifyContent:'space-between' },
  cardDay:   { fontSize:10, color:'rgba(26,26,26,0.25)', fontWeight:'600' },
  cardAgo:   { fontSize:10, color:'rgba(26,26,26,0.25)' },
  dotsRow:   { flexDirection:'row', alignItems:'center', gap:5, marginBottom:16 },
  dot:       { width:6, height:6, borderRadius:3 },
  dotsLabel: { fontSize:11, color:'rgba(26,26,26,0.3)', marginLeft:4 },
  bigBtn:    { backgroundColor:'#1a1a1a', borderRadius:16, paddingVertical:18, alignItems:'center' },
  bigBtnTxt: { color:'#f5f0e8', fontSize:16, fontWeight:'700' },
});
