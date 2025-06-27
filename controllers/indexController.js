const pool = require('../database/pool')

async function getPosts() {
  try {
    const result = await pool.query(`
      SELECT 
        posts.id AS post_id,
        posts.title,
        posts.content,
        posts.timestamp,
        users.id AS user_id,
        users.first_name,
        users.last_name,
        users.username,
        users.is_admin
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.timestamp DESC
    `)

    const posts = result.rows.map(row => ({
      id: row.post_id,
      title: row.title,
      content: row.content,
      timestamp: row.timestamp,
      user: {
        id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        username: row.username,
        is_admin: row.is_admin,
      },
    }))

    return { posts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

const getHomepage = async (req, res) => {
  const { posts } = await getPosts()
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
