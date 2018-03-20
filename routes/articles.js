const express = require('express');
const router =express.Router();
const Article = require('../models/article');
//add post
router.get("/add",function(req,res){
  res.render('add');
});
router.post("/add",function(req,res){
  const article = new Article();
  article.title=req.body.title;
  article.body=req.body.body;
  article.author=req.body.author;
  article.save(function(err){
    if(err){
      console.log(err);
    }
    else {
      req.flash('success',"article added");
      res.redirect('/');
    }

  })
  console.log("you are successfully submitted");
});

//add route
router.post("/",function(req,res) {
Article.create(req.body).then(function(arti) {
  res.send(arti);

});
});
router.get('/edit/:id',function(req,res){
  Article.findById(req.params.id).then(function(article,err){
      if(err)
      {
        console.log(err);
      }
      else {
          res.render('edit_article',{
            title:"edit",
            article:article
          });
      };
    });
  });
  router.post("/edit/:id",function(req,res){
    let article = {};
    article.title=req.body.title;
    article.body=req.body.body;
    article.author=req.body.author;
    let query = {_id:req.params.id}
    Article.update(query,article,function(err){
      if(err){
        console.log(err);
      }
      else {
        req.flash('success','article added');
        res.redirect('/');
      }

    })
    console.log("you have successfully edited");
  });
  router.delete('/:id',function(req,res){
    let query={_id:req.params.id}
    Article.remove(query,function(err){
    if (err) {
      console.log(err);

    };
      res.send('Success');
    });
  });
  //get single articles
  router.get('/:id',function(req,res){
    Article.findById(req.params.id).then(function(article,err){
        if(err)
        {
          console.log(err);
        }
        else {
            res.render('article',{
              title:"Acepirit",
              article:article
            });
        };
      });
    });
module.exports=router;
