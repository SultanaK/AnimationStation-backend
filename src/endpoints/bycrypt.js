
const bcrypt = require('bcryptjs')

bcrypt.hash('Won-password', 10).then(hash => console.log({ hash }))

