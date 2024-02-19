export const dbIntegrityCheck = async (db) => {
    db.exec("PRAGMA integrity_check");
};