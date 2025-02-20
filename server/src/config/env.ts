import 'dotenv/config';
const ENV = {
  DB_URI: process.env.DB_URI as string,
  PORT: process.env.PORT as string,
};

export { ENV };
