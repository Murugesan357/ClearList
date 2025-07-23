const {param, query, body, checkExact} = require('express-validator')

const taskValidator = {
    createOrUpdateTask: [
        body('title').optional({checkFalsy: true}).isString().withMessage('task title must be string'),
        body('description').optional({checkFalsy: true}).isString().withMessage('task description must be string'),
        body('priority').optional({checkFalsy: true}).isString().withMessage('task priority must be string'),
        body('isCompleted').optional({checkFalsy: true}).isBoolean().withMessage('isCompleted must be boolean'),
        body('userId').optional({checkFalsy: true}).exists().withMessage('userId is required').bail().isNumeric().withMessage('userId should be a number'),
        body('dueDate').optional({checkFalsy: true}).isDate(),
        checkExact([],{message: "Invalid data! extra parameters not allowed"})
    ],

    getOneUserTask: [
        query('userId').isNumeric().withMessage('userId should be number'),
        checkExact([],{message: "Invalid data! extra parameters not allowed"})
    ],

    deleteTask: [
        param('id').exists().withMessage("task id is required").bail().isNumeric().withMessage('task id must be a number'),
        checkExact([],{message: "Invalid data! extra parameters not allowed"})
    ]
}

module.exports.taskValidator = taskValidator