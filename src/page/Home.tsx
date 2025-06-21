import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Upload, FileText, Download, X } from 'lucide-react';
import useFileUploader from '../hooks/useFileUploader';
import { useFileContext } from '../hooks/useFileContext';
import { useHistory } from '../context/useHistory';
import useFileHandling from '../hooks/useFileHandling';

export default function HomePage() {
  const { headers, file } = useFileContext();
  const { handleFileSelected, processAndDownload } = useFileHandling();
  const {
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    error,
    inputRef,
    dragging,
    handleResetButton,
  } = useFileUploader({
    onFileSelected: (selectedFile) => {
      handleFileSelected(selectedFile);
    },
  });
  const [template, setTemplate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredHeaders, setFilteredHeaders] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addToHistory } = useHistory();

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setTemplate(value);

    const textBeforeCursor = value.slice(0, position);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      const partialHeader = atMatch[1];
      const matchingHeaders = headers.filter((h) =>
        h.toLowerCase().startsWith(partialHeader.toLowerCase()),
      );
      setFilteredHeaders(matchingHeaders);
      setShowSuggestions(matchingHeaders.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertHeader = (header: string) => {
    const value = template;
    const position = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, position);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (!atMatch) return;

    const textToReplace = atMatch[0];
    const startOfReplace = position - textToReplace.length;

    const newTemplate =
      value.slice(0, startOfReplace) +
      `@${header} ` +
      value.slice(position);

    setTemplate(newTemplate);
    setShowSuggestions(false);
    
    // We need to wait for the state to update before focusing
    setTimeout(() => {
        textareaRef.current?.focus();
        const newCursorPosition = startOfReplace + `@${header} `.length;
        textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    processAndDownload(template, format);
    if (file) {
      addToHistory({
        fileName: file.name,
        template: template,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-4xl font-bold text-white">Create Your Template</h1>
        <p className="text-gray-300">
          Upload your spreadsheet and design your personalized template
        </p>
      </div>

      <Card className="bg-black/10 backdrop-blur-2xl border-white/20 animate-slide-up delay-200">
        <CardContent className="p-8">
          {!file ? (
            <div
              className={`text-center space-y-6 ${
                dragging ? 'border-purple-500' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="border-2 border-dashed border-white/30 rounded-lg p-12 hover:border-white/50 transition-colors">
                <Upload className="w-16 h-16 text-white/60 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Upload Your Spreadsheet
                </h3>
                <p className="text-gray-300 mb-4">
                  Drag and drop or click to select Excel or CSV files (max 2MB)
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  onClick={() => inputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer"
                >
                  Choose File
                </Button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">{file.name}</h3>
                    <p className="text-gray-300 text-sm">
                      {headers.length} columns detected
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetButton}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-semibold">
                  Available Headers:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {headers.map((header: string, index: number) => (
                    <div
                      key={header}
                      className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm animate-float"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      @{header}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {file && (
        <Card className="bg-black/20 border-white/20 animate-slide-up delay-300">
          <CardContent className="p-8 space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Design Your Template
            </h3>
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={template}
                onChange={handleTemplateChange}
                placeholder="Start typing your template... Use @ to insert headers from your spreadsheet"
                className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                rows={8}
              />

              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-10">
                  <div className="p-2">
                    <p className="text-gray-300 text-sm mb-2 px-3">
                      Insert header:
                    </p>
                    {filteredHeaders.map((header: string) => (
                      <button
                        key={header}
                        onClick={() => insertHeader(header)}
                        className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
                      >
                        @{header}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => handleDownload('txt')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1"
                disabled={!template.trim()}
              >
                <Download className="w-4 h-4 mr-2" />
                Download as TXT
              </Button>
              <Button
                onClick={() => handleDownload('pdf')}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex-1"
                disabled={!template.trim()}
              >
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
