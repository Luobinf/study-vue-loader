function stringifyRequest(loaderContext, resource) {
    return JSON.stringify(loaderContext.utils.contextify(
        loaderContext.context,
        resource
      ))
}


module.exports = {
    stringifyRequest,
}