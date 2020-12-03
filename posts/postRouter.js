const express = require('express');

const router = express.Router();

const HelperFuncs = require('./postDb')

// CUSTOM MIDDLEWARE
const validatePostId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const match = await HelperFuncs.getById(id);
    if (!match){
      res.status(404).json({ message: `Post with id ${id} not found.`})
    } else {
      req.match = match;
      next();
    }
  }
  catch(error){
    res.status(500).json({ message: error.message})
  }
}

// ENDPOINTS
router.get('/', (req, res) => {
  HelperFuncs.get()
  .then(everything => {
    res.status(200).json(everything)
  })
  .catch(error => {
    res.status(500).json({ message: error.message })
  })
 
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.match)
});

router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;

  HelperFuncs.remove(id)
  .then(success => {
    res.status(202).json({ message: `The following post has been deleted: ${JSON.stringify(req.match)}` }) //question!
  })
  .catch(error => {
    res.status(500).json({ message: error.message})
  })

});

router.put('/:id', validatePostId, (req, res) => { //question!
  //updating! not creating new post.
});


module.exports = router;
