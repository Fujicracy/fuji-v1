const { EventPoint } = require("../../db");

const isUnique = async (event) => {
  const points = await EventPoint.find(event).exec();
  return points.length === 0;
};

const addMany = async (events) => {
  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    if (await isUnique(event)) {
      await EventPoint.create(event);
      console.log("unique");
    } else {
      console.log("notunique");
    }
  }
};

module.exports = { addMany };