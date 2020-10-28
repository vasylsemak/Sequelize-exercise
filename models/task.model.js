'use strict';

const db = require('./database');
const Sequelize= require('sequelize');

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
Task.clearCompleted = function() {
  return this.destroy({ where: { complete: true }});
}

Task.completeAll = function() {
  return this.update(
    { complete: true },
    {
      where: { complete: false },
      returning: true
    });
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

Task.prototype.addChild = function(childObj) {
  const newChild = {
    name: childObj.name,
    parentId: this.id,
  }
  return Task.create(newChild);
}

Task.prototype.getChildren = function() {
  return Task.findAll({ where: { parentId : this.id } });
}

Task.prototype.getSiblings  = function() {
  return Task.findAll({
    where: {
      parentId: this.parentId,
      id: {
        [ Sequelize.Op.ne ]: this.id
      }
    }
  })
}


Task.belongsTo(Task, {as: 'parent'});


//---------^^^---------  your code above  ---------^^^----------

module.exports = Task;

