var express = require("express");
var router = express.Router();
var silver = require("../models/silver");
var gold = require("../models/gold");
var etf = require("../models/etf");
var userprofiles = require("../models/userprofiles");




// router.post('/subscribeplan', (req, res) => {

//   const username = req.body.username;
//   const plan = req.body.plan;

//   // Find if user exists
//   userprofiles.findOne({ username })
//     .then((data) => {

//       if (data) {
//         data.investedplans.push(plan);

//         data.save()
//           .then(() => {
//             res.send({
//               status: "Plan Subscribed!",
//               user: data
//             });
//           })
//           .catch(() => res.send({ status: "Error Saving Existing User" }));

//       } else {
//         const newUser = new userprofiles({
//           username: username,
//           investedplans: [plan]
//         });

//         newUser.save()
//           .then(() => {
//             res.send({
//               status: "Plan Subscribed!",
//               // user: newUser
//             });
//           })
//           .catch(() => res.send({ status: "Error Creating New User" }));
//       }

//     })
//     .catch(() => {
//       res.send({ status: "Database Error" });
//     });

// });






router.post('/subscribeplan', (req, res) => {

  const username = req.body.username;
  const plan = req.body.plan;

  // Find if user exists
  userprofiles.findOne({ username })
    .then((data) => {

      // If user exists
      if (data) {

        // 🔍 DUPLICATE CHECK (by schemename or _id)
        const exists = data.investedplans.some(
          (p) => p.schemename === plan.schemename
        );

        if (exists) {
          return res.send({ status: "exist" });
        }

        // If not duplicate → add plan
        data.investedplans.push(plan);

        data.save()
          .then(() => {
            res.send({
              status: "Plan Subscribed!",
              user: data
            });
          })
          .catch(() => res.send({ status: "Error Saving Existing User" }));

      } else {
        // If user DOES NOT exist → create new profile
        const newUser = new userprofiles({
          username: username,
          investedplans: [plan]
        });

        newUser.save()
          .then(() => {
            res.send({
              status: "Plan Subscribed!"
            });
          })
          .catch(() => res.send({ status: "Error Creating New User" }));
      }

    })
    .catch(() => {
      res.send({ status: "Database Error" });
    });

});







router.get('/subscribedplans/:uname', (req, res) => {

  userprofiles.findOne({ username: req.params.uname })
    .then((data) => {

      if (data) {
        return res.send({
          status: "Success",
          investedplans: data.investedplans
        });
      } else {
        return res.send({ status: "User Not Found" });
      }

    })
    .catch(() => {
      res.send({ status: "Database Error" });
    });

});




router.delete('/unsubscribeplan/:uname/:planid', (req, res) => {
  const username = req.params.uname;
  const planId = req.params.planid;

  userprofiles.findOne({ username })
    .then((user) => {

      if (!user) {
        return res.send({ status: "User Not Found" });
      }

      // Filter out the plan to remove
      user.investedplans = user.investedplans.filter(
        (p) => p._id.toString() !== planId.toString()
      );

      user.save()
        .then(() => {
          res.send({
            status: "Plan Removed Successfully!",
            investedplans: user.investedplans
          });
        })
        .catch(() => {
          res.send({ status: "Error Saving" });
        });

    })
    .catch(() => {
      res.send({ status: "Database Error" });
    });
});





router.post("/getuserdetails", (req, res) => {
  userprofiles
    .findOne({ username: req.body.username })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => res.send({ status: "NotFound" }));
});

router.post("/entercategory", (req, res) => {
  userprofiles
    .insertMany(req.body)
    .then(() => {
      res.send({ status: `Welcome to PlanIT ${req.body.username}` });
    })
    .catch((e) => res.send({ status: "Something went Wrong" }));
});

router.delete("/deletecategory", (req, res) => {
  const categoryToDelete = req.query.category; // e.g., ?category=Gold

  userprofiles.find({}, { intrestedinvestments: 1 })
    .then((data) => {
      data.forEach(async (user) => {
        // Filter out the matching string (like deleting it)
        const updatedInvestments = user.intrestedinvestments.filter(
          (item) => item !== categoryToDelete
        );

        // Save the updated array back to DB
        await userprofiles.updateOne(
          { _id: user._id },
          { intrestedinvestments: updatedInvestments }
        );
      });

      res.send({ status: `Category '${categoryToDelete}' deleted successfully!` });
    })
    .catch((err) => {
      console.error("Error deleting category:", err);
      res.status(500).send({ status: "Something went wrong" });
    });
});

//  Adding Silver .................................................................
router.post("/addsilver", (req, res) => {
  var addsilver = new silver({
    schemename: req.body.schemename,
    type: req.body.type,
    previousperformance: req.body.previousperformance,
    overallreturns: req.body.overallreturns,
    fundmanager: req.body.fundmanager,
    fundsize: req.body.fundsize,
    fundriskometer: req.body.fundriskometer,
    aboutscheme: req.body.aboutscheme,
  });

  addsilver
    .save()
    .then(() => {
      res.send({ status: "Silver Plan Added" });
    })
    .catch(() => {
      res.send({ status: "Something  Went Wrong!!!" });
    });
});

//  Adding Gold .................................................................
router.post("/addgold", (req, res) => {
  var addgold = new gold({
    schemename: req.body.schemename,
    type: req.body.type,
    previousperformance: req.body.previousperformance,
    overallreturns: req.body.overallreturns,
    fundmanager: req.body.fundmanager,
    fundsize: req.body.fundsize,
    fundriskometer: req.body.fundriskometer,
    aboutscheme: req.body.aboutscheme,
  });

  addgold
    .save()
    .then(() => {
      res.send({ status: "Gold Plan Added" });
    })
    .catch(() => {
      res.send({ status: "Something Went Wrong!!!" });
    });
});

//  Adding ETF .................................................................
router.post("/addetf", (req, res) => {
  var addetf = new etf({
    schemename: req.body.schemename,
    type: req.body.type,
    previousperformance: req.body.previousperformance,
    overallreturns: req.body.overallreturns,
    fundmanager: req.body.fundmanager,
    fundsize: req.body.fundsize,
    fundriskometer: req.body.fundriskometer,
    aboutscheme: req.body.aboutscheme,
  });

  addetf
    .save()
    .then(() => {
      res.send({ status: "Gold Plan Added" });
    })
    .catch(() => {
      res.send({ status: "Something Went Wrong!!!" });
    });
});

// Show Silver .............................................................................

router.get("/silverplans", (req, res) => {
  silver
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

// Show Gold .............................................................................

router.get("/goldplans", (req, res) => {
  gold
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

// Show ETF .............................................................................

router.get("/etfplans", (req, res) => {
  etf
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.delete("/deletesilverplan/:type", (req, res) => {
  const { type } = req.params;   // get type from URL params

  silver.deleteOne({ type })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.send({'status':"Silver plan deleted successfully!"});
      } else {
        res.send({'status':"No silver plan found with that type"});
      }
    })
    .catch(() => {
      console.error({'status':"Error deleting silver plan"});
      // res.status(500).send("Something went wrong");
    });
});

router.delete("/deletegoldplan/:type", (req, res) => {
  const { type } = req.params;   // get type from URL params

  gold.deleteOne({ type })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.send({'status':"Gold plan deleted successfully!"});
      } else {
        res.send({'status':"No Gold plan found with that type"});
      }
    })
    .catch(() => {
      console.error({'status':"Error deleting Gold plan"});
    });
});


router.delete("/deleteetfplan/:type", (req, res) => {
  const { type } = req.params;   // get type from URL params

  etf.deleteOne({ type })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.send({'status':"Etf plan deleted successfully!"});
      } else {
        res.send({'status':"No Etf plan found with that type"});
      }
    })
    .catch(() => {
      console.error({'status':"Error deleting Etf plan"});
      // res.status(500).send("Something went wrong");
    });
});








router.post("/addmanysilver", (req, res) => {
  const silverPlans = req.body; // expecting an array

  silver.insertMany(silverPlans)
    .then(() => {
      res.send({ status: "Silver Plans Added Successfully" });
    })
    .catch(() => {
      res.send({ status: "Something Went Wrong!" });
    });
});



router.post("/addmanygold", (req, res) => {
  const goldPlans = req.body;

  gold.insertMany(goldPlans)
    .then(() => {
      res.send({ status: "Gold Plans Added Successfully" });
    })
    .catch(() => {
      res.send({ status: "Something Went Wrong!" });
    });
});



router.post("/addmanyetf", (req, res) => {
  const etfPlans = req.body;

  etf.insertMany(etfPlans)
    .then(() => {
      res.send({ status: "ETF Plans Added Successfully" });
    })
    .catch(() => {
      res.send({ status: "Something Went Wrong!" });
    });
});




module.exports = router;
