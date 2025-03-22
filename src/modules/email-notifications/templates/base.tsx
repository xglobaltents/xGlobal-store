import React from 'react';

interface BaseTemplateProps {
  children: React.ReactNode;
}

export function BaseTemplate({ children }: BaseTemplateProps) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ 
        textAlign: 'center', 
        paddingBottom: '20px', 
        borderBottom: '1px solid #eaeaea',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0 }}>xGlobal-tents</h2>
      </div>
      
      <div style={{ lineHeight: '1.6' }}>
        {children}
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        paddingTop: '20px', 
        borderTop: '1px solid #eaeaea', 
        color: '#666',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        <p>© {new Date().getFullYear()} xGlobal-tents. All rights reserved.</p>
      </div>
    </div>
  );
}
