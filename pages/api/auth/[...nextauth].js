import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { AccountTypes } from "utils/useAuth";
import api from "utils/api";

// https://next-auth.js.org/configuration/options
let options = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async ({ username, password }) => {
        const user =
          username === "parent" && password === "parent"
            ? {
                id: 2,
                name: "parent",
                email: "p@e.com"
              }
            : username === "romseguy" && password === "wxcv"
            ? {
                id: 1,
                name: "Romain Séguy",
                email: "rom.seguy@lilo.org"
              }
            : null;

        // Any user object returned here will be saved in the JSON Web Token
        return Promise.resolve(user);
      }
    })
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/database
  //
  // Notes:
  // * You must to install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a seperate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in pages.
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/api/auth/signin',  // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // signIn: async (user, account, profile) => {
    //   return Promise.resolve(true);
    // }
    // redirect: async (url, baseUrl) => { return Promise.resolve(baseUrl) },
    session: async (session, user) => {
      if (user.email === "rom.seguy@lilo.org") {
        return Promise.resolve({ ...session, type: AccountTypes.ADMIN });
      }

      const { error, data: parents } = await api.get("parents");

      if (error) {
        return Promise.reject(error);
      }

      for (const parent of parents) {
        if (user.email === parent.email) {
          return Promise.resolve({
            ...session,
            user: {
              ...user,
              _id: parent._id
            },
            type: AccountTypes.PARENT
          });
        }
      }

      return Promise.resolve({ ...session, user, type: AccountTypes.USER });
    }
    // jwt: async (token, user, account, profile, isNewUser) => { return Promise.resolve(token) }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: true
};

if (process.env.NEXT_PUBLIC_IS_TEST) {
  options = {
    providers: [
      Providers.Credentials({
        name: "test-auth",
        credentials: {
          username: { label: "Username", type: "text" }
        },

        async authorize() {
          return Promise.resolve({
            id: 1,
            name: "todo",
            email: `todo@email.com`
          });
        }
      })
    ],
    session: { jwt: true },
    jwt: { secret: process.env.SECRET },
    callbacks: {
      async signIn(user, account, profile) {
        console.log(user, account, profile);
      }
    },
    debug: true
  };
}

export default (req, res) => NextAuth(req, res, options);
