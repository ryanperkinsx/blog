export const dbIntegrityCheck = async (db) => {
    await db.exec("PRAGMA integrity_check");
};