import toast from 'react-hot-toast';

export const useToast = () => {
  const success = (message) => toast.success(message, {
    style: {
      background: '#13131A',
      color: '#00E5A0',
      border: '1px solid #1E1E2E',
    },
  });

  const error = (message) => toast.error(message, {
    style: {
      background: '#13131A',
      color: '#FF4D6D',
      border: '1px solid #1E1E2E',
    },
  });

  const info = (message) => toast(message, {
    style: {
      background: '#13131A',
      color: '#F0F0F5',
      border: '1px solid #1E1E2E',
    },
  });

  return { success, error, info };
};
