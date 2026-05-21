/**
 * TEMPLE WEBSITE BACKEND (Google Apps Script)
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet (e.g., "Temple Website Data").
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code there and paste this ENTIRE file.
 * 4. Run the function 'setupSheet' once (Select it from the toolbar and click Run).
 *    - This will automatically create all 5 required sheets with headers.
 * 4a. (Optional) Run 'populateGalleryDefault' to instantly add your 18 local images to the sheet.
 * 5. Click 'Deploy' > 'New Deployment' > Select type 'Web App'.
 * 6. Set 'Description' to "Api v1".
 * 7. Set 'Execute as' to "Me".
 * 8. Set 'Who has access' to "Anyone" (Critical!).
 * 9. Click 'Deploy' and copy the "Web App URL".
 * 10. Paste this URL into your website's `scripts/api.js` file.
 */

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = {};
  
  // Helper to get data from a sheet
  const getSheetData = (sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0]; // First row is header
    return rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        // Simple normalization: "Image_Name" -> "image_name"
        obj[header.toString().toLowerCase().replace(/_/g, '_')] = row[i]; 
      });
      return obj;
    });
  };

  // 1. Temple Updates (Active Only)
  const updatesRaw = getSheetData('Temple_Updates');
  data.updates = updatesRaw.filter(item => item.status && item.status.toString().toLowerCase() === 'active');

  // 2. Gallery Images (Show Only, Sorted by Display_Order)
  const galleryRaw = getSheetData('Gallery_Images');
  data.gallery = galleryRaw
    .filter(item => item.status && item.status.toString().toLowerCase() === 'show')
    .sort((a, b) => (a.display_order || 999) - (b.display_order || 999));

  // 3. Announcements (Active Only)
  const announcementsRaw = getSheetData('Announcements');
  data.announcements = announcementsRaw.filter(item => item.status && item.status.toString().toLowerCase() === 'active');

  // 4. Other Static Data (Config, Timings, Festivals, Donations Info)
  // We keep these for general site content if needed, or user can maintain them in sheets too.
  data.config = {};
  const configSheet = ss.getSheetByName('Config');
  if (configSheet) {
    const configRows = configSheet.getDataRange().getValues();
    configRows.slice(1).forEach(row => {
      if(row[0]) data.config[row[0]] = row[1];
    });
  }
  
  data.timings = getSheetData('Timings');
  data.festivals = getSheetData('Festivals');
  data.donations_info = getSheetData('Donations_Info'); // Information about donation types, different from 'Donations' ledger

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get parameters from the request (handles both URL params and Form-data body)
  let params = e.parameter;
  
  // Fallback: Check if data is sent as a JSON string in the body
  if (Object.keys(params).length === 0 && e.postData && e.postData.contents) {
    try {
      params = JSON.parse(e.postData.contents);
    } catch(err) {
      // If parsing fails, stick with empty parameter object
    }
  }
  
  // --- 1. IMAGE UPLOAD TO GOOGLE DRIVE ---
  if (params.type === 'upload') {
    try {
      const folderName = "Temple_Website_Gallery";
      let folder;
      const folders = DriveApp.getFoldersByName(folderName);
      
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
      
      const contentType = params.mimeType || "image/jpeg";
      const fileName = params.fileName || ("upload_" + Date.now());
      const decodedData = Utilities.base64Decode(params.base64);
      const blob = Utilities.newBlob(decodedData, contentType, fileName);
      
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      const fileId = file.getId();
      // Using a direct link that works for <img> tags
      const fileUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success', 
        url: fileUrl,
        message: 'Image uploaded to Google Drive'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error', 
        message: err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // --- 2. UPDATE FULL SHEET DATA (For Festivals, Timings, etc.) ---
  // This allows the Admin Panel to overwrite the entire sheet with a new list
  if (params.type && params.type.startsWith('update_')) {
    const sheetMapping = {
      'update_festivals': 'Festivals',
      'update_timings': 'Timings',
      'update_announcements': 'Announcements',
      'update_gallery': 'Gallery_Images',
      'update_updates': 'Temple_Updates'
    };
    
    const targetSheetName = sheetMapping[params.type];
    if (targetSheetName) {
      const sheet = ss.getSheetByName(targetSheetName);
      if (sheet) {
        const dataList = JSON.parse(params.data);
        if (Array.isArray(dataList)) {
          // Keep headers, clear old data
          const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
          sheet.clearContents();
          sheet.appendRow(headers);
          
          dataList.forEach(item => {
            const row = headers.map(h => {
              const key = h.toLowerCase().replace(/ /g, '_');
              return item[key] !== undefined ? item[key] : "";
            });
            sheet.appendRow(row);
          });
          
          return ContentService.createTextOutput(JSON.stringify({status: 'success', message: 'Sheet updated'}))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
  }

  // --- 3. VOLUNTEER REGISTRATION ---
  if (params.type === 'volunteer') {
    let sheet = ss.getSheetByName('Volunteers');
    if (!sheet) {
      sheet = ss.insertSheet('Volunteers');
      sheet.appendRow(['Timestamp', 'Full_Name', 'Parent_Name', 'Age', 'Gender', 'Mobile', 'Email', 'Address', 'Occupation', 'Availability', 'Area_of_Interest', 'Preferred_Time', 'Emergency_Contact', 'Consent']);
    }
    
    sheet.appendRow([
      new Date(),
      params.full_name,
      params.parent_name,
      params.age,
      params.gender,
      params.mobile,
      params.email,
      params.address,
      params.occupation,
      params.availability,
      params.area_of_interest,
      params.preferred_time,
      params.emergency_contact,
      params.consent
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success', message: 'Volunteer registered'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // --- 4. DONATION LEDGER ---
  if (params.type === 'donation') {
    let sheet = ss.getSheetByName('Donations');
    if (!sheet) {
      sheet = ss.insertSheet('Donations');
      sheet.appendRow(['Receipt_Number', 'Date', 'Donor_Name', 'Mobile', 'Donation_Type', 'Amount', 'Mode_of_Donation', 'Bank_Reference']);
    }

    const receiptNum = "RCPT-" + Date.now();

    sheet.appendRow([
      receiptNum,
      new Date(),
      params.donor_name,
      params.mobile,
      params.donation_type,
      params.amount,
      params.mode_of_donation,
      params.bank_reference || 'N/A'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success', message: 'Donation recorded', receipt: receiptNum}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Unknown type'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Temple Updates
  let sheet = ss.getSheetByName('Temple_Updates');
  if (!sheet) {
    sheet = ss.insertSheet('Temple_Updates');
    sheet.appendRow(['Date', 'Update_Title', 'Update_Description', 'Status']); // Headers
  }

  // 2. Gallery Images
  sheet = ss.getSheetByName('Gallery_Images');
  if (!sheet) {
    sheet = ss.insertSheet('Gallery_Images');
    sheet.appendRow(['Image_Name', 'Image_URL', 'Display_Order', 'Status']);
  }

  // 3. Announcements
  sheet = ss.getSheetByName('Announcements');
  if (!sheet) {
    sheet = ss.insertSheet('Announcements');
    sheet.appendRow(['Announcement_Text', 'Priority', 'Status']);
  }

  // 4. Volunteers
  sheet = ss.getSheetByName('Volunteers');
  if (!sheet) {
    sheet = ss.insertSheet('Volunteers');
    sheet.appendRow(['Timestamp', 'Full_Name', 'Parent_Name', 'Age', 'Gender', 'Mobile', 'Email', 'Address', 'Occupation', 'Availability', 'Area_of_Interest', 'Preferred_Time', 'Emergency_Contact', 'Consent']);
  }

  // 5. Donations
  sheet = ss.getSheetByName('Donations');
  if (!sheet) {
    sheet = ss.insertSheet('Donations');
    sheet.appendRow(['Receipt_Number', 'Date', 'Donor_Name', 'Mobile', 'Donation_Type', 'Amount', 'Mode_of_Donation', 'Bank_Reference']);
  }

  // 6. Optional / Static Data Sheets
  ['Config', 'Timings', 'Festivals', 'Donations_Info'].forEach(tab => {
     if (!ss.getSheetByName(tab)) ss.insertSheet(tab);
  });
  
  // Config Headers
  const config = ss.getSheetByName('Config');
  if (config.getLastRow() === 0) config.appendRow(['Key', 'Value']);

  Logger.log("Temple Website: All sheets and headers created successfully!");
}

/**
 * RUN THIS FUNCTION ONCE TO POPULATE THE GALLERY SHEET
 * It scans the detected local images and adds them to the sheet if they don't exist.
 */
function populateGalleryDefault() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Gallery_Images');
  
  if (!sheet) {
    setupSheet(); // Ensure sheet exists
    sheet = ss.getSheetByName('Gallery_Images');
  }

  // 1. Get existing URLs to prevent duplicates
  const existingData = sheet.getDataRange().getValues();
  const existingUrls = new Set();
  // Skip header, assuming URL is column index 1 (0-based) based on ['Image_Name', 'Image_URL', 'Display_Order', 'Status']
  if (existingData.length > 1) {
    for (let i = 1; i < existingData.length; i++) {
        existingUrls.add(existingData[i][1]); // Image_URL column
    }
  }

  // 2. List of Local Images (Auto-detected)
  const localImages = [
    "img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg", 
    "img7.jpg", "img8.jpg", "img9.jpg", "img10.jpg", "img11.jpg", "img12.jpg", 
    "img13.jpg", "img14.jpg", "img15.jpg", "img16.jpg", "img17.jpg", "img18.jpg"
  ];

  // 3. Append New Images
  let addedCount = 0;
  localImages.forEach((imgName, index) => {
    const url = `assets/gallery/${imgName}`;
    
    if (!existingUrls.has(url)) {
      sheet.appendRow([
        imgName,                // Image_Name
        url,                    // Image_URL
        index + 1,             // Display_Order
        'Show'                  // Status
      ]);
      addedCount++;
    }
  });

  Logger.log(`Success! Added ${addedCount} new images to Gallery_Images.`);
}
