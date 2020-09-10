import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import styles from "./header.module.css";
import { Button } from "evergreen-ui";
import md5 from "blueimp-md5";

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const [session, loading] = useSession();

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>

      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                Veuillez vous identifier pour accéder à toutes les
                fonctionnalités
              </span>
              <Link href={`/api/auth/signin`}>
                <Button
                  className={styles.buttonPrimary}
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Connexion
                </Button>
              </Link>
            </>
          )}
          {session && (
            <>
              <span
                style={{
                  backgroundImage: `url(${
                    session.user.image
                      ? session.user.image
                      : `https://www.gravatar.com/avatar/${md5(
                          session.user.email
                        )}?d=identicon`
                  })`,
                }}
                className={styles.avatar}
              />
              <span className={styles.signedInText}>
                <small>Bienvenue,</small>
                <br />
                <strong>{session.user.email || session.user.name}</strong>
              </span>
              <Link href={`/api/auth/signout`}>
                <Button
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Déconnexion
                </Button>
              </Link>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Public</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/protected">
              <a>Protected</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
