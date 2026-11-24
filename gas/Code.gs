/**
 * ENTRY POINT & API ROUTER GOOGLE APPS SCRIPT
 * Kantin Al-Imam Stock Management System
 */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getAllData';
  
  try {
    let result;
    switch (action) {
      case 'getAllData':
        result = getAllData();
        break;
      case 'setupDatabase':
        result = setupDatabase();
        break;
      case 'ping':
        result = { status: 'OK', message: 'API Kantin Al-Imam siap digunakan!', time: new Date() };
        break;
      default:
        result = { error: true, message: 'Action tidak dikenal: ' + action };
    }
    return jsonResponse({ success: true, data: result });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

function doPost(e) {
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }
    
    const action = body.action;
    const category = body.category;
    const user = body.user || 'Petugas Kantin';
    let responseData;
    
    switch (action) {
      case 'getAllData':
        responseData = getAllData();
        break;
        
      case 'setupDatabase':
        responseData = setupDatabase();
        break;
        
      case 'addItem':
        responseData = addItem(category, body.data, user);
        break;
        
      case 'updateItem':
        responseData = updateItem(category, body.id, body.data, user);
        break;
        
      case 'deleteItem':
        responseData = deleteItem(category, body.id, user);
        break;
        
      case 'updateKonsinyasiStatus':
        responseData = updateKonsinyasiStatus(category, body.id, body.status, user);
        break;

      case 'recordMutasi':
        responseData = recordMutasi(body.data, user);
        break;
        
      default:
        return jsonResponse({ success: false, message: 'Action tidak didukung: ' + action });
    }
    
    return jsonResponse({ success: true, ...responseData });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
