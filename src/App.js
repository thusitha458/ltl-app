import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import ListExample from './ListExample';
import MenuAppBar from './MenuAppBar';
import TableExample from "./TableExample";
import Login from './Login';

class App extends Component {
  state = {
    clicked: false,
  };

  handleOnClick = () => {
    this.setState({
      clicked: true,
    });
  };

  render() {
    return (
      <div className="App">
        <MenuAppBar />
        <div className="content">
          {this.state.clicked ? <TableExample /> : <ListExample onClickItem={this.handleOnClick} />}
          <Login />
        </div>
      </div>
    );
  }
}

// function App() {

//   return (
//     <div className="App">
//       <MenuAppBar />
//       <ListExample />
//     </div>
//   );
// }

export default App;
