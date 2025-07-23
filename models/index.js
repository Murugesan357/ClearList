var fs = require('fs');
var path = require('path');
const Sequelize = require('sequelize');
var basename = path.basename(__filename);
require('./../config/constants');

const db = {};

let sequelize =new Sequelize(
    CONFIG.db_name,
    CONFIG.db_user,
    CONFIG.db_password,
    {
      host:CONFIG.db_host,
      dialect:CONFIG.db_dialect,
      port:CONFIG.db_port,
      logging:false,
      define:{
          timestamps:false,
          underscored:true,
      },
      dialectOptions:{
        useUTC:true,
      },
    }
  );
  const schemaCreate = async function () {
    var schemas = await sequelize.showAllSchemas().then(
      (s) => {
        CONSTANT.SCHEMAS.forEach((item) => {
          if (s.indexOf(item) < 0) {
            sequelize.createSchema(item).then((res) => { });
          }
        });
      },
      (err) => {
        console.log("in err", err);
      }
    );
    return schemas;
  };
  
  CONSTANT.SCHEMAS.forEach((item) => {
    fs.readdirSync(__dirname + "/" + item)
      .filter((file) => {
        return (
          file.indexOf(".") !== 0 &&
          file !== basename &&
          file.slice(-3) === ".js"
        );
      })
      .forEach((file) => {
        var model = require(path.join(__dirname + "/" + item, file))(
          sequelize,
          Sequelize.DataTypes
        );
        db[file.slice(0, -3)] = model;
      });
  });
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].association) {
      db[modelName].association(db);
    }
  });
  db.schemaCreate = schemaCreate();
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  
  module.exports = db;