export const handleAxiosError = (error: { [k: string]: any }): void => {
    if (!error) {
        console.error('Unknown Axios Error');
        return;
    } else if (error.response) {
        const { data, status, headers } = error.response;
        console.error('Response Error', { data, status, headers });
    } else if (error.request) {
        console.error('Request Error', error.request);
    } else if (error.message) {
        console.error('Server Error', error.message);
    } else {
        console.error('Unknown Axios Error');
    }
};
