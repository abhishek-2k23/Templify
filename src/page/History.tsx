"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Download, FileText, Calendar, Trash2 } from "lucide-react"
import { useHistory } from "../context/useHistory"
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

type HistoryEntry = {
  _id: string;
  user: string;
  url: string;
  templateText: string;
  fileType: 'txt' | 'pdf';
  pdfHeader?: string;
  createdAt: Date;
};

export default function HistoryPage() {
  const { history, deleteHistory, fetchHistory } = useHistory()
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (location.pathname === '/history' && !hasFetched.current) {
      hasFetched.current = true;
      const toastId = toast.loading('Fetching history...');
      fetchHistory?.()
        .then(() => toast.dismiss(toastId))
        .catch(() => {
          toast.dismiss(toastId);
          toast.error('Failed to fetch history');
        });
    }
  }, [location.pathname, fetchHistory]);

  const handleDownload = async (entry?: HistoryEntry) => {
    if (!entry?.url) return;
    try {
      const link = document.createElement('a');
      link.href = entry.url;
      const urlParts = entry.url.split('/');
      const fileName = urlParts[urlParts.length - 1] || `template.${entry.fileType ?? 'pdf'}`;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(entry?.url, '_blank');
    }
  }

  const handleDelete = async (entryId?: string) => {
    if (!entryId) return;
    const toastId = toast.loading('Deleting history...');
    try {
      await deleteHistory?.(entryId);
      toast.dismiss(toastId);
      toast.success('History deleted successfully');
    } catch {
      toast.dismiss(toastId);
      toast.error('Failed to delete history');
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-4xl font-bold text-white">Template History</h1>
        <p className="text-gray-300">View and re-download your previously created templates</p>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history?.map?.((entry, index) => (
          <Card
            key={entry?._id ?? index}
            className="bg-black/10 border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      entry?.fileType === 'pdf'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      Template {index + 1}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{entry?.createdAt?.toLocaleDateString?.()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(entry?._id)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {entry?.templateText}
                </p>
                {entry?.pdfHeader && (
                  <p className="text-gray-400 text-xs mt-2">
                    PDF Header: {entry?.pdfHeader}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDownload(entry)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Re-download
                </Button>
                <div className="bg-white/10 rounded px-3 py-2 text-white text-sm font-medium">
                  {entry?.fileType?.toUpperCase?.()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {history?.length === 0 && (
        <div className="text-center py-16 animate-slide-up">
          <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates yet</h3>
          <p className="text-gray-400 mb-6">Create your first template to see it here</p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={() => navigate('/home')}>
            Create Template
          </Button>
        </div>
      )}
    </div>
  )
}
