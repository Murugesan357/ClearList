require('dotenv').config();

CONFIG = {};

CONFIG.app = process.env.APP;
CONFIG.environment = process.env.APP
CONFIG.db_host = process.env.DB_HOST;
CONFIG.db_user = process.env.DB_USER;
CONFIG.db_password = process.env.DB_PASSWORD;
CONFIG.db_name = process.env.DB_NAME;
CONFIG.db_port = process.env.DB_PORT;
CONFIG.db_dialect = process.env.DIALECT;

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || "APP2024";
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || "10000";

CONFIG.secret_key = process.env.SECRET_KEY || "mysecretkey";
