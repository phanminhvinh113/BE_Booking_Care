import db from "../models/index";
import { createNewUser } from "../services/authService";

const homeController = {
  homePage: async (req, res) => {
    try {
      const data = await db.User.findAll();
      res.render("homePage.ejs", {
        data,
      });
    } catch (error) {
      res.json({
        message: error,
      });
    }
  },
  newPage: (req, res) => {
    res.render("news/news.ejs");
  },
  userPage: async (req, res) => {
    const data = await db.User.findAll();
    res.json(data);
  },
  crudPage: async (req, res) => {
    res.render("crud.ejs");
  },
  crudStored: async (req, res) => {
    await createNewUser(req.body);
    res.redirect("/");
  },
  editUser: async (req, res) => {
    const userEdit = await db.User.findOne({
      where: { id: req.query.id },
      raw: true,
    });
    res.render("updateUser.ejs", {
      data: userEdit,
    });
  },
  //
  updateUser: async (req, res) => {
    try {
      const data = req.body;
      console.log(req.params.id);
      const user = await db.User.findOne({
        where: { id: req.params.id },
        raw: false,
      });
      user.set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
      });
      await user.save();
      res.redirect("/");
    } catch (error) {
      res.json({
        message: "error",
      });
    }
  },
  //
  deleteUser: async (req, res) => {
    try {
      await db.User.destroy({
        where: { id: req.query.id },
      });
      res.redirect("/");
    } catch (error) {
      res.send("fail");
    }
  },
  //
  restoreUser: async (req, res) => {
    try {
      const data = await db.User.findAll({
        where: {},
        include: [
          {
            model: User,
            paranoid: false,
          },
        ],
        paranoid: false,
      });
      res.render("recycle_bin.ejs", {
        data,
      });
    } catch (error) {}
  },
};

module.exports = homeController;
