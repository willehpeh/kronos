var express = require('express');
var router = express.Router();

// Load models for MongoDB
var Watch = require('../app/models/Watch');
var User = require('../app/models/User');
var PressPhoto = require('../app/models/PressPhoto');
var NewsPost = require('../app/models/NewsPost');
var CalendarElement = require('../app/models/CalendarElement');
var Ambassador = require('../app/models/Ambassador');

var path = require('path');

// Security requirements
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// File upload requirements
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: path.join(__dirname, "../public/images/tmp")});
var fs = require('fs-extra');

// E-mail form requirement
var nodemailer = require('nodemailer');

// Config variable load
var config = require('../config/config');

// Middleware used for checking valid token and checking if admin or retailer
// Returns token and admin true/false
var tokenMiddleware = function(req, res, next) {
  console.log(req.headers); // debug line

  // check everywhere for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {

    // verifies secret and checks exp, checks admin/retailer
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        console.log("Token invalid.");
        return res.status(401).send({errorMessage: "Token expiré."});
      }
      else if (decoded.user.name == config.admin) { // checks if admin
        console.log("Admin token valid, success!");
        req.body.token = token;
        req.body.admin = true;
        next();
      }
      else if (decoded.user.name == config.retailer) { // if not admin, checks if retailer
        console.log("Retailer token valid, success!");
        req.body.token = token;
        req.body.retailer = true;
        req.body.admin = false;
        next();
      }
      else { // will only hit if token false or outdated
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

    // get info from request
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.email;
    var text = req.body.text;

    // initiate nodemailer service with info from config file
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.via_address,
            pass: config.via_pw
        }
    });

    // build e-mail
    var mailOptions = {
    from: address,
    to: config.to_address,
    subject: 'Nouveau message de la page Contact Kronos',
    text: 'Nom : ' + name + '\n' +
          'Téléphone : ' + phone + '\n' +
          'Email : ' + address + '\n' +
          'Message : ' + '\n' +
          text
    }

    // send email with nodemailer
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

  router.route('/garantie')
    .post(function(req, res) {

      console.log(req.body);
      // get info from request
      var civilite = req.body.civilite;
      var nom = req.body.nom;
      var prenom = req.body.prenom;
      var adresseOne = req.body.adresseOne;
      if(req.body.adresseTwo) {
        var adresseTwo = req.body.adresseTwo;
      }
      var codePostal = req.body.codePostal;
      var ville = req.body.ville;
      var modele = req.body.modele;
      var serie = req.body.serie;
      var interets = req.body.interets;

      // initiate nodemailer service with info from config file
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: config.via_address,
              pass: config.via_pw
          }
      });

      // build e-mail
      var mailOptions = {
      from: address,
      to: config.to_address,
      subject: 'Nouvel enregistrement de garantie',
      text: 'Civilité : ' + civilite + '\n' +
            'Nom : ' + nom + '\n' +
            'Prénom : ' + prenom + '\n' +
            'Adresse : ' + adresseOne + '\n' + adresseTwo + '\n' +
            'Code postal : ' + codePostal + '\n' +
            'Ville : ' + ville + '\n' +
            'Modèle : ' + modele + '\n' +
            'Numéro de série : ' + serie + '\n' +
            'Centres d\'intérêts : ' + JSON.stringify(interets)
      }

      // send email with nodemailer
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

      // get info from request
      var name = req.body.name;
      var address = req.body.email;

      // initiate nodemailer service with info from config file
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: config.via_address,
              pass: config.via_pw
          }
      });

      // build e-mail
      var mailOptions = {
      from: address,
      to: config.to_address,
      subject: 'Nouvel abonnement Newsletter Kronos',
      text: 'Nom : ' + name + '\n' +
            'Email : ' + address + '\n' +
            'Nouvel abonné de Newsletter'
      }

      // send email with nodemailer
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

    // search MongoDB for all Watch objects
    Watch.find(function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data); // return all data found
    });
  })

// SPECIFIC WATCH ::: POST
  .post(tokenMiddleware, function(req, res) {

    // tokenMiddleware will respond with admin true/false
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }

    // initialize Watch object
    var watch = new Watch();

    // grab info from request, apply to new Watch()
    watch.marque = req.body.watch.marque;
    watch.nom = req.body.watch.nom;
    watch.quantite = req.body.watch.quantite;
    watch.reference = req.body.watch.reference;
    watch.annee = req.body.watch.annee;
    watch.description = req.body.watch.description;
    watch.categorie = req.body.watch.categorie;
    watch.disponible = req.body.watch.disponible;
    watch.gamme = req.body.watch.gamme;
    watch.prix = req.body.watch.prix;
    watch.taille = req.body.watch.taille;
    watch.mouvement = req.body.watch.mouvement;
    watch.garantie = req.body.watch.garantie;
    watch.limite = req.body.watch.limite;
    watch.etancheite = req.body.watch.etancheite;
    watch.glace = req.body.watch.glace;
    watch.boitier = req.body.watch.boitier;
    watch.traitement = req.body.watch.traitement;
    watch.cadran = req.body.watch.cadran;
    watch.lunette = req.body.watch.lunette;
    watch.poids = req.body.watch.poids;

    // use MongoDB to save new Watch()
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

    // use id from params to find specific watch with MongoDB
    Watch.findById(req.params.id, function(err, watch) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(watch);
    });
  })
// SPECIFIC WATCH ::: PUT
  .put(tokenMiddleware, function(req, res) {

    // tokenMiddleware responds with admin true/false
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }

    // use id from params to find specific watch with MongoDB
    Watch.findById(req.params.id, function(err, watch) {
      if(err) {
        res.status(500).send(err);
      }

      // grab info from request and apply to Watch found by MongoDB
      watch.marque = req.body.watch.marque;
      watch.nom = req.body.watch.nom;
      watch.quantite = req.body.watch.quantite;
      watch.reference = req.body.watch.reference;
      watch.annee = req.body.watch.annee;
      watch.description = req.body.watch.description;
      watch.categorie = req.body.watch.categorie;
      watch.disponible = req.body.watch.disponible;
      watch.gamme = req.body.watch.gamme;
      watch.prix = req.body.watch.prix;
      watch.taille = req.body.watch.taille;
      watch.mouvement = req.body.watch.mouvement;
      watch.garantie = req.body.watch.garantie;
      watch.limite = req.body.watch.limite;
      watch.etancheite = req.body.watch.etancheite;
      watch.glace = req.body.watch.glace;
      watch.boitier = req.body.watch.boitier;
      watch.traitement = req.body.watch.traitement;
      watch.cadran = req.body.watch.cadran;
      watch.lunette = req.body.watch.lunette;
      watch.poids = req.body.watch.poids;


      // use MongoDB to save Watch object with any changes
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

    // tokenMiddleware responds with admin true/false
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }

    // use id from params to find and remove Watch from MongoDB
    Watch.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("Watch removed.");
    });
  });

// ================================================================================================

//                  WATCH PHOTOS API

// ================================================================================================

// FRONT IMAGE
router.route('/watch/add-front-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file; // get file from request
    file.name = file.name.replace(/\s/g, ""); // remove spaces from filename

    // prepare filename using uploadDate for name uniqueness
    // then remove all characters that could cause compatibility problems
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");

    var tempPath = file.path; // path of file during stream

    // targetPath is actual path, savePath is String sent to MongoDB for accessing image
    var targetPath = path.join(__dirname, "../public/images/watches/" + uploadDate + file.name);
    var savePath = "/images/watches/" + uploadDate + file.name;

    // place file at permanent address
    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }

      // use MongoDB to find Watch() object corresponding to id
      Watch.findById(req.params.id, function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }

        // point Watch() to photo
        watch.photo_front = savePath;

        // use MongoDB to save Watch() object with new photo
        watch.save(function(err, watch) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(watch);
        });
      });
    });
  });

// BACK IMAGE
router.route('/watch/add-back-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/watches/" + uploadDate + file.name);
    var savePath = "/images/watches/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      Watch.findById(req.params.id, function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        watch.photo_back = savePath;
        watch.save(function(err, watch) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(watch);
        });
      });
    });
  });

// 3/4 IMAGE
router.route('/watch/add-quarter-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/watches/" + uploadDate + file.name);
    var savePath = "/images/watches/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      Watch.findById(req.params.id, function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        watch.photo_quarter = savePath;
        watch.save(function(err, watch) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(watch);
        });
      });
    });
  });

// EXTRA IMAGES
router.route('/watch/add-extra-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/watches/" + uploadDate + file.name);
    var savePath = "/images/watches/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      Watch.findById(req.params.id, function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        watch.extra_photos.push(savePath);
        watch.save(function(err, watch) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(watch);
        });
      });
    });
  });

  router.route('/watch/rem-front-image/:id')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;

    Watch.findById(id, function(err, watch) {
      if(err) {
        return res.status(500).send(err);
      }
      var front_photo_address = path.join(__dirname, "../public" + watch.photo_front);
      console.log(front_photo_address);
      watch.photo_front = "";
      console.log("Photo removed.");
      watch.save(function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("Watch saved.");

        fs.remove(front_photo_address, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    });
  });

  router.route('/watch/rem-back-image/:id')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;

    Watch.findById(id, function(err, watch) {
      if(err) {
        return res.status(500).send(err);
      }
      var back_photo_address = path.join(__dirname, "../public" + watch.photo_back);
      watch.photo_back = "";
      console.log("Photo removed.");
      watch.save(function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("Watch saved.");

        fs.remove(back_photo_address, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    });
  });

  router.route('/watch/rem-quarter-image/:id')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;

    Watch.findById(id, function(err, watch) {
      if(err) {
        return res.status(500).send(err);
      }
      var quarter_photo_address = path.join(__dirname, "../public" + watch.photo_quarter);
      watch.photo_quarter = "";
      console.log("Photo removed.");
      watch.save(function(err, watch) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("Watch saved.");

        fs.remove(quarter_photo_address, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    });
  });

  router.route('/watch/rem-extra-image/:id/:photo')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id || !req.params.photo) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;
    var photo = "/images/watches/" + req.params.photo;

    Watch.findById(id, function(err, watch) {
      if(err) {
        console.log('Could not find by ID: ' + id);
        return res.status(500).send(err);
      }

      var photoPositionInArray = watch.extra_photos.indexOf(photo);

      if(photoPositionInArray >= 0) {
        console.log("Photo is in position " + photoPositionInArray);
        watch.extra_photos.splice(photoPositionInArray, 1);
        console.log("Photo removed from array.");
        watch.save(function(err, watch) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Watch saved.");

          var photoToDelete = path.join(__dirname, "../public" + photo);

          fs.remove(photoToDelete, function (err) {
            if(err) {
              return res.status(500).send(err);
            }
            console.log("Photo deleted.");
            return res.status(200).send({message: "Request complete."});
          });
        });
      }
      else {
        return res.status(500).send({message: "Could not find photo in array."});
      }
    });
  });


// ================================================================================================

//                  NEWSPOST

// ================================================================================================

router.route('/newspost')
// ALL NEWSPOST ::: GET
  .get(function(req, res) {
    NewsPost.find(function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data); // return all data found
    });
  })

// SPECIFIC NEWSPOST ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var newspost = new NewsPost();

    newspost.text = req.body.newspost.text;
    newspost.title = req.body.newspost.title;

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
    NewsPost.findById(req.params.id, function(err, newspost) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(newspost);
    });
  })
// SPECIFIC NEWSPOST ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    NewsPost.findById(req.params.id, function(err, newspost) {
      if(err) {
        return res.status(500).send(err);
      }
      if(!newspost) {
        return res.status(500).send(err);
      } else {
        newspost.text = req.body.newspost.text;
        newspost.title = req.body.newspost.title;

        newspost.save(function(err, newspost) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.send(newspost);
        });
      }
    })
  })
// SPECIFIC NEWSPOST ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    NewsPost.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("News post removed.");
    });
  });

// ================================================================================================

//                  NEWSPOST PHOTOS API

// ================================================================================================

router.route('/newspost/add-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/newsposts/" + uploadDate + file.name);
    var savePath = "/images/newsposts/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      NewsPost.findById(req.params.id, function(err, newspost) {
        if(err) {
          return res.status(500).send(err);
        }
        newspost.photos.push(savePath);
        newspost.save(function(err, newspost) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(newspost);
        });
      });
    });
  });
router.route('/newspost/rem-image/:id/:photo')
.delete(tokenMiddleware, function(req, res, next) {
  if(!req.params.id || !req.params.photo) {
    return res.status(400).send({message: "Bad request."});
  }
  var id = req.params.id;
  var photo = "/images/newsposts/" + req.params.photo;
  console.log(photo);

  NewsPost.findById(id, function(err, newspost) {
    if(err) {
      console.log('Could not find by ID: ' + id);
      return res.status(500).send(err);
    }

    var photoPositionInArray = newspost.photos.indexOf(photo);

    if(photoPositionInArray >= 0) {
      console.log("Photo is in position " + photoPositionInArray);
      newspost.photos.splice(photoPositionInArray, 1);
      console.log("Photo removed from array.");
      newspost.save(function(err, newspost) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("NewsPost saved.");

        var photoToDelete = path.join(__dirname, "../public" + photo);

        fs.remove(photoToDelete, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    }
    else {
      return res.status(500).send({message: "Could not find photo in array."});
    }
  });
});


// ================================================================================================

//                  CALENDARELEMENT

// ================================================================================================

router.route('/calendarelement')
// ALL CALENDARELEMENT ::: GET
  .get(function(req, res) {
    CalendarElement.find(function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data); // return all data found
    });
  })

// SPECIFIC CALENDARPOST ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var calendarelement = new CalendarElement();

    calendarelement.text = req.body.element.text;
    calendarelement.title = req.body.element.title;
    calendarelement.time = req.body.element.time;
    calendarelement.day = req.body.element.day;
    calendarelement.month = req.body.element.month;
    calendarelement.year = req.body.element.year;
    calendarelement.place = req.body.element.place;
    calendarelement.link = req.body.element.link;
    calendarelement.link_title = req.body.element.link_title;

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
    CalendarElement.findById(req.params.id, function(err, calendarelement) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(calendarelement);
    });
  })
// SPECIFIC CALENDARPOST ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    CalendarElement.findById(req.params.id, function(err, calendarelement) {
      if(err) {
        res.status(500).send(err);
      }

      calendarelement.text = req.body.element.text;
      calendarelement.title = req.body.element.title;
      calendarelement.time = req.body.element.time;
      calendarelement.day = req.body.element.day;
      calendarelement.month = req.body.element.month;
      calendarelement.year = req.body.element.year;
      calendarelement.place = req.body.element.place;
      calendarelement.link = req.body.element.link;
      calendarelement.link_title = req.body.element.link_title;

      calendarelement.save(function(err, calendarelement) {
        if(err) {
          return res.status(500).send(err);
        }
        return res.send(calendarelement);
      });
    })
  })
// SPECIFIC CALENDARPOST ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    CalendarElement.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("Calendar element removed.");
    });
  });

// ================================================================================================

//                  CALENDARELEMENT PHOTO API

// ================================================================================================

router.route('/calendarelement/add-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/calendarelements/" + uploadDate + file.name);
    var savePath = "/images/calendarelements/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      CalendarElement.findById(req.params.id, function(err, calendarelement) {
        if(err) {
          return res.status(500).send(err);
        }
        calendarelement.photo = savePath;
        calendarelement.save(function(err, calendarelement) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(calendarelement);
        });
      });
    });
  });

  router.route('/calendarelement/rem-image/:id')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;

    CalendarElement.findById(id, function(err, element) {
      if(err) {
        return res.status(500).send(err);
      }
      var photo_address = path.join(__dirname, "../public" + element.photo);
      element.photo = "";
      console.log("Photo removed.");
      element.save(function(err, element) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("Calendar Element saved.");

        fs.remove(photo_address, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    });
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
    User.findById(req.params.id, function(err, user) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(user);
    });
  })
// SPECIFIC USER ::: PUT
  .put(function(req, res) {

  })
// SPECIFIC USER ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    User.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("User removed.");
    });
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

    pressphoto.title = req.body.pressphoto.title;
    pressphoto.caption = req.body.pressphoto.caption;

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
    PressPhoto.findById(req.params.id, function(err, pressphoto) {
      if(err) {
        res.status(500).send(err);
      }

      pressphoto.title = req.body.pressphoto.title;
      pressphoto.caption = req.body.pressphoto.caption;

      pressphoto.save(function(err, pressphoto) {
        if(err) {
          return res.status(500).send(err);
        }
        return res.send(pressphoto);
      });
    })
  })
// SPECIFIC PRESSPHOTO ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    PressPhoto.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("Press photo removed.");
    });
  })

// ================================================================================================

//                  PRESSPHOTO PHOTO API

// ================================================================================================

router.route('/pressphoto/add-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/pressphotos/" + uploadDate + file.name);
    var savePath = "/images/pressphotos/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      PressPhoto.findById(req.params.id, function(err, pressphoto) {
        if(err) {
          return res.status(500).send(err);
        }
        pressphoto.photo = savePath;
        pressphoto.save(function(err, pressphoto) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(pressphoto);
        });
      });
    });
  });

  router.route('/pressphoto/rem-image/:id')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;

    PressPhoto.findById(id, function(err, pressphoto) {
      if(err) {
        return res.status(500).send(err);
      }
      var photo_address = path.join(__dirname, "../public" + pressphoto.photo);
      pressphoto.photo = "";
      console.log("Photo removed.");
      pressphoto.save(function(err, pressphoto) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("Press Photo saved.");

        fs.remove(photo_address, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    });
  });

// ================================================================================================

//                  AMBASSADOR

// ================================================================================================

router.route('/ambassador')
// ALL AMBASSADOR ::: GET
  .get(function(req, res) {
    Ambassador.find(function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data);
    });
  })
// SPECIFIC AMBASSADOR ::: POST
  .post(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    var ambassador = new Ambassador();

    ambassador.name = req.body.ambassador.name;
    ambassador.description = req.body.ambassador.description;

    ambassador.save(function(err, ambassador) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.send(ambassador);
    });
  })

router.route('/ambassador/:id')
// SPECIFIC AMBASSADOR ::: GET
  .get(function(req, res) {
    Ambassador.findById(req.params.id, function(err, ambassador) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(ambassador);
    });
  })
// SPECIFIC PRESSPHOTO ::: PUT
  .put(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
      Ambassador.findById(req.params.id, function(err, ambassador) {
      if(err) {
        res.status(500).send(err);
      }

      ambassador.name = req.body.ambassador.name;
      ambassador.description = req.body.ambassador.description;

      ambassador.save(function(err, ambassador) {
        if(err) {
          return res.status(500).send(err);
        }
          return res.send(ambassador);
      });
    })
  })
// SPECIFIC AMBASSADOR ::: DELETE
  .delete(tokenMiddleware, function(req, res) {
    if(!req.body.admin) {
      return res.status(401).send("You do not have admin privileges.")
    }
    Ambassador.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send("Ambassador removed.");
    });
  });

// ================================================================================================

//                  AMBASSADOR PHOTO API

// ================================================================================================

router.route('/ambassador/add-image/:id')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    file.name = file.name.replace(/\s/g, "");
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/ambassadors/" + uploadDate + file.name);
    var savePath = "/images/ambassadors/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      Ambassador.findById(req.params.id, function(err, ambassador) {
        if(err) {
          return res.status(500).send(err);
        }
        ambassador.photo = savePath;
        ambassador.save(function(err, ambassador) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(ambassador);
        });
      });
    });
  });

  router.route('/ambassador/rem-image/:id')
  .delete(tokenMiddleware, function(req, res, next) {
    if(!req.params.id) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;

    Ambassador.findById(id, function(err, ambassador) {
      if(err) {
        return res.status(500).send(err);
      }
      var photo_address = path.join(__dirname, "../public" + ambassador.photo);
      ambassador.photo = "";
      console.log("Photo removed.");
      ambassador.save(function(err, ambassador) {
        if(err) {
          return res.status(500).send(err);
        }
        console.log("Ambassador saved.");

        fs.remove(photo_address, function (err) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Photo deleted.");
          return res.status(200).send({message: "Request complete."});
        });
      });
    });
  });


module.exports = router;
