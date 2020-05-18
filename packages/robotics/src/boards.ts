const boards = [
  {
    name: "zumjunior",
    label: "Zum Junior",
    image: {
      url: "https://bitbloq.bq.com/images/boards/1586799725817.zumjunior.png"
    },
    ports: [
      {
        connectorTypes: []
      }
    ]
  },
  {
    name: "zumcore2",
    label: "Zum Core 2.0",
    image: {
      url: "https://bitbloq.bq.com/images/boards/1586799725817.bqZUM20.png"
    },
    ports: [
      {
        name: "23",
        connectorTypes: ["digital"],
        position: {
          x: -48,
          y: -96
        },
        width: 10,
        height: 30,
        direction: "north"
      },
      {
        name: "22",
        connectorTypes: ["digital"],
        position: {
          x: -36,
          y: -96
        },
        width: 10,
        height: 30,
        direction: "north"
      },
      {
        name: "13",
        connectorTypes: ["digital"],
        position: {
          x: -24,
          y: -96
        },
        width: 10,
        height: 30,
        direction: "north"
      }
    ]
  }
];

export default boards;
