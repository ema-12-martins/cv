import { useEffect } from 'react';
import { sendNotification } from './useNotificationScheduler';

export const usePeriodicNotification = (userId?: number) => {
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      sendNotification(userId);
    }, 60000 * 15); // 1min * 15

    return () => clearInterval(interval);
  }, [userId]);
};
