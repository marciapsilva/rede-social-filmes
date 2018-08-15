var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
  // loadUserMessages();
  $('#post-btn').on('click', postUserMessage);
  $('.menu-title').on('click', clearPostModal);
  $('.search').on('click', showUsers);
  $('.your-posts').on('click', showMyPosts);
  $('.friend-posts').on('click', showMyFriendsPosts);
  $('.all-posts').on('click', showAllPosts);
  $('.friends').on('click', showMyFriends);
  $('#feed').on('click', '.delete-btn', deletePostModal);
})

function postUserMessage() {
  event.preventDefault();

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

function deletePostModal(event) {
  event.preventDefault();

  var targetElement = event.target;
  var elementParent = targetElement.parentElement;
  var elementGrandParent = elementParent.parentElement;
  var postId = $(elementGrandParent).attr("data-post-id");

  $('#delete-post-modal').modal('show');
  $('#delete-post').click(function(){
    deletePost(elementGrandParent);
    deletePostInDatabase(postId);
  }); 
}

function deletePost(elementGrandParent) {
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

// function loadUserMessages() {

//   var posts = [];
//   database.ref('posts/').once('value')
//     .then(function(snapshot) {
//       snapshot.forEach(function(childSnapshot) {
//         database.ref('posts/' + childSnapshot.key).once('value')
//           .then(function(snapshot) {
//             snapshot.forEach(function(childSnapshot) {
//               // console.log(childSnapshot.key);
//               var userPost = childSnapshot.val();
//               var postDate = userPost.date;
//               posts.push(postDate);
//               posts.sort();
//             })

//             $(posts).map(function(index, value) {
//               database.ref('posts/').once('value')
//                 .then(function(snapshot) {
//                   snapshot.forEach(function(childSnapshot) {
//                     database.ref('posts/' + childSnapshot.key).once('value')
//                       .then(function(snapshot) {
//                         snapshot.forEach(function(childSnapshot) {
//                           var userPost = childSnapshot.val();
//                           var postDate = userPost.date;
//                           var getPostTitle = userPost.title;
//                           var userMessage = userPost.message;
//                           if (getPostTitle === undefined){
//                             getPostTitle = '';
//                           };
 
//                           if (value === postDate) {
//                             var postBox = document.createElement('div');
//                             var postTitle = '<h3>' + getPostTitle + '</h3>';
//                             var postMessage = '<p>' + userMessage + '</p>';
//                             $(postBox).addClass("post-feed");
//                             $(postBox).html(postTitle + postMessage);
//                             $('#feed').append(postBox);
//                           }
//                         })
//                       })
//                   })
//                 })
//             })
//           })
//       })
//     })
//   } 

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
        <div class="post-feed" data-post-id=${postId}>
          <div class="post-header">
            <h3>${userPostTitle}</h3>
            <span class="delete-btn">&times;</span>
          </div>
          <div>
            <p>${userMessage}</p>
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

