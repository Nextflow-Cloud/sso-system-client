type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type { Method };

const createProtectedRequest = (url: string, method: Method, json: string, headers?: Record<string, string>): Promise<Response | undefined> => Promise.race([fetch(url, {
    headers: {
        "Content-Type": "application/json",
        ...headers
    },
    method,
    body: json
}), new Promise(r => setTimeout(r, 5000))]) as Promise<Response | undefined>;

export default createProtectedRequest;
