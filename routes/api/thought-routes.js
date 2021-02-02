const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// route to get, and create thought. Set up GET and POST at /api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

// route to get, update, and thought. Set up GET, PUT, and DELETE at /api/thoughts/:id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

// route to add reaction. Set up POST at /api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .post(addReaction);

// route to delete reactions. Set up DELETE at /api/thoughts/:thoughtId/reactions/:reactionID
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;
