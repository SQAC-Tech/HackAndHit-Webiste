import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    teamname: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        unique: true
    },
    teamSize: {
        type: Number,
        required: [true, 'Team size is required'],
        min: 1,
        max: 4
    },
    leader: {
        name: {
            type: String,
            required: [true, 'Leader name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Leader email is required'],
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: [true, 'Leader phone is required'],
            trim: true
        }
    },
    member1: memberSchema,
    member2: memberSchema,
    member3: memberSchema
}, { 
    timestamps: true 
});

// Index for faster queries
teamSchema.index({ teamname: 1 });
teamSchema.index({ 'leader.email': 1 });

const Team = mongoose.model('Team', teamSchema);

export default Team;
