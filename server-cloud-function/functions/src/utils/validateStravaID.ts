export const validateStravaID = (id: String): Boolean => {
    if (id.length === 0) return false;
    if (id.length > 20) return false;
    return true;
};
