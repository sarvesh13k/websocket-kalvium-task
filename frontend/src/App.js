import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { io } from 'socket.io-client';
import { pdfjs } from 'react-pdf';
import 'animate.css';

// Set PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;

const socket = io('http://localhost:5000', {
  withCredentials: true
});  // Connect to the backend server

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl] = useState('/Sarvesh Rameshwar Kothule.pdf');  // Replace with actual path

  useEffect(() => {
    // Listen for page change broadcast from server
    socket.on('page-changed', (pageNum) => {
      setPageNumber(pageNum);
    });

    return () => {
      socket.off('page-changed'); // Clean up the listener on unmount
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPage = (pageNum) => {
    setPageNumber(pageNum);
    socket.emit('change-page', pageNum);  // Send page change event to backend
  };

  return (
    <div className="App bg-gradient-to-r from-[#1A202C] to-[#2D3748] min-h-screen flex flex-col items-center justify-center p-5">
      {/* Heading with bright color and larger font */}
      <h1 className="text-5xl font-extrabold text-teal-400 mb-6 animate__animated animate__fadeIn animate__delay-1s">
        Kalvium Task - Sarvesh Kothule
      </h1>
      
      <div className="pdf-viewer bg-[#1F2937] shadow-xl p-6 rounded-xl mb-6">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      
      <div className="controls flex space-x-4">
        <button
          onClick={() => goToPage(pageNumber - 1)}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200"
        >
          Previous
        </button>
        
        <button
          onClick={() => goToPage(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
