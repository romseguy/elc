import Link from "next/link";
import styles from "./footer.module.css";
import { version } from "../package.json";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <em>{version}</em>
        </li>
      </ul>
    </footer>
  );
}
