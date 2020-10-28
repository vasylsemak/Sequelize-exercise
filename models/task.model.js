'use strict';

const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  due: Sequelize.DATE
});

Task.clearCompleted = async function() {
  await Task.destroy({ where: { complete: true }});
}

Task.completeAll = async function() {
  const updated = await Task.update(
    { complete: true },
    {
      where: { complete: false },
      returning: true
    });
    return updated;
}


Task.belongsTo(Task, {as: 'parent'});


//---------^^^---------  your code above  ---------^^^----------

module.exports = Task;

