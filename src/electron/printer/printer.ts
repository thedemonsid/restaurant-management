import { BrowserWindow } from 'electron';

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptData {
  orderId: string;
  date: string;
  items: ReceiptItem[];
  total: number;
}

export async function printReceipt(data: ReceiptData) {
  const printWindow = new BrowserWindow({
    width: 800,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const receiptHTML = `
    <html>
     <style>
         html,
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 80mm;
          }
          h1 {
            text-align: center;
            font-size: 40px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          hr {
            border: 0;
            border-top: 1px solid #000;
            margin: 10px 0;
          }
          p {
            margin: 5px 0;
            font-size: 14px;
            font-weight: bold;
          }
          .item {
            display: flex;
            justify-content: space-between;
          }
          .total {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
          }
        </style>
      <body>
        <h1>समृद्धी रेस्टॉरंट - शुद्ध शाकाहारी</h1>
        <p>कोंढेज चौक, जेऊर (413202) नगर टेंभुर्णी महामार्ग</p>
        <hr>
        <p>Order: ${data.orderId}</p>
        <p>Date: ${data.date}</p>
        <hr>
        ${data.items.map(item => `
          <p>${item.name} * ${item.quantity} - ₹${item.price} - ₹${item.price * item.quantity} </p>
        `).join('')}
        <hr>
        <p>Total: ₹${data.total}</p>
      </body>
    </html>
  `;

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`);

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({}, (success, errorType) => {
      if (!success) console.error(`Failed to print: ${errorType}`);
      printWindow.close();
    });
  });
}