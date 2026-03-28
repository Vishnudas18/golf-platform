import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#13131A',
          color: '#F0F0F5',
          border: '1px solid #1E1E2E',
          borderRadius: '12px',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: '#00E5A0',
            secondary: '#13131A',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF4D6D',
            secondary: '#13131A',
          },
        },
      }}
    />
  );
};

export default Toast;
