const passport = require('passport');
const UserRepository = require('../repositories/UserRepository');
const ProductRepository = require('../repositories/ProductRepository');
const OperationRepository = require('../repositories/OperationRepository');
const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const operationRepository = new OperationRepository();

class UserController {
  constructor() {}

  async index(req, res) {
    let { query: { page, rowsPerPage } } = req;
    try {
      let [users, count] = await Promise.all([
        userRepository.find(null, null, { skip: rowsPerPage * page, limit: +rowsPerPage }),
        userRepository.count()
      ]);
      let responseObj = {
        users: users.map(user => user.toJSON()),
        count
      };
      return res.status(200).send(responseObj);
    } catch (err) {
      throw err;
    }
  }

  async update(req, res) {
    let { body, payload: { id } } = req;
    let user = await userRepository.findOne({ _id: id });
    user = Object.assign(user, body);

    return userRepository.save(user)
      .then(() => res.send(user.toJSON()))
  }

  current(req, res) {
    const { payload: { id } } = req;

    return userRepository.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.toJSON() });
      });
  }

  create(req, res) {
    const { body } = req;

    if (!body.email) { //TODO: make mongoose validators
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!body.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    const finalUser = userRepository.create(body);

    finalUser.setPassword(body.password);

    return userRepository.save(finalUser)
      .then(() => res.json({ user: finalUser.toAuthJSON() }))
      .catch(err => {
        return res.status(400).send(err);
      });
  }

  login(req, res, next) {
    const { body } = req;

    if (!body.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!body.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        user.save();

        return res.json({ user: user.toAuthJSON() });
      }

      return res.sendStatus(401);
    })(req, res, next);
  }

  logout(req, res, next) {
    const { payload: { id } } = req;

    return userRepository.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        user.token = null;
        user.save();

        return res.json({ user: user.toJSON() });
      });
  }
}

module.exports = UserController;