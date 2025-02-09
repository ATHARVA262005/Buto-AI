import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 characters long"],
        maxLength: [50, "Email must be at most 50 characters long"]
    },

    password:{
        type: String,
        select: false,
        required: true,
    },
    otp: {
        code: String,  // Store plain OTP temporarily
        expiresAt: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription'
    },
    usageStats: {
        projectsCreated: {
            type: Number,
            default: 0
        },
        totalRequests: {
            type: Number,
            default: 0
        },
        lastRequestDate: Date,
        apiCalls: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

userSchema.statics.hashPassword = function(password){
    return bcrypt.hash(password, 10);
}

userSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        { userId: this._id, email: this.email },
        process.env.JWT_SECRET,  // Changed from SECRET_KEY to JWT_SECRET
        { expiresIn: '24h' }
    );
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}

// Update the OTP generation method
userSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = {
        code: otp,  // Store plain OTP
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };
    return otp;
};

// Simplify the OTP verification method
userSchema.methods.verifyOTP = function(inputOTP) {
    console.log('Stored OTP:', this.otp?.code);
    console.log('Input OTP:', inputOTP);
    
    if (!this.otp?.code || !this.otp?.expiresAt) {
        console.log('No OTP stored or missing expiry');
        return false;
    }
    
    if (this.otp.expiresAt < Date.now()) {
        console.log('OTP expired');
        return false;
    }

    return this.otp.code === inputOTP;
};

userSchema.methods.hasValidSubscription = function() {
    return this.subscription?.status === 'active' && 
           (!this.subscription.endDate || new Date(this.subscription.endDate) > new Date());
};

userSchema.methods.canUseFeature = function(feature, limit) {
    if (!this.hasValidSubscription()) return false;
    
    const stats = this.usageStats || {};
    const currentUsage = stats[feature] || 0;
    return currentUsage < limit;
};

userSchema.methods.incrementUsage = async function(feature) {
    if (!this.usageStats) this.usageStats = {};
    this.usageStats[feature] = (this.usageStats[feature] || 0) + 1;
    this.usageStats.lastRequestDate = new Date();
    await this.save();
};

// Add method to verify user's email
userSchema.methods.verifyEmail = function() {
    this.emailVerified = true;
    return this.save();
};

// Add method to check subscription status
userSchema.methods.hasActiveSubscription = async function() {
    if (!this.subscription) return false;
    await this.populate('subscription');
    return this.subscription.status === 'active';
};

const User = mongoose.model("user", userSchema);

export default User;