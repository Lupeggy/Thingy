// src/services/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_MESSAGES = [
  { title: 'tiny thing.', body: 'your drawing is waiting.' },
  { title: 'tiny thing.', body: 'one small observation today?' },
  { title: 'tiny thing.', body: 'something near you wants to be drawn.' },
  { title: 'tiny thing.', body: 'five minutes. that\'s all.' },
  { title: 'tiny thing.', body: 'your deck misses you.' },
  { title: 'tiny thing.', body: 'look at something slowly today.' },
  { title: 'tiny thing.', body: 'a new tiny thing is ready.' },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // quiet, no sound — matches the calm brand
    shouldSetBadge: false,
  }),
});

export const NotificationsService = {
  async requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleDailyReminder(hour = 20, minute = 0) {
    // Cancel existing reminders first
    await this.cancelReminders();

    const granted = await this.requestPermission();
    if (!granted) return false;

    // Pick a random message each scheduling (will rotate each day on reschedule)
    const msg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        sound: false,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return true;
  },

  async cancelReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
