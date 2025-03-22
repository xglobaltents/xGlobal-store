import React from 'react';
import { BaseTemplate } from './base';

interface InviteProps {
  user_email?: string;
  token?: string;
  display_name?: string;
  domain?: string;
}

export default function InviteTemplate(props: InviteProps) {
  const { user_email, token, display_name, domain } = props;
  const inviteLink = `${domain || 'https://dashboard.xglobal-tents.app'}/invite?token=${token}`;

  return (
    <BaseTemplate>
      <h1>You've been invited</h1>
      <p>Hello{display_name ? ` ${display_name}` : ''},</p>
      <p>
        You've been invited to join the xGlobal-tents admin panel. Use the link below to accept the invitation:
      </p>
      <div style={{ margin: '30px 0' }}>
        <a 
          href={inviteLink}
          style={{
            padding: '10px 15px',
            backgroundColor: '#111827',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Accept Invitation
        </a>
      </div>
      <p>
        If you have any questions, feel free to reach out to us.
      </p>
      <p>Best regards,<br />xGlobal-tents Team</p>
    </BaseTemplate>
  );
}
