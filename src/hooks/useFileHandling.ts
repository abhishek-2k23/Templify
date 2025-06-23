import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useFileContext } from './useFileContext';

pdfMake.vfs = pdfFonts.vfs;
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

  const handleFileSelected = (file: File) => {
    if (
      !ALLOWED_FILE_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      )
    ) {
      alert('Please upload only Excel (.xls, .xlsx) or CSV files');
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

  const downloadProcessedData = (format: 'txt' | 'pdf', pdfHeader?: string) => {
    if (format === 'txt') {
      const blob = new Blob([processedData.join('\n')], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'processed_data.txt');
    } else {
      const content = [
        { text: pdfHeader || 'Processed Data', style: 'header' },
        { text: '\n' }
      ];
      
      processedData.forEach((data) => {
        content.push({ text: data });
        content.push({ text: '\n\n\n\n' }); // 4 spaces spacing
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

      pdfMake.createPdf(docDefinition).download('processed_data.pdf');
    }
  };

  const processAndDownload = (template: string, format: 'txt' | 'pdf', pdfHeader?: string, fileName?: string) => {
    const processed = tableData.map((row) => {
      let processedRow = template;
      headers.forEach((header) => {
        const regex = new RegExp(`@${header}`, 'g');
        processedRow = processedRow.replace(regex, row[header] || '');
      });
      return processedRow;
    });

    if (format === 'txt') {
      const blob = new Blob([processed.join('\n\n')], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, `${fileName || 'processed_data'}.txt`);
    } else {
      const content = [
        { text: pdfHeader || `${fileName || 'processed_data'} data`, style: 'header' },
        { text: '\n' }
      ];
      
      processed.forEach((p) => {
        content.push({ text: p });
        content.push({ text: '\n\n\n\n' }); // 4 spaces spacing
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

      pdfMake.createPdf(docDefinition).download(`${fileName || 'processed_data'}.pdf`);
    }

    // Also update the context
    setTemplate(template);
    setProcessedData(processed);
  }

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
    downloadProcessedData,
    handleResetData,
    processAndDownload,
  };
};
export default useFileHandling;
