import React from 'react';
import { BaseTemplate } from './base';

interface ResetPasswordProps {
  email?: string;
  token?: string;
  domain?: string;
}

export default function ResetPasswordTemplate(props: ResetPasswordProps) {
  const { email, token, domain } = props;
  const resetLink = `${domain || 'https://dashboard.xglobal-tents.app'}/reset-password?token=${token}`;

  return (
    <BaseTemplate>
      <h1>Reset Your Password</h1>
      <p>Hello,</p>
      <p>
        We received a request to reset your password for your account with email: <strong>{email}</strong>. 
        Click the link below to set a new password:
      </p>
      <div style={{ margin: '30px 0' }}>
        <a 
          href={resetLink}
          style={{
            padding: '10px 15px',
            backgroundColor: '#111827',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Reset Password
        </a>
      </div>
      <p>
        This link is valid for 24 hours. If you didn't request a password reset, please ignore this email.
      </p>
      <p>Best regards,<br />xGlobal-tents Team</p>
    </BaseTemplate>
  );
}
