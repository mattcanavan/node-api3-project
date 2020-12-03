const express = require('express');

const router = express.Router();

const HelperFuncs = require('./userDb');

// CUSTOM MIDDLEWARE
async function validateUserId(req, res, next) {
  const { id } = req.params;

  try{
    const user = await HelperFuncs.getById(id);
    if (!user){
      res.status(404).json({ message: `User with id ${id} not found.`})
    } else {
      req.user = user;
      next();
    }
  }
  catch(error){
    res.status(500).json({message: error.message })
  }
}

function validateUser(req, res, next) {
  
  if (!req.body){
    res.status(400).json({ message: "missing user data (i.e. body)" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else{
    req.newUser = req.body;
    next();
  }

}

function validatePost(req, res, next) {

  if (!req.body){
    res.status(400).json({ message: "missing user data (i.e. body)" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else{
    req.newPost = req.body;
    next();
  }
}

// ENDPOINTS
router.post('/', validateUser, (req, res) => {
  
  HelperFuncs.insert(req.newUser)
  .then(success => {
    res.status(201).json({message: `new user added with name: ${JSON.stringify(req.newUser)}`}) //dont want to do req.body.name !question!
  })
  .catch(error => {
    res.status(500).json({message: error.message})
  })

});

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
  HelperFuncs.insert(req.newPost)
  .then(success => {
    res.status(201).json({message: `successfully added the following post ${JSON.stringify(req.newPost)}`})
  })
  .catch(error => {
    res.status(500).json({message: error.message})
  })

});

router.get('/', (req, res) => {
  HelperFuncs.get()
  .then(success => {
    res.status(200).json(success)
  })
  .catch(error => {
    res.status(500).json({ message: error.message })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  HelperFuncs.getUserPosts(id) //userId
  .then(success => {
    res.status(200).json(success)
  })
  .catch(error => {
    res.status(500).json({ message: error.message })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  HelperFuncs.remove(id) //userId
  .then(success => {
    res.status(202).json({ message: `Say goodbye to ${JSON.stringify(req.user)}.`})
  })
  .catch(error => {
    res.status(500).json(error.message)
  })
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  HelperFuncs.update(req.params.id, req.newUser)
  .then(success => {
    res.status(200).json({message: `successfully updated name to ${req.body.name}`}) //JSON.stringify(req.nerUser)
  })
  .catch(error => {
    res.status(500).json(error.message)
  })
});


module.exports = router;
