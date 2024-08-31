const { User } = require('../models');
const { Op } = require('sequelize');

const userService = {
    registerUser: async (name, username, password) => {
        try {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                throw new Error('Username already registered');
            }

            // Directly save the password in plain text for now
            const newUser = await User.create({ name, username, password });
            return newUser;
        } catch (error) {
            throw error;
        }
    },

    authenticateUser: async (username, password) => {
        // Find user by username
        const user = await User.findOne({ where: { username } });

        if (user && user.password === password) {  // Replace with hashed password comparison
            return user;
        } else {
            throw new Error('Invalid username or password');
        }
    },

    findUserByUsername: async (username) => {
        try {
            return await User.findOne({ where: { username } });
        } catch (error) {
            throw error;
        }
    },

    findUserById: async (id) => {
        try {
            return await User.findByPk(id);
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (id, updates) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }

            // If username is being updated, ensure it's not already taken
            if (updates.username && updates.username !== user.username) {
                const usernameTaken = await User.findOne({ 
                    where: { username: updates.username, id: { [Op.ne]: id } }
                });
                if (usernameTaken) {
                    throw new Error('Username already registered');
                }
            }

            // If password is being updated, hash the new password
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            // Update and return the user
            await user.update(updates);
            return user;
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }

            await user.destroy();
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userService;