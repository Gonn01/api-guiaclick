export function verifyParameters(data, requiredParams) {
  const missing = [];
  requiredParams.forEach(param => {
    if (!data.hasOwnProperty(param) || data[param] === undefined || data[param] === null) {
      missing.push(param);
    }
  });
  return missing;
}

export function verifyAll(req, requiredParams = [], requiredBody = []) {
  const missingParams = verifyParameters(req.params, requiredParams);
  const missingBody = verifyParameters(req.body, requiredBody);
  return [...missingParams, ...missingBody];
}
