const getHomepage = (req, res) => {
  res.render('index', {
    title: 'Home',
    content: 'pages/homepage',
  })
}

module.exports = {
  getHomepage,
}
