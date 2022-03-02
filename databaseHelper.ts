import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from 'typeorm';
const { DB_SECRET_ARN, DB_RESOURCE_ARN, DB_NAME } = process.env;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_SECRET_ARN: string;
      DB_RESOURCE_ARN: string;
      DB_NAME: string;
    }
  }
}

/**
 * Database manager class
 */
export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`;

    let connection: Connection;

    // Check if we already have an open connection. Pretty common with Lambda.
    // We don't want to open a new connection on every invocation.
    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.info(`Database.getConnection()-using existing connection ...`);
      connection = await this.connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      console.info(`Database.getConnection()-creating connection ...`);

      const connectionOptions: ConnectionOptions = {
        name: `default`,
        type: `aurora-data-api`,
        database: DB_NAME,
        secretArn: DB_SECRET_ARN,
        resourceArn: DB_RESOURCE_ARN,
        synchronize: true,
        logging: true,
        region: 'us-west-2',
        entities: [__dirname + '../entities/*.*'],
      };

      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}
