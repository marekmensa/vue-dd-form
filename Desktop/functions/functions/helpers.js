const axios = require('axios').default;

const sendEmail = async (type, email, data) => {
    return axios.post('https://api.attendu.cz/api/ucime-se', {
        type,
        email,
        data,
      });
}

exports.sendEmail = sendEmail;