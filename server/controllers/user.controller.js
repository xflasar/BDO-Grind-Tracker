const User = require('../db/models/user.model.js');
const Session = require('../db/models/session.model.js');
const Site = require('../db/models/site.model.js');
const Auth = require('../db/models/auth.model.js');

exports.UserData = (req, res) => {
    User.findById(req.userId).populate('Sessions').populate('Sites').then(async (user) => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        res.status(200).send(user);
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.UserSessions = (req, res) => {
    Session.find({UserId: req.userId}).then(async (sessions) => {
        if (!sessions) {
            return res.status(404).send({ message: "No sessions found." });
        }
        res.status(200).send(sessions);
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.UserSites = (req, res) => {
    Site.find({UserId: req.userId}).then(async (sites) => {
        if (!sites) {
            return res.status(404).send({ message: "No sites found." });
        }
        res.status(200).send(sites);
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.AddSession = (req, res) => {
    User.findById(req.userId).then(async (user) => {
        await Site.findOne({SiteName: req.body.SiteName}, {UserId: req.userId}).then(async site => {
            if (!site) {
                await this.AddSite(req, res);
                user.Sites.push([site._id])
            } else {
                req.body.SiteId = site.id;
                req.body.ModifySite = true;
                req.body.TimeSpent = req.body.TimeSpentSession;
                req.body.TotalEarned = req.body.EarningsSession;
                req.body.TotalSpent = req.body.ExpensesSession;
                req.body.AverageEarnings = req.body.AverageEarningsSession;
                await this.ModifySite(req, res);
            }
            
            const session = new Session({
                SiteId: site._id,
                TimeSpent: req.body.TimeSpentSession,
                Earnings: req.body.EarningsSession,
                AverageEarnings: req.body.AverageEarningsSession,
                Expenses: req.body.ExpensesSession,
                Gear: { TotalAP: req.body.TotalAP, TotalDP: req.body.TotalDP},
                TimeCreated: Date.now(),
                UserId: req.userId
            });
            await session.save().then( async (savedSession) => {
                user.Sessions.push([savedSession._id]);
                await user.save().then(() => {
                    res.status(200).send("Session added!");
                }).catch(err => { res.status(500).send({ message: err })});
                
            }).catch(err => { res.status(500).send({ message: err })});
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => {res.status(500).send({ message: err })});
}

exports.AddSite = async (req, res) => {
    const site = new Site({
        SiteName: req.body.SiteName,
        TotalTime: req.body.TotalTime,
        TotalEarned: req.body.TotalEarned,
        TotalSpent: req.body.TotalSpent,
        AverageEarnings: req.body.AverageEarnings,
        UserId: req.userId
    });

    await site.save().catch(err => { res.status(500).send({ message: err })});
}

// Think about a way to separate the calls to update the user and the site so we can use them independently with res.status(200).send(); in the end
exports.ModifySession = async (req, res) => {
    const updateObject = {};
    for (const key in req.body) {
      if (Session.schema.obj.hasOwnProperty(key)) {
        updateObject[key] = req.body[key];
      }
    }

    const updatedUser = await Session.findByIdAndUpdate(
      req.body.SessionId,
      { $set: { ...updateObject } },
      { new: true }
    ).then(async (session) => {
        req.body.SiteId = session.SiteId;
        req.body.TimeSpent = session.TimeSpent;
        req.body.TotalEarned = session.Earnings;
        req.body.TotalSpent = session.Expenses;
        req.body.AverageEarnings = session.AverageEarnings;
        req.body.ModifySite = true;
        await this.ModifySite(req, res);
        req.body.ModifyUser = true;
        await this.ModifyUserData(req, res);
        res.status(200).send("Session modified!");
    }).catch(err => { res.status(500).send({ message: err })});
}

// BUG: When ModifySite is called it doesn't update the user's data, it only updates the site's data
exports.ModifySite = async (req, res) => {
    const updateObject = {};
    if(req.body.ModifySite) {
        const objectToBeUpdated = await Site.findById(req.body.SiteId);
        updateObject.TotalTime = req.body.TimeSpent = objectToBeUpdated.TotalTime + req.body.TimeSpent;
        updateObject.TotalEarned = req.body.TotalEarned     = objectToBeUpdated.TotalEarned + req.body.TotalEarned;
        updateObject.TotalSpent = req.body.TotalSpent = objectToBeUpdated.TotalSpent + req.body.TotalSpent;
        updateObject.AverageEarnings = req.body.AverageEarnings = objectToBeUpdated.AverageEarnings + req.body.AverageEarnings;

        const updatedUser = await Site.findByIdAndUpdate(
            req.body.SiteId,
            { $set: { ...updateObject } },
            { new: true }
        );
    }
    else {
        updateObject.TotalTime = req.body.TimeSpent;
        updateObject.TotalEarned = req.body.TotalEarned;
        updateObject.TotalSpent = req.body.TotalSpent;
        updateObject.AverageEarnings = req.body.AverageEarnings;

        const updatedUser = await Site.findByIdAndUpdate(
            req.body.SiteId,
            { $set: { ...updateObject } },
            { new: true }
        );
        res.status(200).send("Site modified!");
    }
}

exports.ModifyUserData = async (req, res) => {
    const updateObject = {};
    if(req.body.ModifyUser) {
        updateObject.TotalTime = req.body.TimeSpent;
        updateObject.TotalEarnings = req.body.Earnings;
        updateObject.TotalExpenses = req.body.Expenses;

        const updatedUser = await User.findByIdAndUpdate(
          req.userId,
          { $set: { ...updateObject } },
          { new: true }
        );
    }
    else {
        updateObject.TotalTime = req.body.TotalTime;
        updateObject.TotalEarnings = req.body.TotalEarned;
        updateObject.TotalExpenses = req.body.TotalSpent;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: { ...updateObject } },
            { new: true }
        );
        res.status(200).send("UserData modified!");
    }
}

// This function will delete a session and update the user's data and the site's data
exports.DeleteSession = (req, res) => {
    Session.findById(req.body.SessionId).then(async (session) => {
        req.body.SiteId = session.SiteId;
        req.body.TimeSpent = -session.TimeSpent;
        req.body.TotalEarned = -session.Earnings;
        req.body.TotalSpent = -session.Expenses;
        req.body.AverageEarnings = -session.AverageEarnings;
        req.body.ModifySite = true;
        await this.ModifySite(req, res);
        req.body.ModifyUser = true;
        await this.ModifyUserData(req, res);
        console.log(req.body);
        Session.findByIdAndDelete(req.body.SessionId).then(() => {
            res.status(200).send("Session deleted!");
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => { res.status(500).send({ message: err })});
}

// This is a dangerous function, it will delete all user data, including sessions and sites and authentication data | This function will be called when the user deletes his account
exports.DeleteUserData = (req, res) => {
    Site.deleteMany({ UserId: req.userId }).then(() => {
        Session.deleteMany({ UserId: req.userId }).then(() => {
            User.findByIdAndDelete(req.userId).then(() => {
                Auth.findOneAndDelete({ UserId: req.userId }).then(() => {
                    try
                    {
                        req.session = null;
                        res.session.destroy();
                        res.status(200).send("User data deleted!");
                    }
                    catch(err)
                    {
                        res.status(500).send({ message: err });
                    }
                }).catch(err => { res.status(500).send({ message: err })});
            }).catch(err => { res.status(500).send({ message: err })});
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => { res.status(500).send({ message: err })});
}