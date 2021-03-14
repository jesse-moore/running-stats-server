export const validateStravaID = (id: string): Boolean => {
    if (id.length === 0) return false;
    if (id.length > 20) return false;
    return !Number.isNaN(Number.parseInt(id));
};
