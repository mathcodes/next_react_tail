"use client";
// filepath: /Users/jonchristie/Desktop/tailwind-landing-page-template-main/components/CSVUpload.tsx
import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CSVUpload() {
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        const parsedData = XLSX.utils.sheet_to_json(XLSX.read(text, { type: 'binary' }).Sheets.Sheet1);
        setData(parsedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const downloadAsXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#csv-table' });
    doc.save('data.pdf');
  };

  const downloadAsTXT = () => {
    const txtData = data.map(row => Object.values(row).join('\t')).join('\n');
    const blob = new Blob([txtData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.txt';
    link.click();
  };

  return (
    <div className="p-4">
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {data.length > 0 && (
        <>
          <table id="csv-table" className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-4 py-2 border">{value as string}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 space-x-2">
            <CSVLink data={data} filename="data.csv" className="btn">Download CSV</CSVLink>
            <button onClick={downloadAsXLSX} className="btn">Download XLSX</button>
            <button onClick={downloadAsPDF} className="btn">Download PDF</button>
            <button onClick={downloadAsTXT} className="btn">Download TXT</button>
          </div>
        </>
      )}
    </div>
  );
}