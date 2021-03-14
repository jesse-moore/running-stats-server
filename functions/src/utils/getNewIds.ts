import { Change } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default (change: Change<QueryDocumentSnapshot>): number[] | null => {
    const beforeIds = change.before.data().ids;
    const afterIds = change.after.data().ids;
    if (
        !Array.isArray(afterIds) ||
        !Array.isArray(beforeIds) ||
        afterIds.length === 0
    )
        return null;
    return afterIds.filter((id) => {
        if (beforeIds.includes(id)) return false;
        return true;
    });
};
