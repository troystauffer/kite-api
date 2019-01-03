function unsecuredRoutes(apiPrefix) {
  let fieldsRegex = new RegExp('^' + apiPrefix + '\/fields\/[a-zA-Z]*\.?[a-zA-Z]*');
  return [
    { url: apiPrefix + '/authenticate', methods: ['POST'] },
    { url: apiPrefix + '/users', methods: ['POST'] },
    { url: apiPrefix + '/info', methods: ['GET'] }
  ];
}

module.exports = unsecuredRoutes;
