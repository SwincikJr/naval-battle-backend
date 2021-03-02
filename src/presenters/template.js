exports.applyParams = (content, params) => {
    params.forEach((param, index) => {
      const pattern = new RegExp(`#${index + 1}#`, 'g')
      content = content.replace(pattern, param)
    })
    return content
}
