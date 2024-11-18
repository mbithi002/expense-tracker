import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

const userResolver = {
    Mutation: {
        signup: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input
                if (!username || !name || !password || !gender) {
                    return { error: 'Please fill in all fields' }
                }
                const existingUser = await User.findOne({ username })
                if (existingUser) {
                    return { error: 'Username already exists' }
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt)
                const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === 'male' ? maleProfilePic : femaleProfilePic
                })

                await newUser.save()
                await context.login(newUser)
                return newUser
            } catch (error) {
                console.log("Error in signup: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input
                if (!username || !password) {
                    return { error: 'Please fill in all fields' }
                }
                const userExsists = await User.findOne({ username })
                if (!userExsists) {
                    return { error: 'Username does not exist' }
                }
                const isMatch = await bcrypt.compare(password, userExsists.password)
                if (!isMatch) {
                    return { error: 'Password is incorrect' }
                }
                const { user } = await context.authenticate("graphql-local", { username, password })
                await context.login(user)
                return user
            } catch (error) {
                console.log('Error in login: ', error);

                throw new Error(error.message) || 'Something went wrong'
            }
        },
        logout: async (_, __, context) => {
            const { req, res } = context
            try {
                await context.logout();
                req.session.destroy((err) => {
                    if (err) throw err;
                });
                res.clearCookie("connect.sid");

                return { message: "Logged out successfully" };
            } catch (err) {
                console.error("Error in logout:", err);
                throw new Error(err.message || "Internal server error");
            }
        },
    },
    Query: {
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser()
                return user
            } catch (error) {
                console.log('Error in authUser: ', error);
                throw new Error(error.message) || 'something went wrong'
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId)
                if (!user) {
                    return { error: 'User not found' }
                }
                return user
            } catch (error) {
                console.log('Error in users query: ', error);
                throw new Error(error.message) || 'something went wrong'
            }
        }
    },
    // TODO => ADD USER/TRANSACTION RELATIONSHIP
}

export default userResolver