const initialBoard = {
  "boardClass": "zumjunior"
};

const initialComponents = [
  {
    "name": "button1",
    "componentClass": "Button",
    "port": 1
  },
  {
    "name": "button2",
    "componentClass": "Button",
    "port": 2
  },
  {
    "name": "led1",
    "componentClass": "Led",
    "port": 3
  },
  {
    "name": "led2",
    "componentClass": "Led",
    "port": 4
  }
];

const initialState = {
  board: initialBoard,
  components: initialComponents
};

const hardware = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default hardware;
