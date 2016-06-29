export function fitDataSlice(fitResult, startIndex, endIndex) {

  var paged = JSON.parse(JSON.stringify(fitResult)); 

  paged["labels"]["data"]["y"]["row_labels"] = 
      fitResult.labels.data.y.row_labels.slice(startIndex,endIndex);

  paged["data"]["y"] = 
      fitResult.data.y.slice(startIndex,endIndex);

  paged["data"]["x"] = 
      fitResult.data.x.slice(startIndex,endIndex);

  if (fitResult.qof.residuals) {
      paged["qof"]["residuals"]= 
        fitResult.qof.residuals.slice(startIndex, endIndex);
  }

  // this is complete nonsense
  // insert profanities here
  if (fitResult.fit.coeffs) {
  if (fitResult.qof.cov) {
      paged["qof"]["cov"]= 
        fitResult.qof.cov.slice(startIndex, endIndex);
  }

  if (fitResult.qof.rms) {
      paged["qof"]["rms"]= 
        fitResult.qof.rms.slice(startIndex, endIndex);
  }

  if (fitResult.fit.y) {
      paged["fit"]["y"] = 
          fitResult.fit.y.slice(startIndex,endIndex);
  }

  if (fitResult.fit.coeffs[0]) {
      paged.fit.coeffs[0] = fitResult.fit.coeffs[0].slice(startIndex, endIndex);
  }

  if (fitResult.fit.coeffs[1]) {
      paged.fit.coeffs[1] = fitResult.fit.coeffs[1].slice(startIndex, endIndex);
  }

  if (fitResult.fit.coeffs[2]) {
      paged.fit.coeffs[2] = fitResult.fit.coeffs[2].slice(startIndex, endIndex);
  }
  }
  
  
  return paged;
}

export function fitDataFilter(fitResult, indices) {
  console.log("fitDataFilter: begin");
  var filterByIndices = function(element, index) {
    return indices.indexOf(index) > -1;
  };

  if (!indices.length) { 
    //return null;
  }
  
  var paged = JSON.parse(JSON.stringify(fitResult)); 

  paged["labels"]["data"]["y"]["row_labels"] = 
      fitResult.labels.data.y.row_labels.filter(filterByIndices);

  paged["data"]["y"] = 
      fitResult.data.y.filter(filterByIndices);

  paged["data"]["x"] = 
      fitResult.data.x.filter(filterByIndices);

  if (fitResult.fit.coeffs) {
  if (fitResult.qof.residuals) {
      paged["qof"]["residuals"]= 
        fitResult.qof.residuals.filter(filterByIndices);
  }
  
  if (fitResult.qof.cov) {
      paged["qof"]["cov"]= 
        fitResult.qof.cov.filter(filterByIndices);
  }

  if (fitResult.qof.rms) {
      paged["qof"]["rms"]= 
        fitResult.qof.rms.filter(filterByIndices);
  }

  if (fitResult.fit.y) {
      paged["fit"]["y"] = 
          fitResult.fit.y.filter(filterByIndices);
  }

  if (fitResult.fit.coeffs[0]) {
      paged.fit.coeffs[0] = fitResult.fit.coeffs[0].filter(filterByIndices);
  }

  if (fitResult.fit.coeffs[1]) {
      paged.fit.coeffs[1] = fitResult.fit.coeffs[1].filter(filterByIndices);
  }

  if (fitResult.fit.coeffs[2]) {
      paged.fit.coeffs[2] = fitResult.fit.coeffs[2].filter(filterByIndices);
  }
  }

  console.log("fitDataFilter: end");
  return paged;
}
