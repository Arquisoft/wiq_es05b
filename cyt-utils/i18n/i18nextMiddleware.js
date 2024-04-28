const i18nextMiddleware = (i18next) => (req, res, next) => {
  const language = req.headers['accept-language'] || 'en';
  i18next.changeLanguage(language);
  next()
}

module.exports = i18nextMiddleware;