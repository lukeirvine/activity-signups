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
  cleanOnActivitySetDelete,
  cleanOnDepartmentDelete,
  deleteWeeksChildren,
} from "./firestore";
import {throwError, verifyPermissions} from "./utils";

// firestore.ts
exports.deleteWeeksChildren = deleteWeeksChildren;
exports.cleanOnActivityDelete = cleanOnActivityDelete;
exports.cleanOnActivitySetDelete = cleanOnActivitySetDelete;
exports.cleanOnDepartmentDelete = cleanOnDepartmentDelete;
exports.changeDayDatesOnWeekChange = changeDayDatesOnWeekChange;

exports.databaseTransform = onCall(async (request) => {
  verifyPermissions(request);
  throwError("unimplemented", "Not yet implemented");
});
