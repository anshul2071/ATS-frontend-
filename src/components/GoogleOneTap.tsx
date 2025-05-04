import { useEffect } from 'react';

interface Props {
  onSuccess: (res: { credential: string }) => void;
  onError?: (err: any) => void;
}

const GoogleOneTap = ({ onSuccess, onError }: Props) => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              onSuccess(response);
            } else {
              onError?.(new Error('No credential received'));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        window.google.accounts.id.prompt((notification: any) => {
          console.log('[OneTap]', notification.getMomentType());

        });
      }
    };

    return () => {
      window.google?.accounts.id.cancel();
    };
  }, []);

  return null;
};

export default GoogleOneTap;
