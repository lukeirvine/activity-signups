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
import {QueryDocumentSnapshot} from "firebase-admin/firestore";
import {logger} from "firebase-functions";
import {onDocumentDeleted} from "firebase-functions/v2/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.deleteChildren = onDocumentDeleted("weeks/{weekId}", async (event) => {
  // The document snapshot of the deleted document
  const document: QueryDocumentSnapshot | undefined = event.data;

  if (!document?.exists) {
    logger.error("Document does not exist.");
    return;
  }

  console.log("Document deleted", document.id);
  return;
});
