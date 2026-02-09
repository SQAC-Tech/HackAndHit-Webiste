import mongoose from "mongoose";

/* ================== REGEX ================== */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

/* ================== HOSTELS ================== */
const HOSTELS = [
    "Oori",
    "Kaari",
    "Paari",
    "Adhyaman",
    "Nelson Mandela",
    "International Hostel",
    "Agastyhar",
    "Sannasi A",
    "Sannasi C",
    "M-block",
    "Manoranjithm",
    "N-block",
    "Began",
    "ESQ",
    "Meenakshi",
    "Kalpana Chawla",
    "Other"
];

/* ================== PERSON (LEADER / MEMBER) ================== */
const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            match: [emailRegex, "Invalid email format"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [phoneRegex, "Phone must be 10 digits"]
        },

        residenceType: {
            type: String,
            required: true,
            enum: ["dayscholar", "hosteler"]
        },

        hostelName: {
            type: String,
            enum: HOSTELS,
            required: function () {
                return this.residenceType === "hosteler";
            }
        },
        wardenName: {
            type: String,
            minlength: 2,
            required: function () {
                return this.residenceType === "hosteler";
            }
        },
        hostelContact: {
            type: String,
            match: phoneRegex,
            required: function () {
                return this.residenceType === "hosteler";
            }
        }
    },
    { _id: false }
);

/* ================== TEAM SCHEMA ================== */
const teamSchema = new mongoose.Schema(
    {
        teamname: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },

        teamSize: {
            type: Number,
            required: true,
            min: 2,
            max: 4
        },

        leader: {
            type: personSchema,
            required: true
        },

        member1: {
            type: personSchema,
            required: true
        },

        member2: {
            type: personSchema,
            required: function () {
                return this.teamSize >= 3;
            }
        },

        member3: {
            type: personSchema,
            required: function () {
                return this.teamSize === 4;
            }
        },

        transactionId: {
            type: String,
            required: [true, "Transaction ID is required"],
            trim: true,
            minlength: [4, "Transaction ID is too short"]
        },

        /* ================== STATUS TAGS ================== */
        pptSubmitted: { type: Boolean, default: false },
        mailSent: { type: Boolean, default: false },
        round1: { type: Boolean, default: false },
        round2: { type: Boolean, default: false },
        round3: { type: Boolean, default: false },

        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

/* ================== INDEXES ================== */
teamSchema.index({ teamname: 1 });
teamSchema.index({ "leader.email": 1 });
teamSchema.index({ transactionId: 1 });
teamSchema.index({ registeredAt: 1 });

/* ================== EXPORT ================== */
const Team = mongoose.model("Team", teamSchema);
export default Team;
