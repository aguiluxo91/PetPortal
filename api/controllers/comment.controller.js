const createError = require('http-errors');
const Comment = require("../models/comment.model");

module.exports.new = (req, res, next) => {
  const { id } = req.params;
  Subjectcomment.findById(id)
    .then((Subjectcomment) => {
      res.render("comments/new", { Subjectcomment });
    })
    .catch((error) => {
      console.log(error);
      next();
    });
};

module.exports.createComment = (req, res, next) => {
  const { id } = req.params;

  function renderWithErrors(errors) {
    console.log(errors);
    res.status(400).render("comments/new", {
      comment: req.body,
      errors: errors,
      Subjectcomment: Subjectcomment,
    });
  }

  req.body.createdBy = res.locals.User.name;
  req.body.idUser = id;
  console.log(req.body);
  Comment.create(req.body)
    .then((comment) => {
      Comment.find({ idUser: id })
        .then((comments) => {
          console.log(
            "---- encuentra los comentarios y los busca por el id----"
          );
          let rates = 0;
          for (let comment of comments) {
            rates += comment.rating;
          }
          const newRate = rates / comments.length;
          const newRateShort = newRate.toFixed(1);

          Subjectcomment.findByIdAndUpdate(id, { rating: newRateShort })
            .then((Subjectcomment) => {
              res.render(`Subjectcomments/detail`, { Subjectcomment });
            })
            .catch((error) => {
              console.log(
                "---CREATE COMMENT--- error al encontrar el producto"
              );
              renderWithErrors(error);
            });
        })
        .catch((error) => console.errors(error));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log("---CREATE COMMENT--- error al crear el comentario");
        renderWithErrors(error.errors);
      } else {
        next(error);
      }
    });
};
