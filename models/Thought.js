const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema(
    {
        reactionId : {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            max: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: (createdAtVal) => {
                return moment(createdAtVal).format('M/D h:m a');
            }
        }
    }
)

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min: 1,
            max: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => {
                return moment(createdAtVal).format('M/D h:m a');
            }
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        reactions: [ReactionSchema]
    },
    {
    toJSON: {
        getters: true,
        virtuals: true
    },
    id: false
    }
);

// get total count of reactions
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// create the Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;