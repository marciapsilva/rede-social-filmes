var database = firebase.database();

$(document).ready(function(){
  // $('nome-do-botao-postar').on('click', postUserMessage);
  postUserMessage();
})

function postUserMessage() {
  // event.preventDefault();

  // var post = $('nome-do-input').val();
  // var type = $('nome-do-option-filtro').val();

  database.ref('/users/').once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        // var childData = childSnapshot.val();

        console.log(childKey);
        var childData = childSnapshot.val();
      })
    // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // // ...
    return childkey;
  });

  console.log()
}
