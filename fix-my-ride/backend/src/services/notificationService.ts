import { supabase } from '../config/supabase';
import { Notification } from '../types';
import { AppError } from '../middleware/errorHandler';

export class NotificationService {
  static async createNotification(notificationData: {
    user_id: string;
    type: string;
    title: string;
    body: string;
    related_request_id?: string;
    data?: any;
  }): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create notification', 500);
    }

    // In a real implementation, you'd send push notifications here
    // await this.sendPushNotification(notification);

    return notification as Notification;
  }

  static async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: Notification[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new AppError('Failed to fetch notifications', 500);
    }

    return {
      notifications: notifications as Notification[],
      total: count || 0,
    };
  }

  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Failed to mark notification as read', 500);
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new AppError('Failed to mark notifications as read', 500);
    }
  }

  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Failed to delete notification', 500);
    }
  }

  // Notification types and their templates
  static getNotificationTemplate(type: string, data: any = {}) {
    const templates = {
      request_match: {
        title: 'Mechanic Found!',
        body: 'A mechanic has been assigned to your service request.',
      },
      mechanic_accepted: {
        title: 'Request Accepted',
        body: 'Your mechanic is on the way!',
      },
      mechanic_arrived: {
        title: 'Mechanic Arrived',
        body: 'Your mechanic has arrived at the location.',
      },
      service_completed: {
        title: 'Service Completed',
        body: 'Your vehicle service has been completed successfully.',
      },
      payment_received: {
        title: 'Payment Processed',
        body: 'Payment for your service has been received.',
      },
      new_message: {
        title: 'New Message',
        body: 'You have a new message from your mechanic.',
      },
    };

    return templates[type as keyof typeof templates] || {
      title: 'Notification',
      body: 'You have a new notification.',
    };
  }

  // Placeholder for push notification sending
  private static async sendPushNotification(notification: Notification): Promise<void> {
    // Implement Firebase Cloud Messaging or similar service here
    console.log('Sending push notification:', notification);
  }
}