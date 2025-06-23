import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Upload, FileText, Download, X, Sparkles } from 'lucide-react';
import useFileUploader from '../hooks/useFileUploader';
import { useFileContext } from '../hooks/useFileContext';
import { useHistory } from '../context/useHistory';
import useFileHandling from '../hooks/useFileHandling';
import React from 'react';
import { generateTemplate } from '../lib/gemini';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { headers, file, processedData } = useFileContext();
  const { handleFileSelected, processAndDownload } = useFileHandling();
  const {
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    inputRef,
    dragging,
    handleResetButton,
  } = useFileUploader({
    onFileSelected: (selectedFile) => {
      handleFileSelected(selectedFile);
    },
  });
  const [template, setTemplate] = useState('');
  const [pdfHeader, setPdfHeader] = useState('');
  const [templateType, setTemplateType] = useState('Invitation');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredHeaders, setFilteredHeaders] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addToHistory } = useHistory();
  const [isGenerating, setIsGenerating] = useState(false);
  const generationController = useRef<AbortController | null>(null);

  // Set default PDF header when file is uploaded
  React.useEffect(() => {
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setPdfHeader(`${fileName} data`);
    }
  }, [file]);

  const handleGenerateTemplate = async () => {
    if (!template.trim()) {
      toast.error("Please enter some content in the textarea before generating.");
      return;
    }

    const controller = new AbortController();
    generationController.current = controller;
    setIsGenerating(true);
    const toastId = toast.loading("Generating template...");

    try {
      const generated = await generateTemplate(template, templateType, headers, controller.signal);
      toast.dismiss(toastId);
      
      if (generated) {
        setTemplate(generated);
        toast.success("Template generated successfully!");
      } else {
        toast.error("The AI returned an empty response. Please try again.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error(error.message);
      }
    } finally {
      setIsGenerating(false);
      generationController.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (generationController.current) {
      generationController.current.abort();
      toast.error("Generation cancelled.");
    }
  };

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

  const insertHeaderAtEnd = (header: string) => {
    const newTemplate = template + (template.endsWith(' ') ? '' : ' ') + `@${header} `;
    setTemplate(newTemplate);
    
    // Focus the textarea and move cursor to end
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPosition = newTemplate.length;
      textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    const fileName = file ? file.name.replace(/\.[^/.]+$/, "") : 'processed_data';
    processAndDownload(template, format, pdfHeader, fileName);
    if (file) {
      addToHistory({
        fileName: file.name,
        template: template,
        processedData: processedData,
        fileType: format,
        pdfHeader: pdfHeader,
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
                    <button
                      key={header}
                      onClick={() => insertHeaderAtEnd(header)}
                      className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm animate-float hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-200 cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      @{header}
                    </button>
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
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Design Your Template
                </h3>
                
                {/* PDF Header Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      PDF Header (optional):
                    </label>
                    <input
                      type="text"
                      value={pdfHeader}
                      onChange={(e) => setPdfHeader(e.target.value)}
                      placeholder="Enter PDF header..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      This will appear at the top of your PDF.
                    </p>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Template Type:
                    </label>
                    <input
                      type="text"
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      placeholder="e.g., Invitation, Report"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Helps the AI generate a better template.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={template}
                  onChange={handleTemplateChange}
                  placeholder="Start typing your template... Use @ to insert headers from your spreadsheet, or click on the header blocks above"
                  className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none pr-10"
                  rows={8}
                  disabled={isGenerating}
                />
                {!isGenerating ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleGenerateTemplate}
                    disabled={isGenerating}
                    className="absolute top-3 right-3 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Sparkles className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={handleCancelGeneration}
                    className="absolute top-3 right-3"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}

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
                          className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md"
                        >
                          {header}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => handleDownload('txt')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download .txt
                </Button>
                <Button
                  onClick={() => handleDownload('pdf')}
                  className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download .pdf
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
