import api from "utils/api";

export const levels = ["CP", "CE1", "CE2", "CM1", "CM2"];

export const ui2api = ({ domain, level, ...rest }) => ({
  domain: domain === "" ? null : domain,
  level: level === "" ? null : level,
  ...rest
});

export const mapDomains = ({ ...rest }) => ({ ...rest });
export const mapSkills = ({ ...rest }) => ({ ...rest });
