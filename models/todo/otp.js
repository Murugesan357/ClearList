module.exports = (db, Sequelize) => {
  let Otps = db.define('otp', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  hashedOtp: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  isUsed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'otp',
  schema: "todo",
})
return Otps; 
};
