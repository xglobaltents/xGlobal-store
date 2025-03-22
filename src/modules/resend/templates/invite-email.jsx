import * as React from 'react'

export const InviteEmail = ({
  inviteUrl,
  userEmail,
  displayName,
}) => (
  <div style={container}>
    <h1 style={h1}>You've been invited!</h1>
    <p style={text}>
      Hello {displayName},
    </p>
    <p style={text}>
      You have been invited to join our admin panel. Click the link below to accept the invitation and set up your account.
    </p>
    <div style={buttonContainer}>
      <a href={inviteUrl} style={button}>
        Accept Invitation
      </a>
    </div>
    <p style={text}>
      Or copy and paste this URL into your browser:
    </p>
    <p style={url}>
      {inviteUrl}
    </p>
    <p style={text}>
      If you did not expect this invitation, you can safely ignore this email.
    </p>
    <p style={footer}>
      This invitation was sent to {userEmail}.
    </p>
  </div>
)

// Basic styling for the email
const container = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px',
  maxWidth: '580px',
  margin: '0 auto',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
}

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center',
  margin: '30px 0',
}

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '50px',
  textAlign: 'center',
  textDecoration: 'none',
  width: '200px',
  padding: '0 20px',
}

const url = {
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
  color: '#5469d4',
  wordBreak: 'break-all',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '30px',
}
