const express = require('express');
const axios = require('axios').default;
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await fetchPosts();

  const postsWithImages = await Promise.all(
    posts.map(async (post) => {
      const photoResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      const images = photoResponse.data.slice(0, 3); 

      return {
        ...post,
        images,
      };
    })
  );

  res.json(postsWithImages);
});

module.exports = router;
