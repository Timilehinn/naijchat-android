const moment = require('moment');
const { v4 } = require('uuid')


function formatMessage(username,img, text, msg_w_img, verified) {
  return {
    id:v4(),
    username,
    img,
    text,
    msg_w_img,
    verified,
    time: moment().format('h:mm a')
  };
}


// function formatMessage(username,img, text,text_img) {
//   return {
//     username,
//     img,
//     text,
//     text_img,
//     time: moment().format('h:mm a')
//   };
// }

function formatMessageBot(username,icon, text) {
  return {
    username,
    icon,
    text,
    time: moment().format('h:mm a')
  };
}
module.exports = {formatMessage,formatMessageBot};
