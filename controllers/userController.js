const { User, Role } = require('../models/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { json } = require('sequelize');

class UserController {
  static async createUser(req, res, next) {
    try {
      const { username, password, rolename, department } = req.body;
      
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);
      const unhashedpassword = await bcrypt.compare(password, hashedPassword)
      console.log(unhashedpassword);
      
      // Создаем пользователя с хешированным паролем
      const user = await User.create({
          username,
          password: hashedPassword,
          rolename,
          department
      });

      res.status(201).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}


static async logIn(req, res, next) {
  try {
        const { username, password } = req.body;
        console.log(username, password);
        
        const user = await User.findOne({ where: { username } });
        console.log(user);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        console.log(password);
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(password);
        console.log(user.username, user.password);
        
        
        console.log(isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Password is incorrect' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.rolename }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
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
