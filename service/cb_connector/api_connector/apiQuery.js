exports.fetchQuery = function (site, entityType, entityId) {
 
    let baseUrl = pathResolver
    let apiKey = ""
    let url = site+baseUrl+entityType+"/"entityId+"-u"+apiKey
  
    let output = hitResourceByUrl
    return output;
  };