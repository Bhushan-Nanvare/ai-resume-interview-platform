export function decodeToken(token: string): { userId: string; role: "CANDIDATE" | "RECRUITER" } {
  return JSON.parse(atob(token.split(".")[1]));
}