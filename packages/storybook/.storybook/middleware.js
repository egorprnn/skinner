// Этот файл специально имеет js расширение - Storybook не обрабатывает ts

export function makeMiddleware(router) {
  // Исправление LFI уязвимости
  router.use((request, response, next) => {
    try {
      const base = `http://${request.headers.host}`;
      const decodedUrl = decodeURIComponent(request.url);
      const escapedUrl = new URL(request.url, base).toString().replace(base, '');
      const decodedEscapedUrl = new URL(decodedUrl, base).toString().replace(base, '');

      if (escapedUrl !== request.url || decodedUrl !== request.url || decodedEscapedUrl !== request.url) {
        return response.status(400).send();
      }
    } catch {
      return response.status(400).send();
    }

    next();
  });
}

export default makeMiddleware;
