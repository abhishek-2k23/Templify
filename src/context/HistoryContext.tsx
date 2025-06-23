import { createContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

type HistoryEntry = {
  id: string;
  url: string;
  templateText: string;
  fileType: 'txt' | 'pdf';
  pdfHeader?: string;
  timestamp: Date;
};

type HistoryResponse = {
  id: string;
  url: string;
  templateText: string;
  fileType: 'txt' | 'pdf';
  pdfHeader?: string;
  timestamp: string;
};

type HistoryContextType = {
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
};

export const HistoryContext = createContext<HistoryContextType | undefined>(
  undefined
);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { user } = useUser();

  const fetchHistory = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;
      
      console.log('fetchin history, ', email)
      const response = await fetch(`${API_URL}/api/history/${email}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json() as HistoryResponse[];
      setHistory(data.map((entry) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
      console.log('data : ', data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addToHistory = async (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const response = await fetch(`${API_URL}/api/history/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...entry,
          email,
        }),
      });

      if (!response.ok) throw new Error('Failed to save history');
      
      const savedEntry = await response.json() as HistoryResponse;
      setHistory(prev => [{
        ...savedEntry,
        timestamp: new Date(savedEntry.timestamp)
      }, ...prev]);
      
      toast.success('History saved successfully');
    } catch (error) {
      console.error('Error saving history:', error);
      toast.error('Failed to save history');
    }
  };

  const deleteHistory = async (id: string) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const response = await fetch(`${API_URL}/api/history/${id}?email=${email}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete history');
      
      setHistory(prev => prev.filter(entry => entry.id !== id));
      toast.success('History deleted successfully');
    } catch (error) {
      console.error('Error deleting history:', error);
      toast.error('Failed to delete history');
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, deleteHistory, fetchHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}; 