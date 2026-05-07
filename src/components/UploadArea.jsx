import { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

export default function UploadArea({ onProcessPDF }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        await processFile(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    try {
      await onProcessPDF(file);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div 
        className={`upload-area ${isDragging ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="application/pdf"
          onChange={handleFileChange}
        />
        
        {isProcessing ? (
          <>
            <Loader2 className="upload-icon" style={{ animation: 'spin 2s linear infinite' }} />
            <h3>Processing PDF...</h3>
            <p>Breaking down content into micro-lessons</p>
          </>
        ) : (
          <>
            <UploadCloud className="upload-icon" />
            <h3>Drag & Drop your PDF here</h3>
            <p>or click to browse files</p>
            <button className="btn" style={{ marginTop: '1rem' }} onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
              <FileText size={20} /> Select PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
