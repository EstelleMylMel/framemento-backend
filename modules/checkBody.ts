function checkBody(body: any, keys: any) {
    let isValid = true;
  
    for (const field of keys) {
      if (!body[field] || body[field] === '') {
        isValid = false;
      }
    }
  
    return isValid;
  }
  
  module.exports = { checkBody };