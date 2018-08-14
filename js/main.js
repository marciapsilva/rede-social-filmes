var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
  loadUserMessages();
  $('#post-btn').on('click', postUserMessage);
  $('.search').on('click', showUsers);
  $('.follow-btn').on('click', followUser);
})


function postUserMessage() {
  event.preventDefault();

  var message = $('#post-textarea').val();
  var type = $('.type').val();

  database.ref('posts/' + USER_ID).push({
    message: message,
    type: type,
  });

  showInFeed(message);
}

function showInFeed(message) {
  var postBox = document.createElement('div')
  var postMessage = '<p>' + message + '</p>';
  $(postBox).addClass("post-feed");
  $(postBox).html(postMessage);
  $('#feed').prepend(postBox);
}

function loadUserMessages() {

  database.ref('posts/' + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        var postBox = document.createElement('div')
        var postMessage = '<p>' + childData.message + '</p>';
        $(postBox).addClass("post-feed");
        $(postBox).html(postMessage);
        $('#feed').prepend(postBox);
      })
    })
}

function showUsers() {

  database.ref('users/').once('value')
    .then(function(snapshot) {
      clearSearch();
      var snapshotVal = snapshot.val();
      for (var i in snapshotVal) {
        var idNumber = i;
      }
      snapshot.forEach(function(childSnapshot) {
        childSnapshot.forEach(function(userId){
          var childData = userId.val()
          var usernameData = childData.username;
          var userBox = document.createElement('div');
          var usernameTitle = '<p>' + usernameData + '</p>';
          var usernameBtn = '<button type="button" class="btn follow-btn btn-primary btn-sm" id="' + idNumber + '">Seguir</button>'
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

function followUser() {
  alert("aaa");
  // var btnId = $(this).attr('id');
  // console.log(btnId);
  // database.ref('friends/' + USER_ID).push({
  //   follow: btnId
  // });
};

