const router = require('express').Router({ mergeParams: true });
require('../../global_functions');

const passport = require('passport');
const validator = require('../../middleware/validate-schema');

const TaskService = require('../../services/todo/todo.service');
const { taskValidator } = require('../../validator/todo');

const createTask = async (req,res) =>{
  const [createErr, createTask] = await to(TaskService.createTask(req.body));
  if(createErr) return ReE(res, createErr.message, 422);
  if(createTask) return ReS(res, createTask, 200);
}

const updateTask = async (req,res) =>{
  const [updateErr, updateTask] = await to(TaskService.updateTask(req.params?.id, req.body));
  if(updateErr) return ReE(res, updateErr.message, 422);
  if(updateTask) return ReS(res, updateTask, 200);
}

const getOneUserTask = async (req,res) =>{
  const [taskErr, taskDetails] = await to(TaskService.getOneUserTask(req?.query?.userId));
  if(taskErr) return ReE(res, taskErr.message, 422);
  if(taskDetails) return ReS(res, taskDetails, 200);
}

const deleteTask = async (req,res) =>{
  const [deleteErr, deleteTask] = await to(TaskService.deleteTask(req?.params?.id));
  if(deleteErr) return ReE(res, deleteErr.message, 422);
  if(deleteTask) return ReS(res, deleteTask, 200);
}


// Post routes
router.get('/user', passport.authenticate("jwt",{session: false}), taskValidator.getOneUserTask, validator.validate, getOneUserTask);     
router.put('/:id', passport.authenticate("jwt",{session: false}), taskValidator.createOrUpdateTask, validator.validate, updateTask);           
router.delete('/:id',passport.authenticate("jwt",{session: false}), taskValidator.deleteTask, validator.validate, deleteTask);        
router.post('', passport.authenticate('jwt',{session: false}), taskValidator.createOrUpdateTask, validator.validate, createTask);              
    
module.exports = {router, createTask, updateTask, getOneUserTask, deleteTask }