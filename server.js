const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const port = 3333;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/noteDb");

const Note = mongoose.model("Note", {
  date: String,
  authour: String,
  category: String,
  body: String,
});

app.get("/", (req, res) => {
  Note.find({}, (err, note) => {
    res.render("index", { note : note });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create_note", (req, res) => {
  console.log(req.body);
  const note = new Note(req.body);
  note.save();

  Note.find({}, (err, note) => {
    if (!err) {
      console.log(note);
      //   res.render("index", { note: note });
      res.redirect("/");
    } else {
      console.log("error is ", err);
    }
  });
});

app.get("/delete/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id, (err) => {
    err ? console.error(err) : console.log("deleted successfully");

    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  Note.find({ _id: req.params.id }, (err, note) => {
    if (!err) {
      res.render("update", { memo: note });
    } else {
      console.table(err);
    }
  });
});

app.post("/edit/:id", (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    (err, result) => {
      if (!err) {
        res.redirect("/");
        console.log("edited successfully !");
      } else {
        console.log(err);
      }
    }
  );
});

app.listen(port, () => {
  console.log("listening on port 3333");
});
