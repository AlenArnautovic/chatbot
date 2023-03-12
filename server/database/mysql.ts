import mysql from 'mysql';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'chatbot';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'root';

const MYSQL = {
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
};

const config = {
  mysql: MYSQL,
};

const params = {
  user: config.mysql.user,
  password: config.mysql.password,
  host: config.mysql.host,
  database: config.mysql.database,
  multipleStatements: true,
};

const Connect = async () =>
  new Promise<mysql.Connection>((resolve, reject) => {
    const connectionn = mysql.createConnection(params);

    connectionn.connect((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connectionn);
    });
  });

const Query = async (connection: mysql.Connection, query: string) =>
  new Promise((resolve, reject) => {
    connection.query(query, connection, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });

export { Connect, Query };
