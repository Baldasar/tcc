import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

export class DatabaseService {
  private static instance: DatabaseService;
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private nameDb: string;

  private constructor(nameDb: string) {
    this.nameDb = nameDb;
  }

  public static getInstance(nameDb: string = "mydb.db"): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(nameDb);
    }
    return DatabaseService.instance;
  }

  private async connDatabase(): Promise<SQLiteDBConnection> {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(this.nameDb, false)).result;

    if (ret.result && isConn) {
      const db = await this.sqlite.retrieveConnection(this.nameDb, false);
      await db.open();
      return db;
    } else {
      const db = await this.sqlite.createConnection(
        this.nameDb,
        false,
        "no-encryption",
        1,
        false
      );
      await db.open();
      return db;
    }
  }

  public async createDefaultTables(): Promise<void> {
    const db = await this.connDatabase();
    await db.open();
  
    const defaultTableStatements = [
      `
      CREATE TABLE IF NOT EXISTS user_intro (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        viewed INTEGER NOT NULL DEFAULT 0
      );
      `
    ];
  
    for (const statement of defaultTableStatements) {
      await db.execute(statement);
    }
  }

  public async query(sql: string) {
    const db = await this.connDatabase();
    return await db.query(sql);
  }

  public async execute(sql: string) {
    const db = await this.connDatabase();
    return await db.execute(sql);
  }
}

export const db = DatabaseService.getInstance();
