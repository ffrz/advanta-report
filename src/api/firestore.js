// src/api/firestore.js
import { db } from './firebase'; // Import db instance dari firebase.js
import { collection, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc, query, where, getDocs, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';

const USERS_COLLECTION = 'artifacts/advanta-report/users';
const BS_USERS_COLLECTION = 'artifacts/advanta-report/public/data/bs_users';
const DEMPLOT_COLLECTION = 'artifacts/advanta-report/public/data/demplots';
const ACTIVITIES_COLLECTION = 'artifacts/advanta-report/public/data/activities';
const TARGETS_COLLECTION = 'artifacts/advanta-report/public/data/targets';

// --- User Profile Functions ---
export const getUserProfile = async (uid) => {
    try {
        const userDocRef = doc(db, USERS_COLLECTION, uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return { id: userDocSnap.id, ...userDocSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

export const setUserProfile = async (uid, userData) => {
    try {
        const userDocRef = doc(db, USERS_COLLECTION, uid);
        await setDoc(userDocRef, userData, { merge: true }); // Use merge to avoid overwriting
    } catch (error) {
        console.error("Error setting user profile:", error);
        throw error;
    }
};

export const updateProfileData = async (uid, data) => {
    try {
        const userDocRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userDocRef, data);
        // Jika BS, update juga di koleksi publik
        if (data.role === 'BS') {
            const bsUserDocRef = doc(db, BS_USERS_COLLECTION, uid);
            await updateDoc(bsUserDocRef, {
                name: data.name,
                workArea: data.workArea,
                profilePhoto: data.profilePhoto // Pastikan ini diupdate juga
            });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const addBsUserToPublic = async (uid, userData) => {
    try {
        const bsUserDocRef = doc(db, BS_USERS_COLLECTION, uid);
        await setDoc(bsUserDocRef, userData);
    } catch (error) {
        console.error("Error adding BS user to public collection:", error);
        throw error;
    }
};

// --- Demplot Functions ---
export const addDemplotReport = async (demplotData) => {
    try {
        const demplotCollectionRef = collection(db, DEMPLOT_COLLECTION);
        await addDoc(demplotCollectionRef, {
            ...demplotData,
            timestamp: serverTimestamp() // Gunakan serverTimestamp
        });
    } catch (error) {
        console.error("Error adding demplot report:", error);
        throw error;
    }
};

export const deleteDemplotReport = async (demplotId) => {
    try {
        const demplotDocRef = doc(db, DEMPLOT_COLLECTION, demplotId);
        await deleteDoc(demplotDocRef);
    } catch (error) {
        console.error("Error deleting demplot report:", error);
        throw error;
    }
};

// --- Activity Functions ---
export const addActivityReport = async (activityData) => {
    try {
        const activitiesCollectionRef = collection(db, ACTIVITIES_COLLECTION);
        await addDoc(activitiesCollectionRef, {
            ...activityData,
            timestamp: serverTimestamp(),
            status: 'pending' // Default status
        });
    } catch (error) {
        console.error("Error adding activity report:", error);
        throw error;
    }
};

export const updateActivityStatus = async (activityId, newStatus, rejectionNotes = null) => {
    try {
        const activityDocRef = doc(db, ACTIVITIES_COLLECTION, activityId);
        const updateData = { status: newStatus };
        if (rejectionNotes !== null) {
            updateData.rejectionNotes = rejectionNotes;
        }
        await updateDoc(activityDocRef, updateData);
    } catch (error) {
        console.error("Error updating activity status:", error);
        throw error;
    }
};

export const deleteActivityReport = async (activityId) => {
    try {
        const activityDocRef = doc(db, ACTIVITIES_COLLECTION, activityId);
        await deleteDoc(activityDocRef);
    } catch (error) {
        console.error("Error deleting activity report:", error);
        throw error;
    }
};

// --- Target Functions ---
export const setMonthlyTarget = async (userId, monthYear, targetData) => {
    try {
        const targetDocRef = doc(db, TARGETS_COLLECTION, `${userId}-${monthYear}`);
        await setDoc(targetDocRef, { ...targetData, userId, monthYear }, { merge: true });
    } catch (error) {
        console.error("Error setting monthly target:", error);
        throw error;
    }
};

// --- Real-time Listeners (wrapped by hooks) ---
// Note: onSnapshot will be primarily handled within custom hooks for state management.
// These functions might be helper for queries or simple direct fetches if needed.

export const getCollectionQuery = (collectionPath, constraints = [], order = null) => {
    let q = collection(db, collectionPath);
    constraints.forEach(c => {
        if (c.field && c.operator && c.value !== undefined) {
            q = query(q, where(c.field, c.operator, c.value));
        }
    });
    if (order && order.field) {
        q = query(q, orderBy(order.field, order.direction || 'asc'));
    }
    return q;
};

// Contoh penggunaan:
// const q = getCollectionQuery(DEMPLOT_COLLECTION, [{ field: 'creatorId', operator: '==', value: userId }], { field: 'timestamp', direction: 'desc' });
// onSnapshot(q, (snapshot) => { ... });

export const getSingleDocument = async (collectionPath, docId) => {
    try {
        const docRef = doc(db, collectionPath, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error(`Error getting document from ${collectionPath}/${docId}:`, error);
        throw error;
    }
};