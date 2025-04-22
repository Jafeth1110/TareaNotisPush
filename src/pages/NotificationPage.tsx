import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonToast,
} from '@ionic/react';
import NotificationService from '../Services/nofication';
 // Importamos el servicio

const SendNotification: React.FC = () => {
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Inicializar NotificationService y obtener el token de notificación
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    notificationService.initialize('USER_ID').then(() => {
      // Aquí podrías obtener el token para enviarlo como parte de la notificación
      setToken(notificationService.getNotifications()[0]?.id); // Usar un token de prueba por ahora
    });

    // Limpieza
    return () => {
      // Si es necesario hacer algo en la limpieza
    };
  }, []);

  // Función para enviar la notificación
  const handleSend = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      // Aquí usarías el token y los datos de la notificación
      await notificationService.initialize('USER_ID');
      notificationService.addNotification({
        title,
        body,
        data: {},
      });

      setToastMsg('Notificación enviada correctamente');
    } catch (err) {
      console.error(err);
      setToastMsg('Error al enviar la notificación');
    } finally {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Enviar Notificación</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Token del dispositivo</IonLabel>
          <IonInput value={token} onIonChange={e => setToken(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Título</IonLabel>
          <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Mensaje</IonLabel>
          <IonInput value={body} onIonChange={e => setBody(e.detail.value!)} />
        </IonItem>

        <IonButton expand="full" onClick={handleSend} className="ion-margin-top">
          Enviar Notificación
        </IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default SendNotification;
