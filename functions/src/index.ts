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
import {verifyPermissions} from "./utils";

// firestore.ts
exports.deleteWeeksChildren = deleteWeeksChildren;
exports.cleanOnActivityDelete = cleanOnActivityDelete;
exports.cleanOnDepartmentDelete = cleanOnDepartmentDelete;
exports.changeDayDatesOnWeekChange = changeDayDatesOnWeekChange;

exports.databaseTransform = onCall((request) => {
  verifyPermissions(request);
  console.log("database-transform function called with data");
  return {message: "Transformation complete"};
});
