import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useFileContext } from './useFileContext';
import toast from 'react-hot-toast';

pdfMake.vfs = pdfFonts.vfs;
const API_URL = import.meta.env.VITE_API_URL;

const useFileHandling = () => {
  const {
    setFile,
    headers,
    setHeaders,
    tableData,
    setTableData,
    setTemplate,
    processedData,
    setProcessedData,
    setCustomTemplate
  } = useFileContext();
  const ALLOWED_FILE_EXTENSIONS = ['.xls', '.xlsx', '.csv'];

  // Helper to upload the generated file (PDF or TXT) to backend
  const uploadGeneratedFileToBackend = async (blob: Blob, fileName: string, email: string) => {
    const formData = new FormData();
    formData.append('file', new File([blob], fileName));
    formData.append('email', email);
    try {
      const res = await fetch(`${API_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data; // { url: 'https://cloudinary.com/...' }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'File upload failed';
      toast.error(message);
      throw err;
    }
  };

  const handleFileSelected = (file: File) => {
    if (
      !ALLOWED_FILE_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      )
    ) {
      toast.error('Please upload only Excel (.xls, .xlsx) or CSV files');
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as {
          [key: string]: string;
        }[];

        if (jsonData.length > 0) {
          const extractedHeaders = Object.keys(jsonData[0]);
          setHeaders(extractedHeaders);
          setTableData(jsonData);
          setTemplate('');
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleTemplateSelected = (template: string) => {
    setTemplate(template);
    const processed = tableData.map((row) => {
      let processedRow = template;
      headers.forEach((header) => {
        const regex = new RegExp(`@${header}`, 'g');
        processedRow = processedRow.replace(regex, row[header] || '');
      });
      return processedRow + '\n\n';
    });
    setProcessedData(processed);
  };

  // Updated: Accept email and generate, upload, and return Cloudinary URL
  const processAndDownload = async (
    template: string,
    format: 'txt' | 'pdf',
    pdfHeader?: string,
    fileName?: string,
    email?: string
  ): Promise<{ url?: string }> => {
    if (!template.trim()) {
      toast.error("Template is empty. Please write a template before downloading.");
      return {};
    }
    if (tableData.length === 0) {
      toast.error("No data available to process. Please upload a file.");
      return {};
    }

    const processed = tableData.map((row) => {
      let processedRow = template;
      headers.forEach((header) => {
        const regex = new RegExp(`@${header}`, 'g');
        processedRow = processedRow.replace(regex, row[header] || '');
      });
      return processedRow;
    });

    let blob: Blob;
    const downloadFileName = `${fileName || 'processed_data'}.${format}`;

    if (format === 'txt') {
      blob = new Blob([processed.join('\n\n')], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, downloadFileName);
    } else {
      const content = [
        { text: pdfHeader || `${fileName || 'processed_data'} data`, style: 'header' },
        { text: '\n' }
      ];
      processed.forEach((p) => {
        content.push({ text: p });
        content.push({ text: '\n\n\n\n' });
        content.push({text : '------------------------------'});
      });
      const docDefinition = {
        content: content,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            marginBottom: 10,
          },
        },
      };
      // Generate PDF as Blob
      blob = await new Promise<Blob>((resolve) => {
        pdfMake.createPdf(docDefinition).getBlob((pdfBlob: Blob) => {
          saveAs(pdfBlob, downloadFileName);
          resolve(pdfBlob);
        });
      });
    }

    // Upload the generated file to backend and get Cloudinary URL
    let url: string | undefined = undefined;
    if (email) {
      try {
        const uploadRes = await uploadGeneratedFileToBackend(blob, downloadFileName, email);
        url = uploadRes.file.url;
      } catch {
        // Error toast already shown in uploadGeneratedFileToBackend
      }
    }

    // Also update the context
    setTemplate(template);
    setProcessedData(processed);
    return { url };
  };

  const handleResetData = () => {
    setCustomTemplate('');
    setHeaders([]);
    setFile(null);
    setTableData([]);
    setTemplate('');
    setProcessedData([]);
  };

  return {
    handleFileSelected,
    headers,
    processedData,
    handleTemplateSelected,
    processAndDownload,
    handleResetData,
  };
};

export default useFileHandling;
