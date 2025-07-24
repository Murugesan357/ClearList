const Sequelize = require('sequelize');
const Op = Sequelize.Op;

require('../../config/config');
require('../../global_functions');

const todos = require('../../models').todos;
const Users = require('../../models').users;

const createTask = async (data) =>{
  const [createErr, createposts] = await to(todos.create(data));
  if(createErr) return TE(createErr.message);
  return createposts; 
}
module.exports.createTask = createTask

const updateTask = async (id, data) => {
  const [updateErr, updateTask] = await to(todos.update(data, {
    where:{
      id: id,
      isDeleted: false
    },
    returning: true
  }));
  if(updateErr) return TE(updateErr.message);
  return updateTask[1]?.[0]; 
}
module.exports.updateTask = updateTask

const getOneUserTask = async (userId) => {
  const [taskErr, tasks] = await to(todos.findAll({
    where:{
      userId: userId, 
      isDeleted: false 
    }
  }));
  if(taskErr) return TE(taskErr.message);
  return tasks; 
}
module.exports.getOneUserTask = getOneUserTask


const deleteTask = async (postId) => {
  const [deleteErr, deleteTask] = await to(todos.update({isDeleted: true}, {
    where:{
      id: postId,
      isDeleted: false
    }
  }))
  if(deleteErr) return TE(deleteErr.message);
  if(deleteTask) return deleteTask;
}
module.exports.deleteTask = deleteTask


