import dayjs from 'dayjs';
import NotificationEventEmitter from '../events/NotificationEventEmitter';

export const sendNotification = async (userId?: number) => {
  try {
    const api_url = process.env.EXPO_PUBLIC_API_URL;
    console.log('API URL:', api_url);
    const formattedDate = dayjs().toISOString();

    const response = await fetch(`${api_url}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        notificationDate: formattedDate,
        title: 'Time to save money!',
        text: 'This is your daily remember to add your expenses.',
      }),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      console.error('Error send sotification:', response.status, responseText);
      return;
    }

    NotificationEventEmitter.emit('refreshUnreadCount');
    const data = JSON.parse(responseText);
    console.log('Sent:', data);
  } catch (error) {
    console.error('Error sending:', error);
  }
};
