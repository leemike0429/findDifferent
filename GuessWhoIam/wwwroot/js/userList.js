import messages from './lang.js';
const translate = () => {
  return messages[`${localStorage.getItem('lang')}`]
}
const userList = [{
  id: 1,
  name: translate().waitingroom.mickey,
  imageName: "mickey",
  life: 3,
  totalLife: 3,
  score: 0,
  time: 40,
  totalTime: 40,
  timerPercentage: "",
  getPointAnimationAtive: false,
  isReady: false,
  cards: [{ id: 1, name: "阻擋卡", image: "../images/prop-block.png", isUsed: false }, {}],
}, {
  id: 2,
  name: translate().waitingroom.minnie,
  imageName: "minnie",
  life: 3,
  totalLife: 3,
  score: 0,
  time: 40,
  totalTime: 40,
  timerPercentage: "",
  getPointAnimationAtive: false,
  isReady: false,
  cards: [{ id: 1, name: "阻擋卡", image: "../images/prop-block.png", isUsed: false }, {}],
}, {
  id: 3,
  name: translate().waitingroom.goofy,
  imageName: "goofy",
  life: 3,
  totalLife: 3,
  score: 0,
  time: 40,
  totalTime: 40,
  timerPercentage: "",
  getPointAnimationAtive: false,
  isReady: false,
  cards: [{ id: 1, name: "阻擋卡", image: "../images/prop-block.png", isUsed: false }, {}],
}, {
  id: 4,
  name: translate().waitingroom.donaldduck,
  imageName: "donaldDuck",
  life: 3,
  totalLife: 3,
  score: 0,
  time: 40,
  totalTime: 40,
  timerPercentage: "",
  getPointAnimationAtive: false,
  isReady: false,
  cards: [{ id: 1, name: "阻擋卡", image: "../images/prop-block.png", isUsed: false }, {}],
}]

export default userList