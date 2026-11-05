import { Capacitor } from '@capacitor/core';
import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications';
import type { Coordinates, NotificationSettings } from '@/types';
import { calculatePrayerTimes } from '@/lib/utils/prayer';

// Native-only: schedules the Adhan (and optional reminders) as OS notifications,
// so they fire even when the app is closed. Refreshed every time the app opens.

const DAYS_AHEAD = 10;
const ADHAN_CHANNEL = 'adhan-omar-hisham';
const ADHAN_SOUND = 'azan_omar_hisham.mp3'; // android/app/src/main/res/raw
const SMALL_ICON = 'ic_stat_azan';

// id = day * 10 + prayer index (adhan) and + 1000 for reminders
const REMINDER_OFFSET = 1000;

export const isNative = () => Capacitor.isNativePlatform();

let channelReady = false;

async function ensureChannel() {
  if (channelReady || Capacitor.getPlatform() !== 'android') return;
  await LocalNotifications.createChannel({
    id: ADHAN_CHANNEL,
    name: 'Adhan',
    description: 'Plays the Adhan at each prayer time',
    importance: 5,
    visibility: 1,
    sound: ADHAN_SOUND,
    vibration: true,
  });
  channelReady = true;
}

export async function scheduleAdhan(coords: Coordinates, settings: NotificationSettings) {
  if (!isNative()) return;
  await ensureChannel();

  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length) {
    await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
  }
  if (!settings.enabled) return;

  const now = Date.now();
  const notifications: LocalNotificationSchema[] = [];

  for (let day = 0; day < DAYS_AHEAD; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);

    calculatePrayerTimes(coords, date).forEach((prayer, i) => {
      const id = day * 10 + i;

      if (settings.adhan && prayer.timestamp > now) {
        notifications.push({
          id,
          title: `🕌 ${prayer.name}`,
          body: `It's time for ${prayer.name} prayer`,
          schedule: { at: new Date(prayer.timestamp), allowWhileIdle: true },
          channelId: ADHAN_CHANNEL,
          sound: ADHAN_SOUND,
          smallIcon: SMALL_ICON,
          iconColor: '#10b981',
        });
      }

      const remindAt = prayer.timestamp - settings.minutesBefore * 60_000;
      if (settings.reminder && remindAt > now) {
        notifications.push({
          id: REMINDER_OFFSET + id,
          title: `${prayer.name} in ${settings.minutesBefore} minutes`,
          body: `${prayer.name} prayer is at ${prayer.time}`,
          schedule: { at: new Date(remindAt), allowWhileIdle: true },
          smallIcon: SMALL_ICON,
          iconColor: '#10b981',
        });
      }
    });
  }

  if (notifications.length) await LocalNotifications.schedule({ notifications });
}

export async function checkNativePermission(): Promise<NotificationPermission> {
  const { display } = await LocalNotifications.checkPermissions();
  return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'default';
}

export async function requestNativePermission(): Promise<NotificationPermission> {
  const { display } = await LocalNotifications.requestPermissions();
  return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'default';
}

// Android 12+: without exact alarms the Adhan can arrive several minutes late
export async function hasExactAlarms(): Promise<boolean> {
  if (Capacitor.getPlatform() !== 'android') return true;
  const { exact_alarm } = await LocalNotifications.checkExactNotificationSetting();
  return exact_alarm === 'granted';
}

export async function openExactAlarmSettings(): Promise<boolean> {
  const { exact_alarm } = await LocalNotifications.changeExactNotificationSetting();
  return exact_alarm === 'granted';
}
