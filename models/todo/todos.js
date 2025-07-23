module.exports = (db, Sequelize) => {
    let Todos = db.define("todos", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        title: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        priority:{
          type: Sequelize.STRING,
        },
        isCompleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }, 
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        dueDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        modifiedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
      },
      {
        tableName: "todos",
        underscored: true,
        schema: "todo",
      }
    );
    Todos.association = (models) => {
      Todos.belongsTo(models.users, { foreignKey: 'userId' });
    };
    return Todos;
  };