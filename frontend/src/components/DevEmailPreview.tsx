import React, { useState } from 'react';
import axios from 'axios';

/**
 * A development-only component that shows the preview URL for the last sent email
 * This is useful for testing the OTP system without having to set up a real email service
 */
const DevEmailPreview: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestEmailUrl = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/dev/last-email-url`);
      if (response.data && response.data.url) {
        setPreviewUrl(response.data.url);
      } else {
        setError('No email URL found');
      }
    } catch (err) {
      setError('Failed to fetch email preview URL');
      console.error('Error fetching email preview:', err);
    } finally {
      setLoading(false);
    }
  };

  // Only show this component in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#f0f0f0',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#666' }}>
        DEV MODE: Email Preview
      </div>
      
      <button 
        onClick={fetchLatestEmailUrl}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px',
          width: '100%'
        }}
      >
        {loading ? 'Loading...' : 'Get Latest Email'}
      </button>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      {previewUrl && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '5px', fontSize: '14px' }}>
            View your OTP email here:
          </div>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#1976d2', wordBreak: 'break-all', fontSize: '14px' }}
          >
            Open Email Preview
          </a>
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
        This helper is only visible in development mode
      </div>
    </div>
  );
};

export default DevEmailPreview;
