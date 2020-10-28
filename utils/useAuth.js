import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/client";

const session = { user: {} };

export async function getSession(options) {
  if (process.env.NEXT_PUBLIC_IS_TEST) {
    return session;
  }

  return getNextAuthSession(options);
}

export function useSession() {
  if (process.env.NEXT_PUBLIC_IS_TEST) {
    return [session];
  }

  return useNextAuthSession();
}

export const AccountTypes = {
  PARENT: "PARENT",
  ADMIN: "ADMIN"
};
