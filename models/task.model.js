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


// Class methods
Task.clearCompleted = async function() {
  await this.destroy({ where: { complete: true }});
}

Task.completeAll = async function() {
  const updated = await this.update(
    { complete: true },
    {
      where: { complete: false },
      returning: true
    });
  return updated;
}


// Instance methods
Task.prototype.getTimeRemaining = function() {
  if (!this.due) return Infinity;
  else return this.due - new Date();
}

Task.prototype.isOverdue = function() {
  if(this.complete) return false;
  return this.due - new Date() < 0 ? true : false;
}


Task.belongsTo(Task, {as: 'parent'});


//---------^^^---------  your code above  ---------^^^----------

module.exports = Task;

