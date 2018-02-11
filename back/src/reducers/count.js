const initialState = 0;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_COUNT':
    	console.log('ADDING')
      return state + (action.payload || 1);
    default:
      return state;
  }
};
