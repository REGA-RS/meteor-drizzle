import { createClass } from 'asteroid';
import { setLoggedUser, unsetLoggedUser } from '../layouts/login/LoginActions';
import { addTodo, removeTodo, editTodo } from '../layouts/todos/TodoActions';
import store from '../store';

const Asteroid = createClass();
// Connect to a Meteor backend
const asteroid = new Asteroid({
  endpoint: 'ws://localhost:9000/websocket',
});

// if you want realitme updates in all connected clients
// subscribe to the publication

asteroid.subscribe('user');

function _select(state) {
  return state.contracts.SimpleStorage.storedData['0x0'] !== undefined ? state.contracts.SimpleStorage.storedData['0x0'].value : undefined;
}

let currentValue = 0;
let subscription = asteroid.subscribe('tasks', currentValue);

function _refresh() {
  let previousValue = currentValue
  
  currentValue = _select(store.getState())
  if (previousValue !== currentValue) {
    asteroid.unsubscribe(subscription.id);
    subscription = asteroid.subscribe('tasks', currentValue);
    console.log(
      'Some deep nested property changed from',
      previousValue,
      'to',
      currentValue
    )
  }
}

store.subscribe(_refresh);

asteroid.ddp.on('added', (doc) => {
  // we need proper document object format here
  if (doc.collection === 'tasks') {
    const docObj = Object.assign({}, doc.fields, { _id: doc.id });
    store.dispatch(addTodo(docObj));
  }
  if (doc.collection === 'users') {
    store.dispatch(setLoggedUser(doc.fields));
  }
});

asteroid.ddp.on('removed', (removedDoc) => {
  if (removedDoc.collection === 'tasks') {
    store.dispatch(removeTodo(removedDoc.id));
  }
  if (removedDoc.collection === 'users') {
    store.dispatch(unsetLoggedUser());
  }
});

asteroid.ddp.on('changed', (updatedDoc) => {
  if (updatedDoc.collection === 'tasks') {
    store.dispatch(editTodo(updatedDoc.id, updatedDoc.fields.finished));
  }
});

export default asteroid;