// src/screens/PaywallScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { PurchasesService, PRODUCT_IDS } from '../services/purchases';
import { colors, space, radius } from '../theme';

const FEATURES = [
  { emoji: '📚', text: '150 observation prompts' },
  { emoji: '⏱',  text: 'Timed observe mode — look first, then draw' },
  { emoji: '⚡', text: 'Speed challenge mode' },
  { emoji: '🎴', text: 'Unlimited card deck' },
  { emoji: '✦',  text: 'All future base prompts included' },
];

export default function PaywallScreen({ onClose, onPurchased }) {
  const [loading, setLoading]   = useState(true);
  const [buying, setBuying]     = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [product, setProduct]   = useState(null);
  const [error, setError]       = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    setLoading(true);
    const products = await PurchasesService.getProducts();
    const creator = products.find(p =>
      p.identifier?.includes('creator') || p.product?.title?.includes('創作者')
    );
    setProduct(creator);
    setLoading(false);
  }

  async function handleBuy() {
    if (!product) return;
    setBuying(true);
    setError(null);
    const result = await PurchasesService.purchase(product);
    setBuying(false);
    if (result.success) {
      onPurchased?.();
    } else if (!result.cancelled) {
      setError('Something went wrong. Please try again.');
    }
  }

  async function handleRestore() {
    setRestoring(true);
    const result = await PurchasesService.restore();
    setRestoring(false);
    if (result.success) onPurchased?.();
    else setError('No previous purchases found.');
  }

  const priceString = product?.product?.priceString || 'NT$99';

  return (
    <ScrollView
      style={pw.root}
      contentContainerStyle={pw.content}
      bounces={false}
    >
      {/* Close */}
      <TouchableOpacity onPress={onClose} style={pw.closeBtn}>
        <Text style={pw.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={pw.emoji}>🎴</Text>
      <Text style={pw.title}>unlock tiny thing</Text>
      <Text style={pw.sub}>
        one payment. no subscription.{'\n'}yours forever.
      </Text>

      {/* Features */}
      <View style={pw.features}>
        {FEATURES.map((f, i) => (
          <View key={i} style={pw.featureRow}>
            <Text style={pw.featureEmoji}>{f.emoji}</Text>
            <Text style={pw.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* Separator */}
      <View style={pw.sep} />

      {/* Free vs Paid */}
      <View style={pw.compareRow}>
        <View style={pw.compareCol}>
          <Text style={pw.compareTitle}>free</Text>
          <Text style={pw.compareDetail}>15 prompts</Text>
          <Text style={pw.compareDetail}>basic canvas</Text>
        </View>
        <View style={pw.compareArrow}>
          <Text style={pw.arrow}>→</Text>
        </View>
        <View style={[pw.compareCol, pw.compareColPaid]}>
          <Text style={[pw.compareTitle, { color: colors.ink }]}>creator</Text>
          <Text style={pw.compareDetail}>150 prompts</Text>
          <Text style={pw.compareDetail}>+ timing modes</Text>
        </View>
      </View>

      {/* Error */}
      {error && <Text style={pw.error}>{error}</Text>}

      {/* CTA */}
      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ marginTop: 24 }} />
      ) : (
        <TouchableOpacity
          style={[pw.buyBtn, buying && { opacity: 0.6 }]}
          onPress={handleBuy}
          disabled={buying}
          activeOpacity={0.85}
        >
          {buying ? (
            <ActivityIndicator color={colors.accentFg} />
          ) : (
            <>
              <Text style={pw.buyBtnText}>unlock for {priceString}</Text>
              <Text style={pw.buyBtnSub}>one-time · no subscription</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Restore */}
      <TouchableOpacity onPress={handleRestore} disabled={restoring} style={pw.restoreBtn}>
        <Text style={pw.restoreText}>
          {restoring ? 'restoring...' : 'restore previous purchase'}
        </Text>
      </TouchableOpacity>

      <Text style={pw.legal}>
        Payment processed by Apple. One-time purchase, no recurring charges.
      </Text>
    </ScrollView>
  );
}

const pw = StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors.bg },
  content:       { paddingTop: 60, paddingBottom: 48, paddingHorizontal: space.lg, alignItems: 'center' },
  closeBtn:      { position: 'absolute', top: 20, right: 20, padding: 10 },
  closeText:     { fontSize: 18, color: colors.inkLight },
  emoji:         { fontSize: 52, marginBottom: 16 },
  title:         { fontFamily: 'serif', fontSize: 30, fontWeight: '900', color: colors.ink, marginBottom: 8, textAlign: 'center' },
  sub:           { fontSize: 15, color: colors.inkLight, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  features:      { width: '100%', gap: 14, marginBottom: 28 },
  featureRow:    { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureEmoji:  { fontSize: 22, width: 30 },
  featureText:   { fontSize: 15, color: colors.ink, flex: 1, lineHeight: 20 },
  sep:           { width: '100%', height: 1, backgroundColor: colors.border, marginBottom: 24 },
  compareRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28, width: '100%' },
  compareCol:    { flex: 1, gap: 4, padding: 14, borderRadius: radius.md, backgroundColor: 'rgba(26,26,26,0.04)' },
  compareColPaid:{ backgroundColor: 'rgba(26,26,26,0.08)', borderWidth: 1.5, borderColor: colors.ink },
  compareArrow:  { alignItems: 'center' },
  arrow:         { fontSize: 18, color: colors.inkLight },
  compareTitle:  { fontSize: 14, fontWeight: '800', color: colors.inkLight, marginBottom: 4 },
  compareDetail: { fontSize: 12, color: colors.inkLight, lineHeight: 18 },
  error:         { color: '#c0392b', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  buyBtn:        { width: '100%', backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 18, alignItems: 'center', gap: 3, marginTop: 8 },
  buyBtnText:    { color: colors.accentFg, fontSize: 17, fontWeight: '800' },
  buyBtnSub:     { color: 'rgba(245,240,232,0.6)', fontSize: 12 },
  restoreBtn:    { marginTop: 16, paddingVertical: 8 },
  restoreText:   { color: colors.inkLight, fontSize: 13 },
  legal:         { fontSize: 11, color: 'rgba(26,26,26,0.25)', textAlign: 'center', marginTop: 20, lineHeight: 16 },
});
