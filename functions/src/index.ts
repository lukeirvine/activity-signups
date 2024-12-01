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
import {onCall} from "firebase-functions/v2/https";

import {
  changeDayDatesOnWeekChange,
  cleanOnActivityDelete,
  cleanOnDepartmentDelete,
  deleteWeeksChildren,
} from "./firestore";
import {getAllDocs, updateDoc, verifyPermissions} from "./utils";
import {Activity} from "./firebase-types";

// firestore.ts
exports.deleteWeeksChildren = deleteWeeksChildren;
exports.cleanOnActivityDelete = cleanOnActivityDelete;
exports.cleanOnDepartmentDelete = cleanOnDepartmentDelete;
exports.changeDayDatesOnWeekChange = changeDayDatesOnWeekChange;

exports.databaseTransform = onCall(async (request) => {
  verifyPermissions(request);
  console.log("database-transform function called with data");
  // Get all docs from activities collection and add a activitySetId value to them
  // id: d4e9fc43-f3c4-42a0-be1d-be6c255c59fe
  try {
    const activities = await getAllDocs<Activity>("activities");
    for (const activity of Object.values(activities)) {
      if (activity.id) {
        await updateDoc<Activity>({
          collectionId: "activities",
          docId: activity.id,
          data: {activitySetId: "d4e9fc43-f3c4-42a0-be1d-be6c255c59fe"},
        });
      }
    }
  } catch (error) {
    console.error("Error updating activities: ", error);
    return {message: "An error occurred"};
  }
  return {message: "Transformation complete"};
});
