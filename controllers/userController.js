const { User, Role } = require('../models/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { json } = require('sequelize');

class UserController {
  static async createUser(req, res, next) {
    try {
      const { username, rlname, password, rolename, departmentId } = req.body;
      
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Создаем пользователя с хешированным паролем
      const user = await User.create({
          username,
          rlname,
          password: hashedPassword,
          rolename,
          departmentId
      });

      res.status(201).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}


static async logIn(req, res, next) {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Log both the plain text and hashed passwords for comparison
    console.log('Plain text password from request:', password);
    console.log('Hashed password from DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.rolename }, process.env.SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, username: user.username, role: user.rolename, rlname:user.rlname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


    static async getUser(req, res, next) {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.update(req.body);
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.destroy();
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;
