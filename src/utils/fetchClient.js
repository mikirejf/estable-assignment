// Usage:
// 1: fetchClient(...).then().catch();
// 2: const req = fetchClient(...); req.then().catch(); req.abort();
// 3: const response = await fetchClient(...).promise;
// 4: const req = fetchClient(...); const response = await.promise; req.abort();
export default function fetchClient({ method, url, headers = {}, body }) {
  const req = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      } else {
        reject(
          Error(
            JSON.stringify({
              status: req.status,
              statusText: req.statusText,
              response: req.response ? JSON.parse(req.response) : '',
            })
          )
        );
      }
    };

    req.open(method, url);

    Object.keys(headers)
      .filter((key) => Boolean(headers[key]))
      .forEach((key) => {
        req.setRequestHeader(key, headers[key]);
      });

    const data = body ? JSON.stringify(body) : null;
    req.send(data);
  });

  return {
    abort: () => req.abort(),
    then: (handler) => promise.then(handler),
    promise,
  };
}
