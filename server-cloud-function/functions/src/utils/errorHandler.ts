export const handleAxiosError = (error: { [k: string]: any }): void => {
    if (error.response) {
        const { data, status, headers } = error.response;
        console.error('Response Error', { data, status, headers });
    } else if (error.request) {
        console.error('Request Error', error.request);
    } else {
        console.error('Server Error', error.message);
    }
};
