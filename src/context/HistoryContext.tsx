import { createContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

type HistoryEntry = {
  _id: string;
  user: string;
  url: string;
  templateText: string;
  fileType: 'txt' | 'pdf';
  pdfHeader?: string;
  createdAt: Date;
};

type HistoryResponse = {
  _id: string;
  user: string;
  url: string;
  templateText: string;
  fileType: 'txt' | 'pdf';
  pdfHeader?: string;
  createdAt: string;
};

type HistoryContextType = {
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, '_id' | 'user' | 'createdAt'>) => Promise<void>;
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
      
      console.log('fetching history, ', email)
      const response = await fetch(`${API_URL}/api/history/${email}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      const histories = data.histories || data; // Handle both array and {histories: []} format
      setHistory(histories.map((entry: HistoryResponse) => ({
        ...entry,
        createdAt: new Date(entry.createdAt)
      })));
      console.log('data : ', histories);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addToHistory = async (entry: Omit<HistoryEntry, '_id' | 'user' | 'createdAt'>) => {
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
      console.log(savedEntry);
      setHistory(prev => [{
        ...savedEntry,
        createdAt: new Date(savedEntry.createdAt)
      }, ...prev]);
      
      toast.success('History saved successfully');
    } catch (error) {
      console.error('Error saving history:', error);
      toast.error('Failed to save history');
    }
  };

  const deleteHistory = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete history');
      
      setHistory(prev => prev.filter(entry => entry._id !== id));
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