const pool = require('../database/pool')

const getMembership = (req, res) => {
  if (!req.user) {
    return res.redirect('/sign-in')
  }

  res.render('index', {
    title: 'Membership',
    content: 'pages/membership',
    user: req.user,
  })
}

const postMembership = async (req, res, next) => {
  const passcode = req.body.passcode

  if (passcode === process.env.MEMBERSHIP_PASSCODE) {
    try {
      await pool.query('UPDATE users SET membership_status = true WHERE username = $1', [req.user.username])
      res.redirect('/')
    } catch (error) {
      console.error(error)
      return next(error)
    }
  }

  if (passcode === process.env.ADMIN_PASSCODE) {
    try {
      await pool.query('UPDATE users SET is_admin = true WHERE username = $1', [req.user.username])
      res.redirect('/')
    } catch (error) {
      console.error(error)
      return next(error)
    }
  }
}

module.exports = {
  getMembership,
  postMembership,
}
