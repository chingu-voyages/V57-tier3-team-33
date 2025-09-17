import db from '../config/firebase.js';

const exampleCollection = db.collection('example');

export const getExamples = async () => {
    const snapshot = await exampleCollection.get();

    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}