import { createContext, ReactNode, useState } from 'react';

type HistoryEntry = {
  id: string;
  fileName: string;
  template: string;
  processedData: string[];
  timestamp: Date;
  fileType: 'txt' | 'pdf';
  pdfHeader?: string;
};

type HistoryContextType = {
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
};

export const HistoryContext = createContext<HistoryContextType | undefined>(
  undefined
);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setHistory((prevHistory) => [newEntry, ...prevHistory]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}; 