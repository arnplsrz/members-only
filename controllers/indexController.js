const queries = require('../database/queries')

const getHomepage = async (req, res) => {
  const { posts } = await queries.getPosts()
  res.render('index', {
    title: 'Home',
    content: 'pages/homepage',
    posts: posts,
    user: req.user,
  })
}

module.exports = {
  getHomepage,
}
