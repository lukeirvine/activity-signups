/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import functions = require("firebase-functions");
import {initializeApp} from "firebase-admin/app";
initializeApp();
import {logger} from "firebase-functions";
import {
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
// import * as firebaseTools from "firebase-tools";
// import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {Week} from "./firebase-types";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const db = firestore();

exports.deleteChildren = onDocumentDeleted("weeks/{weekId}", async (event) => {
  const document = event.data;

  if (!document?.exists) {
    logger.error("Document does not exist.");
    return;
  }

  const collections = await document.ref.listCollections();

  for (const collection of collections) {
    await deleteCollectionRecursive(collection, 100);
  }
  return;
});

exports.cleanOnActivityDelete = onDocumentDeleted(
  "activities/{activityId}",
  async (event) => {
    const document = event.data;

    if (!document?.exists) {
      logger.error("Document does not exist.");
      return;
    }

    const querySnapshot = await db.collectionGroup("occurrences")
      .where("activityId", "==", document.id).get();
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    return;
  }
);

exports.cleanOnDepartmentDelete = onDocumentDeleted(
  "departments/{departmentId}",
  async (event) => {
    const document = event.data;

    if (!document?.exists) {
      logger.error("Document does not exist.");
      return;
    }

    const querySnapshot = await db.collection("activities")
      .where("department", "==", document.id).get();
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    return;
  }
);

exports.changeDayDatesOnWeekChange = onDocumentUpdated(
  "weeks/{weekId}",
  async (event) => {
    const weekId = event.params.weekId;
    const beforeDoc = event.data?.before?.data() as Week;
    const afterDoc = event.data?.after?.data() as Week;

    if (!beforeDoc || !afterDoc) {
      logger.error("Document does not exist.");
      return;
    }

    if (beforeDoc.startDate !== afterDoc.startDate) {
      const querySnapshot = await db.collection(`weeks/${weekId}/days`).get();
      querySnapshot.forEach(async (doc) => {
        const prevDate = doc.data().date;
        const prevDayOfWeek = new Date(prevDate).getDay();
        const newDate = new Date(afterDoc.startDate);
        newDate.setDate(newDate.getDate() + prevDayOfWeek);
        await doc.ref.update({date: newDate.toISOString()});
      });
    }

    return;
  }
);

function deleteCollectionRecursive(
  collectionRef: firestore.CollectionReference, batchSize: number
): Promise<void> {
  const query = collectionRef.limit(batchSize);

  return query.get().then(async (snapshot) => {
    if (snapshot.size === 0) {
      return;
    }

    const batch = db.batch();
    for (const doc of snapshot.docs) {
      const subCollections = await doc.ref.listCollections();
      for (const subCollection of subCollections) {
        await deleteCollectionRecursive(subCollection, batchSize);
      }
      batch.delete(doc.ref);
    }

    await batch.commit();

    if (snapshot.size >= batchSize) {
      // Recursively delete remaining documents
      return deleteCollectionRecursive(collectionRef, batchSize);
    }
  });
}
