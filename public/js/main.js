var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
  $('#post-btn').on('click', postUserMessage);
  $('.menu-title').on('click', clearPostModal);
  $('.search').on('click', showUsers);
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

  database.ref('posts/' + USER_ID).push({
    title: title,
    message: message,
    type: type,
    date: Date.now()
  });

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
    console.log(titleEdit);
    
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
                $(userBox).addClass("search-user");
                $(userBox).html(usernameTitle + usernameBtn);
                $('#search-area').prepend(userBox);
                $('#feed').hide();
              }
            });
          });
        }); 
      });
    });
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
                      $(userBox).addClass("search-user");
                      $(userBox).html(usernameTitle);
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
        var postObject = childSnapshot.val();
        var userPostTitle = postObject.title;
        var userMessage = postObject.message;
        if (userPostTitle === undefined){
          userPostTitle = '';
        };
        var template = `
        <div class="post-feed">
          <div class="post-header">
            <h3 data-post-id=${postId}>${userPostTitle}</h3>
            <span class="edit-btn icon-pencil" data-post-id=${postId}></span>
            <span class="delete-btn" data-post-id=${postId}>&times;</span>
          </div>
          <div>
            <p data-post-id="${postId}">${userMessage}</p>
          </div>
        </div>
      `
        $('#feed').prepend(template);
      })
    })
}

var results;
function showMyFriendsPosts() {
  $('#feed').show();
  clearFeed();
  clearSearch();

  var friendId;
  // PERCORRENDO OS AMIGOS QUE O USUÁRIO SEGUE NO BANCO DE DADOS
  database.ref('friends/' + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(friendsUserFollows) {
        //PERCORRENDO OS POSTS DE TODOS OS USUÁRIOS PARA ENCONTRAR OS POSTS DOS AMIGOS NO BANCO DE DADOS
        //PRIMEIRO LOOP PARA ENCONTRAR AS IDS DOS USUÁRIOS
        database.ref('posts/').once('value')
          .then(function(snapshot) {
            snapshot.forEach(function(userId) {
              //SEGUNDO LOOP PARA ENCONTRAR OS TYPES E MESSAGES DE CADA USUÁRIO
              database.ref('posts/' + userId.key).once('value')
                .then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {

                    friendId = friendsUserFollows.val().follow;    
                    postType = childSnapshot.val().type;
                    postDate = childSnapshot.val().date;

                    if (friendId === userId.key) {
                      if (postType === 'public' || childSnapshot.val().type === 'friends') {
                        results = pushPostsIntoArray(postDate);


                        var userMessage = childSnapshot.val().message;
                        var postBox = document.createElement('div');
                        var postMessage = '<p>' + userMessage + '</p>';
                        $(postBox).addClass("post-feed");
                        $(postBox).html(postMessage);
                        $('#feed').prepend(postBox);
                      }
                    }
                  })
                })
            })
          })
      })
    })
}

var lista = [];
function pushPostsIntoArray(postDate) {
  lista.push(postDate);
  lista.sort();
  return lista;
}

function showAllPosts() {
  clearFeed();
  alert('todos');
}

