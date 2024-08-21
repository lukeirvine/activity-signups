import * as functions from "firebase-functions";
import {FunctionsErrorCode} from "firebase-functions/v1/https";

export const throwError = (code: FunctionsErrorCode, message: string) => {
  throw new functions.https.HttpsError(code, message);
};
