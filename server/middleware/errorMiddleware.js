export function notFound(req, res) {
  res.status(404).json({ error: `No route found for ${req.method} ${req.path}.` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  // Avoid logging request bodies or provider error objects that may contain
  // private prompts, headers, or other sensitive details.
  console.error('Request failed:', {
    name: error.name,
    status: error.status,
    code: error.code,
    causeName: error.cause?.name,
    causeCode: error.cause?.code,
  });
  let status = Number.isInteger(error.status) ? error.status : 500;
  let message = 'Something went wrong. Please try again.';
  if (error.type === 'entity.too.large') {
    status = 413;
    message = 'This request is too large. Shorten the message or attach a smaller text file.';
  } else if (error.type === 'entity.parse.failed') {
    status = 400;
    message = 'The request was not valid JSON.';
  } else if (error.message === 'Origin is not allowed.') {
    status = 403;
    message = 'This website is not allowed to use the chat API.';
  }
  if (error.status === 429) {
    status = 429;
    message = 'The AI service is busy or its quota is exhausted. Please wait a moment and try again.';
  } else if (error.status === 401 || error.status === 403) {
    status = 502;
    message = 'The AI provider rejected the server API key or project. Check the key in your server environment settings.';
  } else if (error.status === 404) {
    status = 502;
    message = 'The selected AI model was not found. Check OPENAI_MODEL in your server environment settings.';
  } else if (error.status === 400) {
    status = 502;
    message = 'The AI provider rejected the request. Check the selected model and provider settings.';
  } else if (error.name === 'APIConnectionError' || error.message === 'Connection error.' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    status = 503;
    message = 'The server could not connect to the AI provider. Check the provider URL and server network, then try again.';
  } else if (error.code === 'ETIMEDOUT' || error.name === 'APIConnectionTimeoutError') {
    status = 504;
    message = 'The AI service took too long to respond. Please try again.';
  } else if (error.status >= 500 && error.status !== 503) {
    status = 502;
    message = 'The AI service could not complete your request. Please try again.';
  }
  res.status(status).json({ error: message });
}
