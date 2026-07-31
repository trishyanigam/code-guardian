import { useEffect } from 'react';
import { APP_NAME } from '../utils/constants';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - AI Code Security`;
  }, [title]);
};
