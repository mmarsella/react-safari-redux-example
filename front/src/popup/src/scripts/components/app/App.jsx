import React, {Component} from 'react';
import {connect} from 'react-redux';


class App extends Component {
  // constructor(props) {
  //   // super(props);
  // }

  // componentDidMount() {
  //   // document.addEventListener('click', () => {
  //   //   this.props.dispatch({
  //   //     type: 'ADD_COUNT'
  //   //   });
  //   // });
  // }

  render() {
    return (
      <div>
        Current Tab: 
      </div>
    );
  }
}


// {this.props.currentTab}
// const mapStateToProps = (state) => {
//   return {
//     currentTab: state.currentTab
//   };
// };

// export default connect(mapStateToProps)(App);
export default App