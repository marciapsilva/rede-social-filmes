var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
  showAllPosts();
  $('#post-btn').on('click', postUserMessage);
  $('.menu-title').on('click', clearPostModal);
  $('.search').on('click', showUsers);
  $('.signout').on('click', signout);
  $('.your-posts').on('click', showMyPosts);
  $('.friend-posts').on('click', showMyFriendsPosts);
  $('.all-posts').on('click', showAllPosts);
  $('.friends').on('click', showMyFriends);
  $('#feed').on('click', '.delete-btn', deletePostModal);
  $('#feed').on('click', '.edit-btn', editPostModal);
  $('body').on('click', '#edit-post', editPost);
  $('body').on('click', '#cancel-edit', removeEditModal);
})

function closeEditModal(event) {
  event.preventDefault();
  alert('what');
  $('.edit-post-modal').remove();
}

function postUserMessage(event) {
  event.preventDefault(event);

  var title = $('#post-modal-long-title').val();
  var message = $('#post-textarea').val();
  var type = $('.type').val();
  
  database.ref(`users/` + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(friendsUserFollows) {
        var username = friendsUserFollows.val().username;

        database.ref('posts/' + USER_ID).push({
          title: title,
          message: message,
          type: type,
          date: Date.now(),
          author: username
        });
      })
    })

  showMyPosts();
  $('#post-modal').modal('hide');
}

function editPostModal(event) {
  event.preventDefault();
  var postId = $(this).attr("data-post-id");

  database.ref(`posts/${USER_ID}/${postId}`).once('value')
  .then(function(snapshot) {
    var messageEdit = snapshot.child("message").val();
    var titleEdit = snapshot.child("title").val();
    
    var editModal = `
    <div class="modal fade edit-post-modal" data-post-id="${postId}" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <input class="modal-title form-control" id="edit-title" value="${titleEdit}"></input>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="edit-message-form">
              <div>
                <textarea class="modal-body form-control" id="edit-textarea" data-post-id="${postId}">${messageEdit}</textarea>
              </div>
              <div>
                <button class="btn btn-primary" id="edit-post">Sim</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancel-edit">Não</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `
    $(editModal).modal('show');
    
  }); 
}

function editPost(event) {
  event.preventDefault();

  var newTitle = $('#edit-title').val();
  var newMessage = $('#edit-textarea').val();
  var postId = $('#edit-textarea').attr('data-post-id');
  var originalTitle = $(`h3[data-post-id="${postId}"]`);
  var originalMessage = $(`p[data-post-id="${postId}"]`);

  originalTitle.text(newTitle);
  originalMessage.text(newMessage);

  removeEditModal(event);
  editDatabase(postId, newTitle, newMessage);
}

function editDatabase(postId, newTitle, newMessage) {
  database.ref(`posts/${USER_ID}/${postId}`).update({
    title: newTitle,
    message: newMessage
  })
}

function removeEditModal(event) {
  event.preventDefault();

  var postId = $('#edit-textarea').attr('data-post-id');
  $(`.edit-post-modal[data-post-id="${postId}"]`).modal('hide');
  $(`.edit-post-modal[data-post-id="${postId}"]`).remove();
  $('.modal-backdrop').remove();
}

function deletePostModal(event) {
  event.preventDefault();

  var postId = $(this).attr("data-post-id");
  var targetElement = event.target;
  var elementParent = targetElement.parentElement;
  var elementGrandParent = elementParent.parentElement;

  $('#delete-post-modal').modal('show');
  $('#delete-post').click(function(event){
    deletePost(event, elementGrandParent);
    deletePostInDatabase(postId);
  }); 
}

function deletePost(event, elementGrandParent) {
  event.preventDefault();

  elementGrandParent.remove();
  $('#delete-post-modal').modal('hide');
}

function deletePostInDatabase(postId) {
  database.ref(`posts/${USER_ID}/${postId}`).remove();
}

function showUsers() {
  // LOOP PARA ACHAR OS AMIGOS
  database.ref('friends/' + USER_ID).once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(friendsUserFollows) {
      var userFollows = friendsUserFollows.val().follow;
      // mostra os amigos
      // console.log(userFollows)     

      // LOOP PARA ACHAR USUÁRIOS
      database.ref('users/').once('value')
        .then(function(snapshot) {
          clearSearch();
          snapshot.forEach(function(childSnapshot) {        
            var childSnapshotKey = childSnapshot.key;
            childSnapshot.forEach(function(userId){
              var childData = userId.val()
              var usernameData = childData.username;     
              
              if (childSnapshotKey !== USER_ID || childSnapshotKey !== userFollows) {
                var userBox = document.createElement('div');
                var usernameTitle = '<p>' + usernameData + '</p>';
                var usernameBtn = '<button type="button"  onclick="followUser(event)" class="btn follow-btn btn-primary btn-sm" id="' + childSnapshotKey + '">Seguir</button>'
                var userProfile = '<img class="profile-picture" src="assets/images/purple-profile.png">'
                $(userBox).addClass("search-user");
                $(userBox).html(userProfile + usernameTitle + usernameBtn);
                $('#search-area').prepend(userBox);
                $('#feed').hide();
              }
            });
          });
        }); 
      });
    });
}

function signout() {
  firebase.auth().signOut()
    .then(function() {
      window.location = 'index.html';
    })
    .catch(function(error) {
    })
}

//  tentativa de buscar amigos em outra função

// console.log(alreadyFollowed())
// function alreadyFollowed() {
//   database.ref('friends/' + USER_ID).once('value')
//   .then(function(snapshot) {
//     snapshot.forEach(function(friendsUserFollows) {
//       var userFollows = friendsUserFollows.val().follow;
//       return userFollows
//     });
//   });
// }

function showMyFriends() {
  clearSearch();
  var friendId;
  database.ref('friends/' + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(friendsUserFollows) {
        database.ref('users/').once('value')
          .then(function(snapshot) {
            snapshot.forEach(function(userId) {
              database.ref('users/' + userId.key).once('value')
                .then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {

                    friendId = friendsUserFollows.val().follow;
                    
                    if (friendId === userId.key) {
                      var usernameData = childSnapshot.val().username;
                      var userBox = document.createElement('div');
                      var usernameTitle = '<p>' + usernameData + '</p>';
                      var userProfile = '<img class="profile-picture" src="assets/images/purple-profile.png">'
                      $(userBox).addClass("search-user");
                      $(userBox).html(userProfile + usernameTitle);
                      $('#search-area').prepend(userBox);
                      $('#feed').hide();
                    }
                  })
                })
            })
          })
      })
    })
}

function clearSearch() {
  $('#search-area').empty();
}

function clearFeed() {
  $('#feed').empty();
}

function clearPostModal() {
  $('#post-modal-long-title').val('');
  $('#post-textarea').val('');
}

function followUser() {
  var clickTarget = event.target.id;
  
    database.ref('friends/' + USER_ID).push({
      follow: clickTarget,
  });
  
};

function showMyPosts() {
  $('#feed').show();
  clearFeed();
  clearSearch();

  database.ref('posts/' + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var postId = childSnapshot.key;
        var userPostTitle = childSnapshot.val().title;
        var userMessage = childSnapshot.val().message;
        var postAuthor = childSnapshot.val().author;
        var postType = childSnapshot.val().type;
        var postUser = snapshot.key;

        postTemplate(postId,  postUser, userPostTitle, userMessage, postAuthor, postType);
      })
    })
}

function postTemplate(postId,  postUser, userPostTitle, userMessage, postAuthor, postType) {
  if (userPostTitle === undefined){
    userPostTitle = '';
  };

  if (postType === 'public') {
    postType = 'Público'          
  } else if (postType === 'friends') {
    postType = 'Amigos'
  }

  var templateOne = `
  <div class="post-feed">
    <div class="post-header">
      <h5>${postAuthor}</h5>
      <p>${postType}<p>
      <h3 data-post-id=${postId}>${userPostTitle}</h3>
  `   
  var templateTwo = `
      <span class="edit-btn icon-pencil" data-post-id=${postId}></span>
      <span class="delete-btn" data-post-id=${postId}>&times;</span>
  `
  var templateThree = `
    </div>
    <div>
      <p class="p-message" data-post-id="${postId}">${userMessage}</p>
    </div>
  </div>
`
  if (postUser === USER_ID) {
    $('#feed').prepend(templateOne + templateTwo + templateThree);
  } else {
    $('#feed').prepend(templateOne + templateThree);
  }

}

function showMyFriendsPosts() {
  $('#feed').show();
  clearFeed();
  clearSearch();

  database.ref('friends/' + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(friendsUserFollows) {
        database.ref('posts/').once('value')
          .then(function(snapshot) {
            snapshot.forEach(function(userId) {
              database.ref('posts/' + userId.key).once('value')
                .then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {

                    var friendId = friendsUserFollows.val().follow;    
                    var postType = childSnapshot.val().type;

                    if (friendId === userId.key) {
                      if (postType === 'public' || childSnapshot.val().type === 'friends') {
                        var postId = childSnapshot.key;
                        var postAuthor = childSnapshot.val().author;
                        var userPostTitle = childSnapshot.val().title;
                        var userMessage = childSnapshot.val().message;
                        var postUser = snapshot.key;

                        postTemplate(postId, postUser, userPostTitle, userMessage, postAuthor, postType)
                      }
                    }
                  })
                })
            })
          })
      })
    })
}

function showAllPosts() {
  clearFeed();
  showMyFriendsPosts();
  showMyPosts();
}

