import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import setListener from './SimpleStorage'
 
export const Tasks = new Mongo.Collection('tasks');

let collectionFilter

function setFilter(filter) {
  if(filter === undefined) return;
  console.log(`tasks: task filter: ${filter}`)
  collectionFilter = filter;
}

setListener(setFilter)

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user

    Meteor.publish('tasks', function tasksPublication(data) {
      return Tasks.find({
          $or: [
            { private: { $ne: true } },
            { data: collectionFilter },
          ],
        });
    });
}
 
Meteor.methods({
  'tasks.insert'(text, data) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      data: data
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
  'tasks.all'() {
    return Tasks.find({}, { sort: { createdAt: -1 } }).fetch();
  },
});