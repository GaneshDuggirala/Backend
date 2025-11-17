var express = require("express");
var router = express.Router();
var users = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

router.post("/register", (req, res) => {
  users
    .findOne({ username: req.body.username })
    .then(async (data) => {
      if (data) {
        res.send({ "status": "exist" });
      } else {
        var userdata = new users({
          username: req.body.username,
          password: await bcrypt.hash(req.body.password, 10),
          email: req.body.email,
          phone: req.body.phone,
          userrole:'user'
        });

        userdata
          .save()
          .then(() => {

// Mail Transport ..........................................................................

            var transport = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "ganeshdugirala@gmail.com",
                pass: "eqrd vvws rqeg mltd",
              },
            });

            transport.sendMail({
              from: "ganeshdugirala@gmail.com",
              to: req.body.email,
              subject: "🎉 Welcome to PlanIt — Your Financial Journey Begins!",
              text: `Hi ${req.body.username},

Welcome to PlanIt! 💰  
Your registration was successful, and your account is now active.

With PlanIt, you can:
📊 Track and manage your monthly expenses effortlessly  
🎯 Set and monitor your financial goals  
📈 Plan your investments in mutual funds, gold, and ETFs  
💡 Get AI-powered insights to grow your savings smarter  

Start taking control of your financial future today:  
👉 Login to your dashboard and begin planning wisely.

If you didn’t register for this account, please contact our support team immediately at support@planit.com.

Cheers,  
The PlanIt Team 💼  
"Smart Financial Planning Made Simple"`,
            });


// ...................................................................................



            res.send({ "status": "Registered" });
          })
          .catch(() => {
            console.log(userdata);
            res.send({ "status": "failed" });
          });
      }
    })
    .catch(() => {
      res.send({ "status": "failed" });
    });
});

router.post("/login", (req, res) => {
  users
    .findOne({ username: req.body.username })
    .then(async (data) => {
      if (!data) {
        res.send({
          "status": "Not Registered",
        });
      } else {
        if (await bcrypt.compare(req.body.password, data.password)) {
          let token = await jwt.sign({ username: data.username,userrole:data.userrole }, "12345", {
            expiresIn: "1h",
          });
          res.send({ 'status': "Login",'token':token,'userrole':data.userrole,'username': data.username});
        } else {
          res.send({ 'status': "failed" });
        }
      }
    })
    .catch(() => {
      res.send({ "status": "something" });
    });
});

module.exports = router;
