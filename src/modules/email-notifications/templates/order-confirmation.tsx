import React from 'react';
import { BaseTemplate } from './base';

export default function OrderConfirmationTemplate(props: any) {
  const { order } = props;
  
  if (!order) {
    return (
      <BaseTemplate>
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order details are not available at the moment. Please check your account for more information.</p>
      </BaseTemplate>
    );
  }

  return (
    <BaseTemplate>
      <h1>Order Confirmation</h1>
      <p>Hello {order.shipping_address?.first_name || 'Valued Customer'},</p>
      <p>Thank you for your order! We're processing it now and will notify you when it ships.</p>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '5px' }}>
        <h2 style={{ marginTop: 0 }}>Order Summary</h2>
        <p><strong>Order Number:</strong> #{order.display_id}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Total:</strong> {(order.total / 100).toFixed(2)} {order.currency_code?.toUpperCase()}</p>
      </div>
      
      <h3>Items</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
            <th style={{ textAlign: 'center', padding: '8px' }}>Quantity</th>
            <th style={{ textAlign: 'right', padding: '8px' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{item.title}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '8px' }}>
                {(item.unit_price / 100).toFixed(2)} {order.currency_code?.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <p>You can view your order status by logging into your account.</p>
      <p>Best regards,<br />xGlobal-tents Team</p>
    </BaseTemplate>
  );
}
