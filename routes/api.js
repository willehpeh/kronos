var express = require('express');
var router = express.Router();

var Watch = require('../app/models/watch');
var User = require('../app/models/user');
var PressPhoto = require('../app/models/pressphoto');
var NewsPost = require('../app/models/newspost');
var CalendarElement = require('../app/models/calendarelement');

var path = require('path');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: path.join(__dirname, "../public/images/tmp")});
var fs = require('fs-extra');
var nodemailer = require('nodemailer');

var config = require('../config/config');

var tokenMiddleware = function(req, res, next) {
  console.log(req.headers);
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        console.log("Token invalid.");
        return res.status(401).send({errorMessage: "Token expiré."});
      } else if (decoded.user.name == config.admin) {
        console.log("Admin token valid, success!");
        req.body.token = token;
        req.body.admin = true;
        next();
      } else if (decoded.user.name == config.retailer) {
        console.log("Retailer token valid, success!");
        req.body.token = token;
        req.body.retailer = true;
        next();
      } else {
        console.log("Invalid user.")
        return res.status(401).send({errorMessage: "Invalid user " + JSON.stringify(decoded.user)})
      }
    });

  } else {

    // if there is no token
    // return an error
    console.log("No token.")
    return res.status(401).send({errorMessage: "Merci de vous identifier."});
  }
}

// ================================================================================================

//                  CONTACT

// ================================================================================================

router.route('/contact')
  .post(function(req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.email;
    var text = req.body.text;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.via_address, // Your email id
            pass: config.via_pw // Your password
        }
    });
    var mailOptions = {
    from: address, // sender address
    to: config.to_address, // list of receivers
    subject: 'Nouveau message de la page Contact Kronos', // Subject line
    text: 'Nom : ' + name + '\n' +
          'Téléphone : ' + phone + '\n' +
          'Email : ' + address + '\n' +
          'Message : ' + '\n' +
          text
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
        console.log(error);
        res.json({yo: 'error'});
      } else {
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
      };
    });
  });

// ================================================================================================

//                  NEWSLETTER

// ================================================================================================

  router.route('/newsletter-sub')
    .post(function(req, res) {
      var name = req.body.name;
      var address = req.body.email;
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: config.via_address, // Your email id
              pass: config.via_pw // Your password
          }
      });
      var mailOptions = {
      from: address, // sender address
      to: config.to_address, // list of receivers
      subject: 'Nouvel abonnement Newsletter Kronos', // Subject line
      text: 'Nom : ' + name + '\n' +
            'Email : ' + address + '\n' +
            'Nouvel abonné de Newsletter'
      }

      transporter.sendMail(mailOptions, function(error, info){
        if(error) {
          console.log(error);
          res.json({yo: 'error'});
        } else {
          console.log('Message sent: ' + info.response);
          res.json({yo: info.response});
        };
      });
    });

// ================================================================================================

//                  WATCH

// ================================================================================================

router.route('/watch')
// ALL WATCH ::: GET
  .get(function(req, res, next) {
    Watch.find(function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data);
    });
  })

// SPECIFIC WATCH ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var watch = new Watch();

    watch.marque = req.body.marque;
    watch.nom = req.body.nom;
    watch.quantite = req.body.quantite;
    watch.reference = req.body.reference;
    watch.annee = req.body.annee;
    watch.description = req.body.description;
    watch.categorie = req.body.categorie;
    watch.disponible = req.body.disponible;
    watch.prix = req.body.prix;
    watch.taille = req.body.taille;
    watch.mouvement = req.body.mouvement;
    watch.garantie = req.body.garantie;
    watch.limite = req.body.limite;
    watch.etancheite = req.body.etancheite;
    watch.glace = req.body.glace;
    watch.boitier = req.body.boitier;
    watch.traitement = req.body.traitement;
    watch.cadran = req.body.cadran;
    watch.lunette = req.body.lunette;
    watch.poids = req.body.poids;

    watch.save(function(err, watch) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.send(watch);
    });
  });

router.route('/watch/:id')
// SPECIFIC WATCH ::: GET
  .get(function(req, res) {
    Watch.findById(req.params.id, function(err, watch) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(watch);
    });
  })
// SPECIFIC WATCH ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    Watch.findById(req.params.id, function(err, watch) {
      if(err) {
        res.status(500).send(err);
      }
      watch.marque = req.body.marque;
      watch.nom = req.body.nom;
      watch.quantite = req.body.quantite;
      watch.reference = req.body.reference;
      watch.annee = req.body.annee;
      watch.description = req.body.description;
      watch.categorie = req.body.categorie;
      watch.disponible = req.body.disponible;
      watch.prix = req.body.prix;
      watch.taille = req.body.taille;
      watch.mouvement = req.body.mouvement;
      watch.garantie = req.body.garantie;
      watch.limite = req.body.limite;
      watch.etancheite = req.body.etancheite;
      watch.glace = req.body.glace;
      watch.boitier = req.body.boitier;
      watch.traitement = req.body.traitement;
      watch.cadran = req.body.cadran;
      watch.lunette = req.body.lunette;
      watch.poids = req.body.poids;

      watch.save(function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        return res.send(watch);
      });
    })
  })
// SPECIFIC WATCH ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    Watch.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("Watch removed.");
    });
  });

// ================================================================================================

//                  NEWSPOST

// ================================================================================================

router.route('/newspost')
// ALL NEWSPOST ::: GET
  .get(function(req, res) {

  })

// SPECIFIC NEWSPOST ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var newspost = new NewsPost();

    newspost.text = req.body.text;
    newspost.title = req.body.title;
    newspost.date = req.body.date;

    newspost.save(function(err, newspost) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.send(newspost);
    });
  });

router.route('/newspost/:id')
// SPECIFIC NEWSPOST ::: GET
  .get(function(req, res) {

  })
// SPECIFIC NEWSPOST ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
  })
// SPECIFIC NEWSPOST ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
  });

// ================================================================================================

//                  CALENDARELEMENT

// ================================================================================================

router.route('/calendarelement')
// ALL CALENDARELEMENT ::: GET
  .get(function(req, res) {

  })

// SPECIFIC CALENDARPOST ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var calendarelement = new CalendarElement();

    calendarelement.text = req.body.text;
    calendarelement.date = req.body.date;
    calendarelement.place = req.body.place;

    calendarelement.save(function(err, calendarelement) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.send(calendarelement);
    });
  });

router.route('/calendarelement/:id')
// SPECIFIC CALENDARPOST ::: GET
  .get(function(req, res) {

  })
// SPECIFIC CALENDARPOST ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
  })
// SPECIFIC CALENDARPOST ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
  });

// ================================================================================================

//                  USER

// ================================================================================================

router.route('/user')
// ALL USER ::: GET
  .get(function(req, res) {

  })
// SPECIFIC USER ::: POST
  .post(function(req, res) {

  });

router.route('/user/:id')
// SPECIFIC USER ::: GET
  .get(function(req, res) {

  })
// SPECIFIC USER ::: PUT
  .put(function(req, res) {

  })
// SPECIFIC USER ::: DELETE
  .delete(function(req, res) {

  });

// ================================================================================================

//                  PRESSPHOTO

// ================================================================================================

router.route('/pressphoto')
// ALL PRESSPHOTO ::: GET
  .get(function(req, res) {
    PressPhoto.find(function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data);
    });
  })

// SPECIFIC PRESSPHOTO ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var pressphoto = new PressPhoto();

    pressphoto.title = req.body.title;
    pressphoto.caption = req.body.caption;

    pressphoto.save(function(err, pressphoto) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.send(pressphoto);
    });
  })

router.route('/pressphoto/:id')
// SPECIFIC PRESSPHOTO ::: GET
  .get(function(req, res) {
    PressPhoto.findById(req.params.id, function(err, pressphoto) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(pressphoto);
    });
  })
// SPECIFIC PRESSPHOTO ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
  })
// SPECIFIC PRESSPHOTO ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
  })

module.exports = router;
