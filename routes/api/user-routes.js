const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// route to get all users, create an user. Set up GET and POST at /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// route to update or delete user by id. Set up GET, PUT, and DELETE at /api/users/:id
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// route to add, delete friend. Set up POST and DELETE at /api/users/:UserId/friends/:friendId
router
    .route('/:UserId/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend);

module.exports = router;