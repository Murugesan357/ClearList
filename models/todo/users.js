const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise')
module.exports = (db, Sequelize) => {
  let Users = db.define("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        required: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        required: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        required: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bio: Sequelize.STRING(200),
      phone: Sequelize.STRING(20),
      countryCode: Sequelize.INTEGER,
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      modifiedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    },
    {
      tableName: "users",
      underscored: true,
      schema: "todo",
    }
  );
  Users.association = (models) => {
    Users.hasMany(models.todos, { foreignKey: 'userId' });
  };

  Users.beforeSave(async (user, options) => {
    let err;
    // Hash the password if it has been changed or is new
    if (user.changed('password')) {
      // if (user.changed('password') && (!user.importId) && (user.password)) {
      let salt, hash;
      //Asynchronously generates a salt.
      // Randomly select rounds(b/w 4-10) for generating hash
      let rounds = Math.floor(Math.random() * 6 + 4);
      [err, salt] = await to(bcrypt.genSalt(rounds));
      if (err) {
        console.log(err.message);
      }
      //Asynchronously generates a hash with salt
      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) {
        console.log(err.message);
      }
      user.password = hash;
    }
  });

  Users.prototype.storefrontcomparePassword = async function (pw,pwd) {
    let err, pass;
    if (!pwd) TE('PWD_NOT_SET');
    //Password verification
    [err, pass] = await to(bcrypt_p.compare(pw,pwd));
    if (err) TE(err.message);
    if (!pass) TE('INVALID_PASSWORD');
    return pass;
  };
  return Users;
};
