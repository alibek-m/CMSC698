"use server";

import mysql, { ConnectionOptions, RowDataPacket } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";   // zod was suggested by AI

export interface user extends RowDataPacket {
  iduser: string;
  name: string;
  email: string | null;
  password: string; 
}

const Username = z.string().regex(/^[a-z0-9_]{3,32}$/i);
const Password = z.string().min(6);
const Email = z.string().email().optional();

const access: ConnectionOptions = {
  host: "localhost",
  port: 3306,
  database: "bookshelf",
  user: "root",
  password: process.env.PASSWORD,
};
const conn = await mysql.createConnection(access);


export async function signupUser(username: string, password: string, email?: string) {
  const name = Username.parse(username);
  const pass = Password.parse(password);
  const emailParsed = Email.parse(email ?? undefined) ?? null;

  // duplicates
  const [dupes] = await conn.query<user[]>(
    `SELECT iduser FROM user WHERE LOWER(name)=LOWER(?) OR ( ? IS NOT NULL AND email=? ) LIMIT 1`,
    [name, emailParsed, emailParsed]
  );
  if (dupes.length) throw new Error("Username or email already in use");

  const id = uuidv4();
  await conn.query(
    `INSERT INTO user (iduser, name, email, password) VALUES (?, ?, ?, ?)`,
    [id, name, emailParsed, pass]
  );


  return { iduser: id, name, email: emailParsed };
}

// login
export async function validateLogin(username: string, password: string) {
  const nameRaw = String(username ?? "");
  const passRaw = String(password ?? "");

  const name = nameRaw.trim();
  const pass = passRaw.trim();

// fetch
  const [rows] = await conn.query<user[]>(
    `SELECT iduser, name, email, password
       FROM \`bookshelf\`.\`user\`
      WHERE name = ? OR LOWER(name) = LOWER(?)
      LIMIT 1`,
    [name, name]
  );

  if (!rows.length) return null;

  const u = rows[0];

  const stored = (u.password ?? "").toString().trim();
  if (stored !== pass) return null;

  return { iduser: u.iduser, name: u.name, email: u.email ?? null } as const;
}


export async function getUserById(iduser: string) {
  const [rows] = await conn.query<user[]>(
    `SELECT iduser, name, email FROM user WHERE iduser=? LIMIT 1`,
    [iduser]
  );
  return rows[0] ?? null;
}

// translations
export interface translation extends RowDataPacket {
  id: number;
  user_id: string;
  source_text: string;
  translated_text: string;
  source_lang: string | null;
  target_lang: string;
  created_at: Date;
}

export async function saveTranslation(
  userId: string,
  sourceText: string,
  translatedText: string,
  sourceLang: string | null,
  targetLang: string
) {
  const sql = `
    INSERT INTO translation (user_id, source_text, translated_text, source_lang, target_lang)
    VALUES (?, ?, ?, ?, ?)
  `;
  await conn.query(sql, [
    userId,
    sourceText,
    translatedText,
    sourceLang,
    targetLang.toUpperCase(),
  ]);
}

export async function getTranslationsForUser(userId: string) {
  const sql = `
    SELECT id, user_id, source_text, translated_text, source_lang, target_lang, created_at
    FROM translation
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 100
  `;
  const [rows] = await conn.query<translation[]>(sql, [userId]);
  return rows;
}
