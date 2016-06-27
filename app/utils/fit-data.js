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
  
  return paged;
}

export function fitDataFilter(filter, indices) {
  return true;
}
