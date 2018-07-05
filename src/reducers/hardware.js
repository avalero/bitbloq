const initialBoard = {
  boardClass: 'zumjunior',
};

const initialComponents = [
  {
    name: 'button1',
    className: 'Button',
    port: 1,
  },
  {
    name: 'button2',
    className: 'Button',
    port: 2,
  },
  {
    name: 'led1',
    className: 'Led',
    port: 3,
  },
  {
    name: 'led2',
    className: 'Led',
    port: 4,
  },
];

const initialState = {
  board: initialBoard,
  components: initialComponents,
};

const hardware = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default hardware;
