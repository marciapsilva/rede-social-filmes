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
  // $('body').on('click', '#edit-post', getNewTextValue);
  $('body').on('click', '#cancel-edit', closeEditModal);
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
  // showInFeed(message, title);
}

function editPostModal(event) {
  event.preventDefault();
  var postId = $(this).attr("data-post-id");

  database.ref('posts/' + USER_ID + '/' + postId).once('value')
  .then(function(snapshot) {
    var messageEdit = snapshot.child("message").val();
    var titleEdit = snapshot.child("title").val();

    // console.log(postId);
    // console.log(snapshot.key);

    var editModal = `
    <div class="modal fade edit-post-modal" data-post-id="${postId}" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <input class="modal-title form-control" id="edit-title" value=${titleEdit}></input>
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
    // console.log($('#edit-textarea').attr('data-post-id'));
    $(editModal).modal('show');
    $('body').on('click', '#edit-post', function(event, postId) {
      getNewTextValue(event, postId);
    });

  }); 
}

function getNewTextValue(event, postId) {
  event.preventDefault();

  var newTitle = $('#edit-title').val();
  var newMessage = $('#edit-textarea').val();
  console.log(newTitle);
  console.log(newMessage);

  var postId = $('#edit-textarea').attr('data-post-id');
  console.log(postId);

  var originalTitle = $(`h3[data-post-id="${postId}"]`);
  var originalMessage = $(`p[data-post-id="${postId}"]`);
  console.log(originalTitle);
  console.log(originalMessage);
  originalTitle.text(newTitle);
  originalMessage.text(newMessage);
  
  $(`.edit-post-modal[data-post-id="${postId}"]`).modal('hide');
  $(`.edit-post-modal[data-post-id="${postId}"]`).remove();
  $('.modal-backdrop').remove();

}


//MEU COMMIT QUE VEIO DA LABORATÓRIA CASO A GENTE PRECISE RETORNAR A ELA
// <<<<<<< HEAD
// function editPostModal(event) {
//   var postId = $(this).attr("data-post-id");
//   console.log(postId);

//   $('#edit-post-modal').modal('show');
//   $('#edit-post').on('click', function(event) {
//     editPost(event, postId);
//   });
// }

// function editPost(event, postId) {
//   event.preventDefault();

//   database.ref('posts/' + USER_ID + '/' + postId).once('value')
//   .then(function(snapshot) {
//     snapshot.child("message").val();
//   })
// }

// function editPostInDatabase(event) {
// }

// function editPost(event, postId) {
//   event.preventDefault();
//   // $('#post-textarea').text("banana")
//   console.log('deu bom');
// }

// function editPostInDatabase(event) {
//   console.log('edit deu bom');
// }

function deletePostModal(event) {
  event.preventDefault();

  var targetElement = event.target;
  var nextSibling = targetElement.nextElementSibling;

  var elementParent = targetElement.parentElement;
  var elementGrandParent = elementParent.parentElement;
  var postId = $(elementGrandParent).attr("data-post-id");

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
  database.ref('posts/' + USER_ID + '/' + postId).remove();
}

//talvez não precise dessa função, showMyPosts substitui ela e dá a opção
//de deletar o post, coisa que essa aqui não dá
// function showInFeed(message, title) {
//   if (title === undefined){
//     title = '';
//   };
  
//   var template = `
//   <div class="post-feed">
//     <div class="post-header">
//       <h3>${title}</h3>
//       <span class="delete-btn">&times;</span>
//     </div>
//     <div>
//       <p>${message}</p>
//     </div>
//   </div>
// `
//   $('#feed').prepend(template);
// }

function showUsers() {
  database.ref('users/').once('value')
    .then(function(snapshot) {
      clearSearch();
      snapshot.forEach(function(childSnapshot) {        
        var childSnapshotKey = childSnapshot.key;
        childSnapshot.forEach(function(userId){
          var childData = userId.val()
          var usernameData = childData.username;
          if (childSnapshotKey !== USER_ID) {
            var userBox = document.createElement('div');
            var usernameTitle = '<p>' + usernameData + '</p>';
            var usernameBtn = '<button type="button"  onclick="followUser(event)" class="btn follow-btn btn-primary btn-sm" id="' + childSnapshotKey + '">Seguir</button>'
            $(userBox).addClass("search-user");
            $(userBox).html(usernameTitle + usernameBtn);
            $('#search-area').prepend(userBox);
            $('#feed').hide();
          }
        })
      })
    }); 
}

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

