const formatGrafana = (arr, targets) => {
  const response = [
    { target: "ETHDAI-DEBT", datapoints: [] },
    { target: "ETHDAI-COLL", datapoints: [] },
    { target: "ETHUSDC-DEBT", datapoints: [] },
    { target: "ETHUSDC-COLL", datapoints: [] },
  ];

  arr.forEach((e) => {
    const type = `${e.vault}-${e.type}`;
    const arr = [e.value, e.timestamp * 1000];
    if (type === "ETHDAI-DEBT") {
      response[0].datapoints.push(arr);
    }
    if (type === "ETHDAI-COLL") {
      response[1].datapoints.push(arr);
    }
    if (type === "ETHUSDC-DEBT") {
      response[2].datapoints.push(arr);
    }
    if (type === "ETHUSDC-COLL") {
      response[3].datapoints.push(arr);
    }
  });

  return response;
};

module.exports = { formatGrafana };
