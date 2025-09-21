
"use client";

import { useState, useCallback, useEffect } from 'react';

export function useWifi() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [disconnectCount, setDisconnectCount] = useState(0);

  useEffect(() => {
    // Set initial state on the client after hydration
    setIsConnected(true);

    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('wifiDisconnectResetDay');
    if (lastReset !== today) {
      setDisconnectCount(0);
      localStorage.setItem('wifiDisconnectResetDay', today);
    }
  }, []);

  const simulateDisconnect = useCallback(() => {
    setIsConnected(false);
    setDisconnectCount(prev => {
        const newCount = prev + 1;
        // Persist to local storage if needed, for now it's session-based
        return newCount;
    });
    setTimeout(() => setIsConnected(true), 2000); // Auto-reconnect after 2s
  }, []);

  return { isConnected, disconnectCount, simulateDisconnect };
}
