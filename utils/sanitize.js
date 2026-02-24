import xssFilters from "xss-filters";

function cleanValue(value) {
  if (typeof value === "string") return xssFilters.inHTMLData(value).trim();
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === "object") {
    sanitizeObject(value);
    return value;
  }
  return value;
}

function sanitizeObject(obj) {
  Object.keys(obj).forEach((key) => {
    try {
      obj[key] = cleanValue(obj[key]);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // keep original value on error
    }
  });
}

export default function sanitizeMiddleware() {
  return (req, res, next) => {
    if (req.body && typeof req.body === "object") sanitizeObject(req.body);
    if (req.params && typeof req.params === "object")
      sanitizeObject(req.params);
    if (req.query && typeof req.query === "object") sanitizeObject(req.query);
    next();
  };
}
