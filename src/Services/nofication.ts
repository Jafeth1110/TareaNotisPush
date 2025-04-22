import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core'; // 👈 Necesario para detectar la plataforma
import { savePushToken } from '../Services/firebase/notification';

class NotificationService {
  private static instance: NotificationService;
  private listeners: Function[] = [];
  private notifications: any[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Inicializar el servicio de notificaciones
  async initialize(uid: string) {
    await this.initializeNative(uid);
    this.loadSavedNotifications();
  }

  // Inicializar para dispositivos nativos
  // Método que inicializa las notificaciones push en dispositivos nativos
private async initializeNative(uid: string) {
  if (Capacitor.getPlatform() === 'web') {
    console.log('Notificaciones nativas no soportadas en navegador.');
    return;
  }

  try {
    // Solicitar permisos para notificaciones push
    const result = await PushNotifications.requestPermissions();

    if (result.receive === 'granted') {
      // Si los permisos son concedidos, registramos el dispositivo
      await PushNotifications.register();

      // Manejar el evento cuando se recibe un token
      PushNotifications.addListener('registration', (token) => {
        console.log('Token recibido:', token);
        savePushToken(token.value, uid);  // Guardar el token
      });

      // Manejar las notificaciones recibidas
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación recibida:', notification);
        this.addNotification(notification);  // Añadir notificación a la lista
        this.notifyListeners();  // Notificar a los escuchas
      });

      // Manejar las acciones realizadas sobre la notificación
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Acción realizada en notificación:', notification);
        this.addNotification(notification.notification);  // Añadir notificación a la lista
        this.notifyListeners();  // Notificar a los escuchas
      });
    } else {
      // Si el permiso es denegado
      console.warn('Permiso de notificaciones denegado');
    }
  } catch (error) {
    console.error('Error al inicializar notificaciones nativas:', error);
  }
}


  public addNotification(notification: any) {
    const newNotification = {
      id: Date.now().toString(),
      title: notification.title || 'Sin título',
      body: notification.body || '',
      data: notification.data || {},
      read: false,
      date: new Date().toISOString()
    };

    this.notifications = [newNotification, ...this.notifications];
    this.saveNotifications();
  }

  private saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  private loadSavedNotifications() {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        this.notifications = JSON.parse(saved);
      } catch (e) {
        this.notifications = [];
      }
    }
  }

  getNotifications() {
    return [...this.notifications];
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications();
    this.notifyListeners();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications();
    this.notifyListeners();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  addListener(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export default NotificationService;
