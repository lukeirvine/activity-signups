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
import {logger} from "firebase-functions";
import {onDocumentDeleted} from "firebase-functions/v2/firestore";
import * as firebaseTools from "firebase-tools";
import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.deleteChildren = onDocumentDeleted("weeks/{weekId}", async (event) => {
  const document = event.data;
  const weekId = event.params.weekId;

  if (!document?.exists) {
    logger.error("Document does not exist.");
    return;
  }

  console.log("Document deleted", document.id);
  const path = `weeks/${weekId}/days`;

  await firebaseTools.firestore
    .delete(path, {
      project: process.env.GCLOUD_PROJECT || "",
      recursive: true,
      force: true,
      token: functions.config().fb.token,
    });
});
