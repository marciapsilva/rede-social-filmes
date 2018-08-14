var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
  loadUserMessages();
  $('#post-btn').on('click', postUserMessage);
  $('.search').on('click', showUsers);
  $('.your-posts').on('click', showMyPosts);
  $('.friend-posts').on('click', showMyFriendsPosts);
  $('.all-posts').on('click', showAllPosts);
})

function postUserMessage() {
  event.preventDefault();

  var title = $('#postModalLongTitle').val();
  var message = $('#post-textarea').val();
  var type = $('.type').val();

  database.ref('posts/' + USER_ID).push({
    title: title,
    message: message,
    type: type,
    date: Date.now()
  });

  showInFeed(message, title);
}

function showInFeed(message, title) {
  
  var postBox = document.createElement('div')
  var postTitle = '<h3>' + title + '</h3>';
  var postMessage = '<p>' + message + '</p>';
  if (title === undefined){
    title = '';
  };
  $(postBox).addClass("post-feed");
  $(postBox).html(postTitle + postMessage);
  $('#feed').prepend(postBox);
}

function loadUserMessages() {

  var posts = [];
  database.ref('posts/').once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        database.ref('posts/' + childSnapshot.key).once('value')
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              // console.log(childSnapshot.key);
              var userPost = childSnapshot.val();
              var postDate = userPost.date;
              posts.push(postDate);
              posts.sort();
            })

            $(posts).map(function(index, value) {
              database.ref('posts/').once('value')
                .then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {
                    database.ref('posts/' + childSnapshot.key).once('value')
                      .then(function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                          var userPost = childSnapshot.val();
                          var postDate = userPost.date;
                          var getPostTitle = userPost.title;
                          var userMessage = userPost.message;
                          if (getPostTitle === undefined){
                            getPostTitle = '';
                          };
 
                          if (value === postDate) {
                            var postBox = document.createElement('div');
                            var postTitle = '<h3>' + getPostTitle + '</h3>';
                            var postMessage = '<p>' + userMessage + '</p>';
                            $(postBox).addClass("post-feed");
                            $(postBox).html(postTitle + postMessage);
                            $('#feed').append(postBox);
                          }
                        })
                      })
                  })
                })
            })
          })
      })
    })
  } 

function showUsers() {

  database.ref('users/').once('value')
    .then(function(snapshot) {
      clearSearch();
      snapshot.forEach(function(childSnapshot) {
        var childSnapshotKey = childSnapshot.key;
        childSnapshot.forEach(function(userId){
          var childData = userId.val()
          var usernameData = childData.username;
          var userBox = document.createElement('div');
          var usernameTitle = '<p>' + usernameData + '</p>';
          var usernameBtn = '<button type="button"  onclick="followUser(event)" class="btn follow-btn btn-primary btn-sm" id="' + childSnapshotKey + '">Seguir</button>'
          $(userBox).addClass("search-user");
          $(userBox).html(usernameTitle + usernameBtn);
          $('#search-area').prepend(userBox);
          $('#feed').hide();
        })
      })
    }); 
}

function clearSearch() {
  $('#search-area').empty();
}

function clearFeed() {
  $('#feed').empty();
}

function followUser() {
  var clickTarget = event.target.id;

  database.ref('friends/' + USER_ID).push({
    follow: clickTarget,
  });
};

function showMyPosts() {
  clearFeed();

  database.ref('posts/' + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var postObject = childSnapshot.val();
        var userPostTitle = postObject.title;
        var userMessage = postObject.message;
        if (userPostTitle === undefined){
          userPostTitle = '';
        };
        var userTitle =  '<h3>' + userPostTitle + '</h3>';
        var postBox = document.createElement('div');
        var postMessage = '<p>' + userMessage + '</p>';
        $(postBox).addClass("post-feed");
        $(postBox).html(userTitle + postMessage);
        $('#feed').prepend(postBox);
      })
    })
}

function showMyFriendsPosts() {
  clearFeed();
  alert('dos amigos');
}

function showAllPosts() {
  clearFeed();
  alert('todos');
}
