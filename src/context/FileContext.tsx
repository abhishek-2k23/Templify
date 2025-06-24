import React, { createContext, useState, useEffect } from "react"

interface FileContextProps {
  file: File | null
  setFile: (file: File | null) => void
  headers: string[]
  setHeaders: (headers: string[]) => void
  tableData: { [key: string]: string }[]
  setTableData: (tableData: { [key: string]: string }[]) => void
  template: string
  setTemplate: (template: string) => void
  customTemplate: string
  setCustomTemplate: (template: string) => void
  processedData: string[]
  setProcessedData: (processedData: string[]) => void
  pdfHeader: string
  setPdfHeader: (pdfHeader: string) => void
  templateType: string
  setTemplateType: (templateType: string) => void
}

const FileContext = createContext<FileContextProps>({
  file: null,
  setFile: () => {},
  headers: [],
  setHeaders: () => {},
  tableData: [],
  setTableData: () => {},
  template: "",
  setTemplate: () => {},
  customTemplate: "",
  setCustomTemplate: () => {},
  processedData: [],
  setProcessedData: () => {},
  pdfHeader: "",
  setPdfHeader: () => {},
  templateType: "Invitation",
  setTemplateType: () => {},
})

const STORAGE_KEY = 'templify_file_context';

const FileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [tableData, setTableData] = useState<{ [key: string]: string }[]>([])
  const [template, setTemplate] = useState<string>("")
  const [customTemplate, setCustomTemplate] = useState<string>("")
  const [processedData, setProcessedData] = useState<string[]>([])
  const [pdfHeader, setPdfHeader] = useState<string>("")
  const [templateType, setTemplateType] = useState<string>("Invitation")

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHeaders(parsed.headers || []);
        setTableData(parsed.tableData || []);
        setTemplate(parsed.template || "");
        setCustomTemplate(parsed.customTemplate || "");
        setProcessedData(parsed.processedData || []);
        setPdfHeader(parsed.pdfHeader || "");
        setTemplateType(parsed.templateType || "Invitation");
      } catch { /* ignore JSON parse errors */ }
    }
  }, []);

  // Persist to localStorage on change (except file)
  useEffect(() => {
    const toStore = JSON.stringify({
      headers,
      tableData,
      template,
      customTemplate,
      processedData,
      pdfHeader,
      templateType
    });
    localStorage.setItem(STORAGE_KEY, toStore);
  }, [headers, tableData, template, customTemplate, processedData, pdfHeader, templateType]);

  // Clear all data except file (and localStorage) when a new file is uploaded
  const handleSetFile = (newFile: File | null) => {
    if (newFile) {
      setHeaders([]);
      setTableData([]);
      setTemplate("");
      setCustomTemplate("");
      setProcessedData([]);
      setPdfHeader("");
      setTemplateType("Invitation");
      localStorage.removeItem(STORAGE_KEY);
    }
    setFile(newFile);
  };

  const contextValues = {
    file,
    setFile: handleSetFile,
    headers,
    setHeaders,
    tableData,
    setTableData,
    template,
    setTemplate,
    processedData,
    setProcessedData,
    customTemplate,
    setCustomTemplate,
    pdfHeader,
    setPdfHeader,
    templateType,
    setTemplateType
  }
  return (
    <FileContext.Provider value={contextValues}>{children}</FileContext.Provider>
  )
}

export { FileContext }
export default FileContextProvider
