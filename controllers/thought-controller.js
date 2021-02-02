const { Thought, User } = require('../models');

const thoughtController = {

    // method to get all thoughts taking two parameters: <req> and <res>. Callback function for the route GET /api/thoughts
    getAllThoughts(req, res){
        // Mongoose .find() method to find all thoughts
        Thought.find({})
        // .select() method to not return the __v field
        .select('-__v')
        // .sort() method to sort in DESC order by the _id value
        .sort({_id: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            // send 400 error if something goes wrong
            res.status(400).json(err);
        });
    },

    // get thought by id
    getThoughtById({params}, res){
        // Mongoose .findOne() method to find a single thought by its id
        Thought.findOne({_id: params.id})
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData){
                // if can't find thought by id send 404 status back to alert users that it doesn't exist
                res.status(404).json({message: "Cannot find a thought with that id"});
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err=>{
            console.log(err)
            res.status(400).json(err);
        })
    },

    // method to create a thought. Callback function for the route POST /api/thoughts
    createThought({body},res){
        // Mongoose .create() method to create data based on the body from the Thought.js model, only needing objects that have required properties (username, thoughtText)
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: body.userId},
                {$push: { thoughts: _id}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'Cannot find a user with that id'});
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
        })
    },

    // method to update a thought by id. Callback function for the route PUT /api/thoughts/:id
    updateThought({params,body}, res){
        // Mongoose .findOneAndUpdate() method. Finds thought by id, sends new thoughtText
        Thought.findOneAndUpdate({_id: params.id}, body, {new:true})
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({message: "No thought was found with that id"});
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
        })
    },

    // method to delete a thought. Callback function for route DELETE /api/thoughts/:id
    deleteThought({params}, res){
        // Mongoose .findByIdAndDelete() method will find the document by id, or row, to be returned and also delete it from the database.
        Thought.findOneAndDelete({_id: params.id})
        .then(deletedThought => {
            if(!deletedThought){
            res.status(404).json({message:"No thought was found with that id"});
            return
          }
            return User.findByIdAndUpdate(
                {username: deletedThought.username},
                {$push: { thoughts: params.id}},
                {new: true}
            );
        })
        .then(dbUserData=>{
            if(!dbUserData) {
                res.status(404).json({message: "No thought was found with that id"});
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },

    // method to add a reaction. Callback function for the route POST /api/thoughts/:thoughtId/reactions
    addReaction({params,body}, res) {
        // Mongoose .findOneAndUpdate() method to find thought by id and add a reaction. It will push new data to an array using the $push method. This imports the ReactionSchema from Thought.js
        Thought.findOneAndUpdate(
            {_id:params.thoughtId },
            {$push: {reactions: body}},
            {new: true, runValidators: true},
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({message:"No thought was found with that id"});
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },

    // method to delete a reaction. Callback function for the route DELETE /api/thoughts/:thoughtId/reactions/:reactionID
    deleteReaction({params}, res){
        // Mongoose .findONeAndUpdate() method to find thought by id and delete reaction by id. It will delete data from an array using the $pull operation. The result will retrieve the first thought with the reaction's document not displayed based on reactionId
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            { $pull: {reactions: {reactionId: params.reactionId}}},
            { new: true}
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }

};

module.exports = thoughtController;