import { db } from "../repositories/db";

export async function makeDatabase() {
  try {
    await db.createDefaultTables();
  } catch (error) {
    console.error("Error making database: ", error);
  }
}

export async function getDisplayIntro() {
  try {
    const sql = `SELECT viewed FROM user_intro WHERE id = 1`;
    const result = await db.query(sql);

    if (result.values && result.values.length > 0) {
      return result.values[0].viewed === 1;
    }

    return false;
  } catch (error) {
    console.error("Erro ao buscar status da introdução:", error);
    return false;
  }
}

export async function setIntroStatus() {
  try {
    const sql = `INSERT OR REPLACE INTO user_intro (id, viewed) VALUES (1, 1)`;
    await db.execute(sql);
  } catch (error) {
    console.error("Erro ao atualizar status da introdução:", error);
  }
}
