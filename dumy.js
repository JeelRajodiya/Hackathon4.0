const bcrypt = require('bcrypt');
const password = 'Password1'
const hash = await bcrypt.hash(password, 13)
const isMatch = await bcrypt. compare ("Pass", hash)
console.log(isMatch)
