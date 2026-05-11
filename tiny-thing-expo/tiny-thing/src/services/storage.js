// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const DECK_KEY      = '@tinything/deck_v1';
const SETTINGS_KEY  = '@tinything/settings_v1';
const THUMBNAIL_DIR = `${FileSystem.documentDirectory}thumbnails/`;

export const StorageService = {
  // ── Deck ──────────────────────────────────────────────────────────────────
  async loadDeck() {
    try {
      const raw = await AsyncStorage.getItem(DECK_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveDeck(deck) {
    try {
      // Don't store thumbnail base64 in AsyncStorage — store file paths only
      await AsyncStorage.setItem(DECK_KEY, JSON.stringify(deck));
    } catch (e) {
      console.error('[Storage] saveDeck failed', e);
    }
  },

  async addCard(card) {
    const deck = await this.loadDeck();
    const next = [card, ...deck];
    await this.saveDeck(next);
    return next;
  },

  // ── Thumbnails ────────────────────────────────────────────────────────────
  async ensureThumbnailDir() {
    const info = await FileSystem.getInfoAsync(THUMBNAIL_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(THUMBNAIL_DIR, { intermediates: true });
    }
  },

  // Save base64 or uri to a permanent local file, returns local file URI
  async saveThumbnail(cardId, source) {
    await this.ensureThumbnailDir();
    const dest = `${THUMBNAIL_DIR}${cardId}.jpg`;
    if (source.startsWith('data:')) {
      // base64 from canvas
      const base64 = source.split(',')[1];
      await FileSystem.writeAsStringAsync(dest, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } else {
      // file URI from image picker
      await FileSystem.copyAsync({ from: source, to: dest });
    }
    return dest;
  },

  async deleteThumbnail(cardId) {
    try {
      const path = `${THUMBNAIL_DIR}${cardId}.jpg`;
      await FileSystem.deleteAsync(path, { idempotent: true });
    } catch {}
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  async loadSettings() {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {
        notificationsEnabled: false,
        reminderHour: 20,
        reminderMinute: 0,
        recentPromptIds: [],
        onboardingDone: false,
      };
    } catch {
      return {};
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  },

  async addRecentPromptId(id) {
    const s = await this.loadSettings();
    const ids = [id, ...(s.recentPromptIds || [])].slice(0, 10);
    await this.saveSettings({ ...s, recentPromptIds: ids });
  },
};
