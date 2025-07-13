"use client";

import { useEffect } from 'react';
import { initializeCSRF } from '../utils/csrf';

export default function CSRFInitializer() {
  useEffect(() => {
    // CSRFトークンの初期化
    initializeCSRF().catch(error => {
      console.warn('CSRF initialization failed:', error);
    });
  }, []);

  return null;
}