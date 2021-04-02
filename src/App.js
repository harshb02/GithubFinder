import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import axios from 'axios';
import About from './components/pages/About';
import './App.css';

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN },
})

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  }

  // Search Github Users
    searchUsers = async (text) => {
    this.setState({ loading: true })
 
    const res = await axios.get(`https://api.github.com/search/users?q=${text}`)
 
    this.setState({ users: res.data.items, loading: false })
  }

  // Get single Github user
  getUser = async (username) => {
    this.setState({ loading: true })
 
    const res = await axios.get(`https://api.github.com/users/${username}`)
 
    this.setState({ user: res.data, loading: false })
  }

  // Get users repos
  getUserRepos = async (username) => {
    this.setState({ loading: true })
 
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`
    )
 
    this.setState({ repos: res.data.items, loading: false })
  }

  // Clear users from state
  clearUsers = () => this.setState({ users: [], loading:false});

  // Set Alert
  setAlert = (msg, type) => {
    this.setState({alert: { msg,type }})

    setTimeout( () => this.setState({ alert: null}), 5000)
  }

  render () {

    const {users, user, repos, loading} = this.state;
    return (
      <Router>
      <div className="App">
        <Navbar />
        <div className = "container">
          <Alert alert={this.state.alert} />
          <Switch>
            <Route exact path='/' render= {props => (
              <Fragment>
                <Search 
                   searchUsers={this.searchUsers} 
                    clearUsers={this.clearUsers}
                    showClear={this.state.users.length>0 ? true: false}
                    setAlert={this.setAlert}
                />
                <Users loading={loading} users={users}/>
              </Fragment>
            )} />

            <Route exact path='/about' component={About} />
            <Route exact path='/user/:login' render={props => (
              <User { ...props } 
              getUser={this.getUser} 
              getUserRepos={this.getUserRepos} 
              user={user} 
              repos={repos}
              loading={loading} />
            )} />
          </Switch>
       
        </div>
      </div>
      </Router>
    );
  }
}

export default App;
