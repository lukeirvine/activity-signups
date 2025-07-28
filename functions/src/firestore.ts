import {logger} from "firebase-functions";
import {
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
// import * as firebaseTools from "firebase-tools";
// import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {Week} from "./firebase-types";
import {deleteCollectionRecursive} from "./utils";

const db = firestore();

export const deleteWeeksChildren = onDocumentDeleted(
  "weeks/{weekId}",
  async (event) => {
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
  }
);

export const cleanOnActivityDelete = onDocumentDeleted(
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

export const cleanOnActivitySetDelete = onDocumentDeleted(
  "activity-sets/{activitySetId}",
  async (event) => {
    const document = event.data;

    if (!document?.exists) {
      logger.error("Document does not exist.");
      return;
    }

    const querySnapshot = await db.collection("activities")
      .where("activitySetId", "==", document.id).get();
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    return;
  }
);

export const cleanOnDepartmentDelete = onDocumentDeleted(
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

export const cleanOnDocDelete = onDocumentDeleted(
  "*/**/{docId}",
  async (event) => {
    const document = event.data;

    if (!document?.exists) {
      logger.error("Document does not exist.");
      return;
    }

    const ref = document.ref;
    const subcols = await ref.listCollections();
    if (subcols.length > 0) {
      for (const subcol of subcols) {
        const childDocs = await subcol.listDocuments();
        for (const childDoc of childDocs) {
          await childDoc.delete();
        }
      }
    }
  }
)

export const changeDayDatesOnWeekChange = onDocumentUpdated(
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
