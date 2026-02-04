import mongoose from 'mongoose';

// Email regex validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone regex (10 digits)
const phoneRegex = /^[0-9]{10}$/;

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Member name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Member email is required'],
        trim: true,
        lowercase: true,
        match: [emailRegex, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Member phone is required'],
        trim: true,
        match: [phoneRegex, 'Phone must be 10 digits']
    }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    teamname: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        unique: true,
        minlength: [3, 'Team name must be at least 3 characters']
    },
    teamSize: {
        type: Number,
        required: [true, 'Team size is required'],
        min: [2, 'Minimum team size is 2'],
        max: [4, 'Maximum team size is 4']
    },
    leader: {
        name: {
            type: String,
            required: [true, 'Leader name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters']
        },
        email: {
            type: String,
            required: [true, 'Leader email is required'],
            trim: true,
            lowercase: true,
            match: [emailRegex, 'Please enter a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Leader phone is required'],
            trim: true,
            match: [phoneRegex, 'Phone must be 10 digits']
        }
    },
    member1: {
        type: memberSchema,
        required: [true, 'Member 1 is required (minimum 2 members)']
    },
    member2: memberSchema,
    member3: memberSchema,
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

// Index for faster queries
teamSchema.index({ 'leader.email': 1 });
teamSchema.index({ registeredAt: 1 });

const Team = mongoose.model('Team', teamSchema);

export default Team;
