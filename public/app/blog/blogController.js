
var cleanupAngularObject = function(value) {
    if (value instanceof Array) {
        for (var i = 0; i < value.length; i++) {
            cleanupAngularObject(value[i]);
        }
    }
    else if (value instanceof Object) {
        for (property in value) {
            if (/^\$+/.test(property)) {
                delete value[property];
            }
            else {
                cleanupAngularObject(value[property]);
            }
        }
    }
};

/*
 * ADD POST CTRL
 * */
app.controller('AddPostCtrl', function ($scope, $rootScope, $kinvey, $location, User) {
    $rootScope.navLocation = 'blog';
    $scope.tags = [];
    $scope.post = {
        body: '',
        tags: [],
        pics: [],
        live: false
    };

    $scope.tag = {
        name: '',
        color: '',
        textColor: '',
        datetime: new Date()
    };

    var onLoad = function () {
        var promise = $kinvey.DataStore.find('Tags');
        promise.then(function (tags) {
            $scope.tags = tags;
        });
    };

    if (User.loaded) onLoad();
    User.addObserver(onLoad);

    $scope.addNewTag = function (newTag) {
        var savedPromise = $kinvey.DataStore.save('Tags', newTag);
        savedPromise.then(function () {
            $scope.post.tags.push(newTag);
            $scope.tag = {
                name: '',
                color: '',
                datetime: new Date()
            };
            onLoad();
        });
    };

    $scope.addTag = function (tag) {
        $scope.post.tags.push(tag);
    };

    $scope.removeTag = function (index) {
        $scope.post.tags.splice(index, 1);
    };

    function saveImage (pics, index, post, cb) {
        var fileUploadedPromise = $kinvey.File.upload(pics[index]);
        fileUploadedPromise.then(function (res) {
            post.pics.push({
                _type: 'KinveyFile',
                _id: res._id
            });
            if (pics.length > index+1) saveImage(pics, index+1, post, cb);
            else cb();
        });
    }

    $scope.quickSave = function (post) {
        $scope.postFormSubmit(post, false)
    };
    $scope.postFormSubmit = function (post, changePath) {
        if (changePath === undefined) changePath = true;

        var pics = document.getElementById('postPics').files;
        cleanupAngularObject(post);

        function save () {
            post.username = $rootScope.user.username;
            post.datetime = new Date();
            post.comments = [];
            post.shares = [];
            post.groups = [];
            var postSavedPromise = $kinvey.DataStore.save('Blogs', post);

            postSavedPromise.then(function (){
                if (changePath) $location.path('/');
            });

        }
        if (pics) {
            saveImage(pics, 0, post, function () {
                save();
            });

        } else {
            save();

        }
    };
});

app.controller('EditPostCtrl', function ($scope, $rootScope, $kinvey, $location, $routeParams, User) {
    $rootScope.navLocation = 'blog';
    $scope.tags = [];
    $scope.post = {
        body: '',
        tags: [],
        pics: [],
        live: false
    };

    $scope.tag = {
        name: '',
        color: '',
        textColor: '',
        datetime: new Date()
    };

    var loadPost = function () {
        var blog = $kinvey.DataStore.get('Blogs', $routeParams.post);
        blog.then(function(post){
            if (post.username !== $rootScope.user.username) {
                $location.path('/');
            }
            $scope.post = post;
        });

        var tags = $kinvey.DataStore.find('Tags');
        tags.then(function (tags) {
            $scope.tags = tags;
        });

    };

    if (User.loaded) loadPost();
    User.addObserver(loadPost);

    $scope.addNewTag = function (newTag) {
        var savedPromise = $kinvey.DataStore.save('Tags', newTag);
        savedPromise.then(function () {
            $scope.post.tags.push(newTag);
            $scope.tag = {
                name: '',
                color: '',
                datetime: new Date()
            };
            onLoad();
        });
    };

    $scope.addTag = function (tag) {
        $scope.post.tags.push(tag);
    };

    $scope.removeTag = function (index) {
        $scope.post.tags.splice(index, 1);
    };

    function saveImage (pics, index, post, cb) {
        var fileUploadedPromise = $kinvey.File.upload(pics[index]);
        fileUploadedPromise.then(function (res) {
            post.pics.push({
                _type: 'KinveyFile',
                _id: res._id
            });
            if (pics.length > index+1) saveImage(pics, index+1, post, cb);
            else cb();
        });
    }

    $scope.quickSave = function (post) {
        $scope.postFormSubmit(post, false)
    };
    $scope.postFormSubmit = function (post, changePath) {
        if (changePath === undefined) changePath = true;
        if (post.username !== $rootScope.user.username) {
            $location.path('/');
        }
        var pics = document.getElementById('postPics').files;
        cleanupAngularObject(post);

        function save () {
            if (!post.datetime) post.datetime = new Date();
            var postSavedPromise = $kinvey.DataStore.save('Blogs', post);

            postSavedPromise.then(function (){
                if (changePath) $location.path('/');
            });

        }
        if (pics) {
            saveImage(pics, 0, post, function () {
                save();
            });

        } else {
            save();

        }
    };

});

app.controller('BlogCtrl', function ($scope, $rootScope, $kinvey, User, $location) {
    $rootScope.navLocation = 'blog';
    $scope.showSideBar = false;
    $scope.search = {
        body: '',
        tags: [],
        live: true
    };

    $scope.addTagSearch = function (tagName, index) {
        var foundDup = false;
        for (var i in $scope.search.tags) {
            if ($scope.search.tags[i].name === tagName) foundDup = true;
        }
        if (foundDup) {
            removeTag(index)
        } else {
            $scope.search.tags.push({name: tagName});
        }

    };
    $scope.tagSelected = function (tagName) {
        for (var i in $scope.search.tags) {
            if ($scope.search.tags[i].name === tagName) return true;
        }
        return false;
    };

    var removeTag = function (index) {
        $scope.search.tags.splice(index, 1);
    };

    $scope.posts = [];
    $scope.tags = [];
    $scope.groups = [];
    $scope.labels = [];
    $scope.spinnerShowing = true;

    var loadBlogs = function () {
        var BlogsP = $kinvey.DataStore.find('Blogs');
        BlogsP.then(function(posts){
            $scope.posts = posts;
        });

        var TagsP = $kinvey.DataStore.find('Tags');
        TagsP.then(function(tags){
            $scope.tags = tags;
        });

        var GroupsP = $kinvey.DataStore.find('Labels');
        GroupsP.then(function(groups){
            $scope.groups = groups;
        });

        var LabelsP = $kinvey.DataStore.find('Labels');
        LabelsP.then(function(labels){
            $scope.labels = labels;
        });

        $scope.spinnerShowing = false;

    };

    if (User.loaded) loadBlogs();
    User.addObserver(loadBlogs);

});



/*
 * POST CTRL
 * */
app.controller('PostCtrl', function ($scope, $rootScope, $routeParams, $kinvey, User) {
    $rootScope.navLocation = 'blog';
    $scope.selectedPost = {
        body: '',
        pic: ''
    };

    var loadPost = function () {
        var blog = $kinvey.DataStore.get('Blogs', $routeParams.post);
        blog.then(function(posts){
            $scope.selectedPost = posts;
        });

    };

    if (User.loaded) loadPost();
    User.addObserver(loadPost);


    $scope.showAddComment = false;
    $scope.showComments = false;
    $scope.commentError = '';
    $scope.comment = {
        subject: '',
        comment: '',
        username: '',
        updated: new Date()
    };
    $scope.addComment = function (newComment, username) {
        newComment.username = username;
        newComment.updated = new Date();

        if(!$scope.selectedPost.comments) $scope.selectedPost.comments = [];
        $scope.selectedPost.comments.push(newComment);

        var saved = $kinvey.DataStore.save('Blogs', $scope.selectedPost);
        saved.then(function(posts){
            $scope.selectedPost = posts;
            $scope.showAddComment = false;
        }, function (err) {
            $scope.commentError = err.msg;
        });

    };
    $scope.removeComment = function (index) {
        $scope.selectedPost.comments.splice(index, 1);

        var saved = $kinvey.DataStore.save('Blogs', $scope.selectedPost);
        saved.then(function(posts){
            $scope.selectedPost = posts;
        }, function (err) {
            alert(err.msg);
        });
    };
});

app.controller('ManageCtrl', function ($scope, $rootScope, $kinvey, User, $location) {
    $rootScope.navLocation = 'blog';

    $scope.posts = [];
    $scope.tags = [];
    $scope.groups = [];
    $scope.labels = [];
    $scope.spinnerShowing = true;

    var loadBlogs = function () {
        var BlogsP = $kinvey.DataStore.find('Blogs');
        BlogsP.then(function(posts){
            $scope.posts = posts;
        });

        $scope.spinnerShowing = false;

    };

    if (User.loaded) loadBlogs();
    User.addObserver(loadBlogs);

    $scope.deletePost = function (id, index) {
        var promise = $kinvey.DataStore.destroy('Blogs', id);
        promise.then(function () {
            $scope.posts.splice(index, 1);
        });
    };

    $scope.editPost = function (id) {
        $location.path('/editPost/'+id);
    };

});
