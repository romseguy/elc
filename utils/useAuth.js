import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/client";

export const AccountTypes = {
  PARENT: "PARENT",
  ADMIN: "ADMIN",
  USER: "USER"
};

const session = { user: {}, type: AccountTypes.ADMIN };
//const session = { user: {}, type: AccountTypes.PARENT };

export async function getSession(options) {
  if (process.env.NEXT_PUBLIC_IS_TEST) {
    return session;
  }

  return getNextAuthSession(options);
}

export function useSession() {
  if (process.env.NEXT_PUBLIC_IS_TEST) {
    return [session, false];
  }

  return useNextAuthSession();
}
