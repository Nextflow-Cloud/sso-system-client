// eslint-disable-next-line no-undef
const createProtectedRequest = async (url: string, options: RequestInit) => {
    try {
        const request = await Promise.race([fetch(url, options), new Promise(r => setTimeout(r, 5000))]);
        if (!(request instanceof Response)) {
            throw new Error("Request timed out.");
        } else if (!request.ok) {
            throw new Error(`Request failed with status code ${request.status}.`);
        } else {
            try {
                return await request.json();
            } catch {
                throw new Error("Request failed to parse JSON.");
            }
        }
    } catch {
        throw new Error("Request failed due to CORS or network issues.");
    }
};

export default createProtectedRequest;
