// src/services/purchases.js
// ─────────────────────────────────────────────────────────────────────────────
// RevenueCat handles all IAP complexity:
//   - StoreKit 2 on iOS
//   - Purchase validation
//   - Restore purchases
//   - Entitlements (what user has bought)
//
// Products to create in App Store Connect:
//   com.tinything.app.creator     → $99 TWD  one-time (Non-Consumable)
//   com.tinything.app.pack_city   → $49 TWD  one-time (Non-Consumable)
//   com.tinything.app.pack_body   → $49 TWD  one-time (Non-Consumable)
//   com.tinything.app.pack_memory → $49 TWD  one-time (Non-Consumable)
// ─────────────────────────────────────────────────────────────────────────────

import { Platform } from 'react-native';

// Replace with your RevenueCat API keys from dashboard.revenuecat.com
const RC_API_KEY_IOS     = 'appl_YOUR_REVENUECAT_IOS_KEY';
const RC_API_KEY_ANDROID = 'goog_YOUR_REVENUECAT_ANDROID_KEY';

export const PRODUCT_IDS = {
  CREATOR:      'com.tinything.app.creator',      // unlocks 150 paid prompts + timing
  PACK_CITY:    'com.tinything.app.pack_city',
  PACK_BODY:    'com.tinything.app.pack_body',
  PACK_MEMORY:  'com.tinything.app.pack_memory',
};

export const ENTITLEMENT_IDS = {
  PAID:       'paid_prompts',
  PACK_CITY:  'pack_city',
  PACK_BODY:  'pack_body',
  PACK_MEMORY:'pack_memory',
};

// ─── Mock for development (no native module needed in Expo Go) ────────────────
// When you do a real EAS build, swap this for the real Purchases SDK
let _mockEntitlements = {
  paid: false,
  pack_city: false,
  pack_body: false,
  pack_memory: false,
};

export const PurchasesService = {
  // Call once on app start
  async configure() {
    try {
      const Purchases = require('react-native-purchases').default;
      const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
      await Purchases.configure({ apiKey });
      console.log('[IAP] RevenueCat configured');
    } catch (e) {
      console.log('[IAP] Running in mock mode (Expo Go)', e.message);
    }
  },

  // Get current entitlements
  async getEntitlements() {
    try {
      const Purchases = require('react-native-purchases').default;
      const info = await Purchases.getCustomerInfo();
      return {
        paid:        !!info.entitlements.active[ENTITLEMENT_IDS.PAID],
        pack_city:   !!info.entitlements.active[ENTITLEMENT_IDS.PACK_CITY],
        pack_body:   !!info.entitlements.active[ENTITLEMENT_IDS.PACK_BODY],
        pack_memory: !!info.entitlements.active[ENTITLEMENT_IDS.PACK_MEMORY],
      };
    } catch (e) {
      return { ..._mockEntitlements };
    }
  },

  // Fetch available products from App Store
  async getProducts() {
    try {
      const Purchases = require('react-native-purchases').default;
      const offerings = await Purchases.getOfferings();
      return offerings.current?.availablePackages || [];
    } catch (e) {
      // Mock products for development
      return [
        { identifier: PRODUCT_IDS.CREATOR,   product: { priceString: 'NT$99',  title: '創作者版', description: '150條觀察練習 + 計時功能' }},
        { identifier: PRODUCT_IDS.PACK_CITY,  product: { priceString: 'NT$49',  title: '城市觀察', description: '30條城市主題練習' }},
        { identifier: PRODUCT_IDS.PACK_BODY,  product: { priceString: 'NT$49',  title: '身體感知', description: '30條身體感官練習' }},
        { identifier: PRODUCT_IDS.PACK_MEMORY,product: { priceString: 'NT$49',  title: '記憶素描', description: '30條記憶主題練習' }},
      ];
    }
  },

  // Purchase a product
  async purchase(packageToBuy) {
    try {
      const Purchases = require('react-native-purchases').default;
      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      return { success: true, customerInfo };
    } catch (e) {
      if (e.userCancelled) return { success: false, cancelled: true };
      // Dev mock — simulate successful purchase
      if (packageToBuy.identifier?.includes('creator')) _mockEntitlements.paid = true;
      if (packageToBuy.identifier?.includes('city'))    _mockEntitlements.pack_city = true;
      if (packageToBuy.identifier?.includes('body'))    _mockEntitlements.pack_body = true;
      if (packageToBuy.identifier?.includes('memory'))  _mockEntitlements.pack_memory = true;
      return { success: true, mock: true };
    }
  },

  // Restore purchases (required by App Store guidelines)
  async restore() {
    try {
      const Purchases = require('react-native-purchases').default;
      const info = await Purchases.restorePurchases();
      return { success: true, customerInfo: info };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // DEV ONLY: unlock everything for testing
  devUnlockAll() {
    _mockEntitlements = { paid: true, pack_city: true, pack_body: true, pack_memory: true };
  },
};
