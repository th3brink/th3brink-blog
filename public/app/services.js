var services = angular.module('th3blog.services', []);

//var promise = Kinvey.init({
//  appKey    : 'kid_eVISsVhFfM',
//  appSecret : 'e90f003a9a1d499a9895b5e0ffd9dec8'
//});


services.factory('dataModel', function () {

  var self = {
    user: '',
    tags: [],
    posts: [],
    userMessage: '',
    init: function (finished) {
      promise.then(function(activeUser) {
        self.user = activeUser;

        var allBlogsPromise = Kinvey.DataStore.get('Blogs', null, {
          success: function (posts) {
            self.posts = posts;
            if (finished) finished(posts);

          }
        });

        var tagsPromise = Kinvey.DataStore.get('Tags', null, {
          success: function (tags) {
            self.tags = tags;

          }
        });
      });
    },
    savePost: function (post) {
      var postPic = document.getElementById('postPic').files[0];

      function save () {
        post.username = self.user.username;
        post.datetime = new Date();
        post.comments = [];
        post.shares = [];
        var postSavedPromise = Kinvey.DataStore.save('Blogs', post, {
          success: function(response) {
            self.posts.push(response);

          }
        });

      }
      if (postPic) {
        var fileUploadedPromise = Kinvey.File.upload(postPic);
        fileUploadedPromise.then(function (res) {
          post.pic = {
            _type: 'KinveyFile',
            _id: res._id

          };
          save();

        });
      } else {
        save();

      }
    },
    deletePost: function (post, index) {
      if(!post._id) return;
      var promise = Kinvey.DataStore.destroy('Blogs', post._id, {
        success: function(response) {
          self.posts.splice(index, 1);
          //self.userMessage = response
          //setTimeout(1000,function (){self.userMessage = '';})
        }
      });
    }
  };

  return self;
});

/*
* Words have {
*   datetime: ''
*   title: ''
*   definition: ''
*   priority: //0,1,2,3,4,5
*   status: //learning, etc
* }
* */

services.factory('baseModel', function () {

  var init = function (_which, _finished) {
    var self = {
      list: [],
      ready: false,
      init: function (finished) {
//        console.log(promise)
        promise.then(function(activeUser) {
          var wordsPromise = Kinvey.DataStore.get(_which, null, {
            success: function (list) {
              self.list = list;
              if (finished) finished(self.list);
            }
          });
        });
      },
      save: function (entity, newEn) {
        var postSavedPromise = Kinvey.DataStore.save(_which, entity, {
          success: function(response) {
            if (newEn) self.list.push(response);

          }
        });
      },
      remove: function (entity, index) {
        if(!entity._id) return;
        var promise = Kinvey.DataStore.destroy(_which, entity._id, {
          success: function(response) {
            self.list.splice(index, 1);
            //self.userMessage = response
            //setTimeout(1000,function (){self.userMessage = '';})
          }
        });
      }
    };
    self.init(_finished);
    return self;
  };

  return init;
});

