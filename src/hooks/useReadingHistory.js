import { useState, useCallback } from "react";

const STORAGE_KEY = "5s_reading_history";
const MAX_ITEMS = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore storage errors
  }
}

export function useReadingHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addToHistory = useCallback((postId) => {
    setHistory((prev) => {
      // If postId is already the most recent entry, do nothing
      if (prev[0] === postId) return prev;

      // Remove existing occurrence (if any), then prepend
      const filtered = prev.filter((id) => id !== postId);
      const updated = [postId, ...filtered].slice(0, MAX_ITEMS);

      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
