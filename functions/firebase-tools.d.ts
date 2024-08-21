// firebase-tools.d.ts
declare module "firebase-tools" {
  export const firestore: {
    delete: (path: string, options: {
      project: string,
      recursive?: boolean,
      force?: boolean,
      token?: string
    }) => Promise<void>;
  };
}
