var database = firebase.database();

$(document).ready(function(){
  splashFadeOut();

  $('#signup-btn').on('click', signUpModal);
  $('.sign-up-form button').on('click', signUp);
  $('#signin-btn').on('click', signIn);
  $('#forgot-password').on('click', resetPasswordModal);
  $('#send-email').on('click', resetPassword);
})

function splashFadeOut() {
  $('.splash').delay('3000').fadeOut('500');
}

function signUpModal(event) {
  event.preventDefault();
  clearInput();
  clearSignInForm();
  clearModal();
  $('#signup').modal('show');
}

function signUp(event) {
  event.preventDefault();
  clearModal();
  createUser(event);
  clearInput();
}

function signIn(event) {
  event.preventDefault();
  clearSignInForm();
  userAuthentication(event);
  clearInput();
}

function resetPasswordModal() {
  clearInput();
  clearModal();
  clearSignInForm();
  $('#reset-password').modal('show');
}

function resetPassword(event) {
  event.preventDefault();
  clearModal();

  var auth = firebase.auth();
  var emailAddress = $('#reset-email').val();
  var targetId = event.target.id;

  auth.sendPasswordResetEmail(emailAddress).then(function() {
    clearInput();
    var sentEmail = document.createElement('p');
    $(sentEmail).text('Um e-mail foi enviado para o endereço informado com instruções para redefinir sua senha.');
    $('#send-email').after(sentEmail);
  }).catch(function(error) {
    showErrorMessage(error, targetId);
  });
}

function userAuthentication(event) {
  var targetId = event.target.id;
  var email = $('#signin-email').val();
  var password = $('#signin-password').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(response) {
      window.location = 'main.html?id=' + response.user.uid;
    })
    .catch(function(error) {
      showErrorMessage(error, targetId);
  });
}

function createUser(event) {
  var email = $('#signup-email').val();
  var password = $('#signup-password').val();
  var firstName = $('#signup-fname').val();
  var lastName = $('#signup-lname').val();
  var targetId = event.target.id;

  firebase.auth().createUserWithEmailAndPassword(email, password)    
    .then(function(response) {
      var USER_UID = response.user.uid;
      createUserData(USER_UID, firstName, lastName, email);
      window.location = 'main.html?id=' + response.user.uid;
    })
    .catch(function(error) {
      showErrorMessage(error, targetId);
    });
  }

function createUserData(USER_UID, firstName, lastName, email) {
  database.ref('users/' + USER_UID).push({
    username: firstName + ' ' + lastName,
    email: email
  });
}

function showErrorMessage(error, targetId) {
  var errorCode = error.code;
  var errorHtmlMessage = document.createElement('p');
  $(errorHtmlMessage).attr('class', 'signup-error-alert');

  if (errorCode === 'auth/invalid-email') {
    $(errorHtmlMessage).text('*E-mail inválido.');

    if (targetId === 'signin-btn') {
      console.log($('#signin-email'));
      $('#signin-email').after(errorHtmlMessage);
      $('#signin-email').attr('class', 'error-border');
    } else if (targetId === 'signup-modal-btn') {
      $('#signup-email').after(errorHtmlMessage);
      $('#signup-email').attr('class', 'error-border');
    } else if (targetId === 'send-email') {
      $('#reset-email').after(errorHtmlMessage);
      $('#reset-email').attr('class', 'error-border');
    }
  }

  if (errorCode === 'auth/weak-password') {
    $(errorHtmlMessage).text('*A senha precisa ter pelo menos 6 caracteres.');
    $('#signup-password').after(errorHtmlMessage);
    $('#signup-password').attr('class', 'error-border');
  }

  if(errorCode === 'auth/email-already-in-use') {
    $(errorHtmlMessage).html('*E-mail já cadastrado. Se deseja recuperar a senha, clique em "Esqueci a senha".');
    $('#signup-email').after(errorHtmlMessage);
    $('#signup-email').attr('class', 'error-border');
  }

  if(errorCode === 'auth/wrong-password') {
    $(errorHtmlMessage).text('*Senha incorreta.');
    $('#signin-password').after(errorHtmlMessage);
    $('#signin-password').attr('class', 'error-border');
  }

  if (errorCode === 'auth/user-not-found') {
    $(errorHtmlMessage).text('*Usuário não encontrado. Se você é novo no site, clique em "Cadastrar-se".');

    if (targetId === 'signin-btn') {
      $('#signin-email').after(errorHtmlMessage);
      $('#signin-email').attr('class', 'error-border');
    } else if (targetId === 'send-email') {
      $('#reset-email').after(errorHtmlMessage);
      $('#reset-email').attr('class', 'error-border');
    }
  }
}

function clearModal() {
  $('#signup-email').removeClass('error-border');
  $('#signup-password').removeClass('error-border');
  $('#reset-email').removeClass('error-border');
  $('.sign-up-form p').remove();
  $('.reset-password-form p').remove();
}

function clearSignInForm() {
  $('#signin-email').removeClass('error-border');
  $('#signin-password').removeClass('error-border');
  $('.sign-in-form p').remove();
}

function clearInput() {
  $('#signup-fname').val('');
  $('#signup-lname').val('');
  $('#signup-email').val('');
  $('#signup-password').val('');
  $('#signin-email').val('');
  $('#signin-password').val('');
  $('#reset-email').val('');
}

