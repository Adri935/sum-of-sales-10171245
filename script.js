// Parse a data URL into its components
function parseDataUrl(url) {
  if (!url.startsWith('data:')) {
    throw new Error('Invalid data URL');
  }
  
  const commaIndex = url.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid data URL format');
  }
  
  const header = url.substring(5, commaIndex);
  const payload = url.substring(commaIndex + 1);
  
  const parts = header.split(';');
  const mime = parts[0] || 'text/plain';
  const isBase64 = parts.includes('base64');
  
  return { mime, isBase64, payload };
}

// Decode base64 string to text
function decodeBase64ToText(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Parse CSV text into headers and rows
function parseCsv(text) {
  // Normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split into lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  
  // Detect delimiter
  const delimiters = [',', ';', '\t'];
  let delimiter = ',';
  let maxCount = 0;
  
  for (const delim of delimiters) {
    const count = (lines[0].match(new RegExp(delim, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      delimiter = delim;
    }
  }
  
  // Parse lines
  const rows = lines.map(line => {
    // Simple CSV parsing (doesn't handle all edge cases)
    return line.split(delimiter).map(field => {
      // Remove quotes if present
      if (field.startsWith('"') && field.endsWith('"')) {
        return field.substring(1, field.length - 1).replace(/""/g, '"');
      }
      return field;
    });
  });
  
  // Infer if first row is header
  const firstRow = rows[0];
  const isHeader = firstRow.some(field => isNaN(parseFloat(field)) || field === '');
  
  if (isHeader && rows.length > 1) {
    const headers = rows[0];
    const dataRows = rows.slice(1);
    return { headers, rows: dataRows };
  } else {
    return { rows };
  }
}

// Load Bootstrap 5 from jsDelivr
function loadBootstrap() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Fetch and process CSV data
async function processSalesData() {
  try {
    // Set the document title
    document.title = 'Sales Summary TEST123';
    
    // Load Bootstrap
    await loadBootstrap();
    
    // Attachment URL from the specification
    const attachmentUrl = 'data:text/csv;base64,UHJvZHVjdHMsU2FsZXMKUGhvbmVzLDEwMDAKQm9va3MsMTIzLjQ1Ck5vdGVib29rcywxMTEuMTEK';
    
    // Parse the data URL
    const { mime, isBase64, payload } = parseDataUrl(attachmentUrl);
    
    if (mime !== 'text/csv') {
      throw new Error('Invalid MIME type for CSV data');
    }
    
    // Decode the payload
    const csvText = isBase64 ? decodeBase64ToText(payload) : decodeURIComponent(payload);
    
    // Parse CSV
    const { headers, rows } = parseCsv(csvText);
    
    // Find the sales column
    let salesColumnIndex = -1;
    let productColumnIndex = -1;
    if (headers) {
      salesColumnIndex = headers.findIndex(header => 
        header.toLowerCase().includes('sales') || header.toLowerCase().includes('sale')
      );
      productColumnIndex = headers.findIndex(header => 
        header.toLowerCase().includes('product')
      );
    }
    
    // If we couldn't find by header name, assume positions
    if (salesColumnIndex === -1) {
      salesColumnIndex = 1;
    }
    if (productColumnIndex === -1) {
      productColumnIndex = 0;
    }
    
    // Calculate total sales
    let totalSales = 0;
    const productSales = [];
    
    for (const row of rows) {
      const salesValue = parseFloat(row[salesColumnIndex]);
      const productName = row[productColumnIndex];
      
      if (!isNaN(salesValue)) {
        totalSales += salesValue;
        productSales.push({
          product: productName,
          sales: salesValue
        });
      }
    }
    
    // Display the total sales
    const totalSalesElement = document.getElementById('total-sales');
    if (totalSalesElement) {
      totalSalesElement.textContent = totalSales.toFixed(2);
    }
    
    // Populate the product sales table
    const tableBody = document.querySelector('#product-sales tbody');
    if (tableBody) {
      tableBody.innerHTML = '';
      productSales.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.product}</td>
          <td>$${item.sales.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error processing sales data:', error);
    const totalSalesElement = document.getElementById('total-sales');
    if (totalSalesElement) {
      totalSalesElement.textContent = 'Error';
    }
  }
}

// Initialize the application
processSalesData();