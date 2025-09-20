"use client";

import { useState, useCallback } from 'react';

export function useWifi() {
  const [isConnected, setIsConnected] = useState(true);
  const [disconnectCount, setDisconnectCount] = useState(0);

  const simulateDisconnect = useCallback(() => {
    setIsConnected(false);
    setDisconnectCount(prev => prev + 1);
    setTimeout(() => setIsConnected(true), 2000); // Auto-reconnect after 2s
  }, []);

  return { isConnected, disconnectCount, simulateDisconnect };
}
