import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Web3 from 'web3';
import contract from 'truffle-contract';
import BN from 'bn.js';

import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

import SimpleStorage from '../ethereum/SimpleStorage'
 
// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
          hideCompleted: false,
          
        };
    }

    handleSubmit(event) {
        event.preventDefault();
     
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
     
        Meteor.call('tasks.insert', text, this.props.currentData.toString(10));
     
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
          hideCompleted: !this.state.hideCompleted,
        });
    }
  
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const showPrivateButton = task.owner === currentUserId;
   
        return (
          <Task
            key={task._id}
            task={task}
            showPrivateButton={showPrivateButton}
          />
        );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
        <h1>Todo List ({this.props.incompleteCount}) ({this.props.currentData === undefined? 'loading' : this.props.currentData.toString(10)})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

           <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

const simpleStorage = new SimpleStorage();

export default withTracker(() => {
    const update = simpleStorage.getData();
    Meteor.subscribe('tasks', update !== undefined ? update.toString(10) : 'loading');
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
        currentData: simpleStorage.getData(),
    };
})(App);