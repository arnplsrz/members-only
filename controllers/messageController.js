const pool = require('../database/pool')

const getNewMessage = (req, res) => {
  if (!req.user) {
    return res.redirect('/sign-in')
  }

  res.render('index', {
    title: 'New Message',
    content: 'pages/new-message',
    user: req.user,
  })
}

const postNewMessage = async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/sign-in')
  }

  const { title, content } = req.body

  try {
    await pool.query('INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3)', [req.user.id, title, content])
    res.redirect('/')
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const postDeleteMessage = async (req, res, next) => {
  const postId = req.params.id

  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId])
    res.redirect('/')
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getNewMessage,
  postNewMessage,
  postDeleteMessage,
}
