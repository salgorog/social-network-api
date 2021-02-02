const { User } = require('../models');

const userController =  {

    // method to get all users, takes two parameters: <req> and <res>. Callback function for the GET /api/users
    getAllUsers(req, res) {
        // Mongoose .find() method to find all users
        User.find({})
        // .populate() will display the friends array
        .populate({
            path: "friends",
        // select option with the minus sign - in front to indicate we don't want the __v column, or field, to be returned
            select: "-__v"
        })
        // .select() method to not return the __v field
        .select( "-__v")
        // .sort() method to sort in DESC order by the _id value
        .sort({_id: -1 })
        .then(dbUserData => 
            res.json(dbUserData)
        )
        .catch(err => {
            console.log(err)
            // send 400 error if something goes wrong
            res.status(400).json(err)
        });
    },

    // method to get an user by id. Callback function for the GET /api/users/:id
    getUserById({params}, res) {
        // Mongoose .findOne() method to find a single user by its id
        User.findOne({_id: params.id})
        // populate() will display the thoughts array
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        //populate() will display the friends array
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select("-__v")
        .then(dbUserData => {
            if(!dbUserData) {
                // if can't find user by id send 404 status back to alert users that it doesn't exist
                res.status(404).json({message: "Cannot find a user with that id"});
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        }) 
    },

    // method to create an user. Callback function for the POST /api/users
    createUser({body}, res) {
        // Mongoose .create() method to create data based on the body from the User.js model, only needing objects that have required properties
        User.create(body)
        .then(dbUserData=>res.json(dbUserData))
        .catch(err=>res.json(err))
    },

    // method to update user by id. Callback function for the PUT /api/users/:id
    updateUser({params,body}, res){
        // Mongoose .findOneAndUpdate() method
        User.findOneAndUpdate({_id: params.id}, body,{new:true, runValidators: true})
        .then(dbUserData =>{
            if(!dbUserData){
                res.status(404).json({message: "Cannot find a user with that id"});
                return
            }
            res.json(dbUserData)
        })
        .catch(err =>{
            console.log(err)
            // send 400 error if something goes wrong
            res.status(400).json(err)
        })
    },

    // method to delete an user. Callback function for the DELETE /api/users/:id
    deleteUser({params}, res){
        // Mongoose .findByIdAndDelete() method will find the document, or row, to be returned and also delete it from the database.
        User.findByIdAndDelete(params.id)
        .then(dbUserData =>{
            if(!dbUserData){
                res.status(404).json({message: "Cannot find a user with that id"});
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },

    // method to add friend by id. Callback function for the POST /api/users/:UserId/friends/:friendId
    addFriend({params}, res){
        // Mongoose .findOneAndUpdate() method to find user by id and add friend by id. It will push data to an array using the $push method. It will display in the friends document, and increase friendCount by 1
        User.findOneAndUpdate(
            {_id: params.UserId},
            {$push: {friends: params.friendId}},
            {new: true}
        )
        .then(dbUserData =>{
            if(!dbUserData){
                res.status(404).json({message: "Cannot find a user with that id"});
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },

    // method to delete friend by id. Callback function for the /api/users/:UserId/friends/:friendId
    deleteFriend({params}, res){
        // Mongoose .findONeAndUpdate() method to find user by id and delete friend by id. It will delete data from an array using the $pull operation. The result will retrieve the first user with the friend's document not displaying the deleted friend
        User.findOneAndUpdate(
            {_id: params.UserId},
            {$pull: {friends: params.friendId}},
            {new: true}
        )
        .then(dbUserData =>{
            if(!dbUserData){
                res.status(404).json({message: "Cannot find a user with that id"});
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    }
}


module.exports = userController;