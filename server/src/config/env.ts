import 'dotenv/config';
const ENV = {
  DB_URI: process.env.DB_URI as string,
  PORT: process.env.PORT as string,
  EMAIL_ID: process.env.EMAIL_ID as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
};

export { ENV };
