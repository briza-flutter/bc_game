import { randomUUID } from "crypto";
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomPayCode(): string {
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export function generatedUUID() {
  return randomUUID();
}
