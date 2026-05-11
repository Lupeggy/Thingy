// App.js — see src/ for all screens and services
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Modal } from 'react-native';

import HomeScreen      from './src/screens/HomeScreen';
import DrawScreen      from './src/screens/DrawScreen';
import DeckScreen      from './src/screens/DeckScreen';
import CelebrateScreen from './src/screens/CelebrateScreen';
import PaywallScreen   from './src/screens/PaywallScreen';

import { StorageService }       from './src/services/storage';
import { PurchasesService }     from './src/services/purchases';
import { NotificationsService } from './src/services/notifications';
import { getAvailablePrompts, getRandomPrompt } from './src/data/prompts';
import { colors } from './src/theme';

const SEED_CARDS = [
  { id:1001, day:1, prompt:'Draw the shadow of whatever is closest to you right now.', hint:'look slowly first', color:'#c8dfc8', drawingType:null, thumbnail:null, daysAgo:12 },
  { id:1002, day:2, prompt:'Draw what tired feels like. Any line counts.', hint:'no wrong answer', color:'#f0d4a0', drawingType:null, thumbnail:null, daysAgo:9 },
  { id:1003, day:3, prompt:'Draw the shape of this moment.', hint:"don't think, just draw", color:'#d4c8f0', drawingType:null, thumbnail:null, daysAgo:6 },
  { id:1004, day:4, prompt:'Look at the nearest object. Draw only its outline.', hint:'observe before you draw', color:'#f0c8c8', drawingType:null, thumbnail:null, daysAgo:4 },
  { id:1005, day:5, prompt:'Draw one thing outside your window. Just one.', hint:'really look at it', color:'#c8e4f0', drawingType:null, thumbnail:null, daysAgo:1 },
];

const CARD_COLORS = ['#c8dfc8','#f0d4a0','#d4c8f0','#f0c8c8','#c8e4f0','#f0e4c8','#d4e8d4','#e8d4f0'];
const MILESTONES = new Set([5,10,25,50,100]);

export default function App() {
  const [screen, setScreen]             = useState('home');
  const [deck, setDeck]                 = useState([]);
  const [settings, setSettings]         = useState({});
  const [entitlements, setEntitlements] = useState({ paid:false });
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [celebrateCount, setCelebrateCount] = useState(null);
  const [latestCard, setLatestCard]     = useState(null);
  const [showPaywall, setShowPaywall]   = useState(false);
  const [ready, setReady]               = useState(false);

  useEffect(() => {
    (async () => {
      await PurchasesService.configure();
      const [savedDeck, savedSettings, savedEnt] = await Promise.all([
        StorageService.loadDeck(),
        StorageService.loadSettings(),
        PurchasesService.getEntitlements(),
      ]);
      setDeck(savedDeck.length > 0 ? savedDeck : SEED_CARDS);
      setSettings(savedSettings);
      setEntitlements(savedEnt);
      setReady(true);
    })();
  }, []);

  function handleDraw(overridePrompt) {
    if (overridePrompt) { setCurrentPrompt(overridePrompt); setScreen('draw'); return; }
    const pool = getAvailablePrompts(entitlements);
    const recentIds = settings.recentPromptIds || [];
    const prompt = getRandomPrompt(pool, recentIds);
    if ((prompt.tier === 'paid' || prompt.tier?.startsWith('pack_')) && !entitlements.paid) {
      setShowPaywall(true); return;
    }
    setCurrentPrompt(prompt);
    setScreen('draw');
  }

  async function handleDrawComplete({ drawingType, uri }) {
    const color = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
    let thumbnailPath = null;
    if (uri) {
      try { thumbnailPath = await StorageService.saveThumbnail(Date.now(), uri); } catch {}
    }
    const card = { id:Date.now(), day:deck.length+1, prompt:currentPrompt.text, hint:currentPrompt.hint, color, drawingType:drawingType||null, thumbnail:thumbnailPath, daysAgo:0 };
    const next = [card, ...deck];
    setDeck(next); setLatestCard(card);
    await StorageService.addCard(card);
    if (currentPrompt.id) await StorageService.addRecentPromptId(currentPrompt.id);
    if (next.length === 2 && !settings.notificationsEnabled) {
      const ok = await NotificationsService.requestPermission();
      if (ok) { await NotificationsService.scheduleDailyReminder(20,0); const s={...settings,notificationsEnabled:true}; setSettings(s); await StorageService.saveSettings(s); }
    }
    if (MILESTONES.has(next.length)) { setCelebrateCount(next.length); setScreen('celebrate'); }
    else setScreen('home');
  }

  async function handlePurchased() {
    setShowPaywall(false);
    const ent = await PurchasesService.getEntitlements();
    setEntitlements(ent);
  }

  if (!ready) return <View style={{ flex:1, backgroundColor:colors.bg }} />;

  return (
    <View style={{ flex:1, backgroundColor:colors.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      {screen==='home' && <HomeScreen deck={deck} onDraw={()=>handleDraw()} onFlip={()=>{}} onOpenDeck={()=>setScreen('deck')} />}
      {screen==='draw' && currentPrompt && <DrawScreen prompt={currentPrompt} onComplete={handleDrawComplete} onBack={()=>setScreen('home')} />}
      {screen==='deck' && <DeckScreen deck={deck} onBack={()=>setScreen('home')} onDrawAgain={c=>handleDraw({id:'replay',tier:'free',timing:null,text:c.prompt,hint:c.hint||''})} />}
      {screen==='celebrate' && <CelebrateScreen count={celebrateCount} latestCard={latestCard} onContinue={()=>setScreen('home')} />}
      <Modal visible={showPaywall} animationType="slide" presentationStyle="pageSheet" onRequestClose={()=>setShowPaywall(false)}>
        <PaywallScreen onClose={()=>setShowPaywall(false)} onPurchased={handlePurchased} />
      </Modal>
    </View>
  );
}
