$(document).ready(function(){
  $('#signup-btn').on('click', signUpModal);
  $('#signin-btn').on('click', signIn);
  $('#forgot-password').on('click', resetPasswordModal);
})

function signUpModal() {
  clearSignInForm();
  clearModal();
  $('#signup').modal('show');
  $('.sign-up-form button').on('click', signUp);
}

function signUp() {
  event.preventDefault();
  clearModal();
  createUser();
  clearInput();
}

function signIn() {
  event.preventDefault();
  clearSignInForm();
  userAuthentication();
  clearInput();
}

function resetPasswordModal() {
  clearInput();
  clearModal();
  clearSignInForm();
  $('#reset-password').modal('show');
  $('#send-email').on('click', resetPassword);
}

function resetPassword() {
  var auth = firebase.auth();
  var emailAddress = $('#reset-email').val();

  auth.sendPasswordResetEmail(emailAddress).then(function() {
    clearInput();
    var sentEmail = document.createElement('p');
    $(sentEmail).text('Um e-mail foi enviado para o endereço informado com instruções para redefinir sua senha.');
    $('#send-email').after(sentEmail);
  }).catch(function(error) {
    alert(error);
  });
}

function userAuthentication() {
  var email = $('#signin-email').val();
  var password = $('#signin-password').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
      window.location = 'main.html';
    })
    .catch(function(error) {
      showErrorMessage(error);
  });
}

function createUser() {
  var email = $('#signup-email').val();
  var password = $('#signup-password').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)    
    .then(function() {
      window.location = 'main.html';
    })
    .catch(function(error) {
      showErrorMessage(error);
    });
}

function showErrorMessage(error) {
  var errorCode = error.code;
  var errorHtmlMessage = document.createElement('p');
  $(errorHtmlMessage).attr('class', 'signup-error-alert');

  if (errorCode === 'auth/invalid-email') {
    $(errorHtmlMessage).text('*E-mail inválido.');
    $('#signup-email').after(errorHtmlMessage);
    $('#signup-email').attr('class', 'error-border');
  }

  if (errorCode === 'auth/weak-password') {
    $(errorHtmlMessage).text('*A senha precisa ter pelo menos 6 caracteres.');
    $('#signup-password').after(errorHtmlMessage);
    $('#signup-password').attr('class', 'error-border');
  }

  if(errorCode === 'auth/email-already-in-use') {
    $(errorHtmlMessage).text('*E-mail já cadastrado. Se deseja recuperar a senha, clique em Esqueci a Senha.');
    $('#signup-email').after(errorHtmlMessage);
    $('#signup-email').attr('class', 'error-border');
  }

  if(errorCode === 'auth/wrong-password') {
    $(errorHtmlMessage).text('*Senha incorreta.');
    $('#signin-password').after(errorHtmlMessage);
    $('#signin-password').attr('class', 'error-border');
  }

  if (errorCode === 'auth/user-not-found') {
    $(errorHtmlMessage).text('*Usuário não encontrado. Se você é novo no site, clique em Cadastrar-se.');
    $('#signin-email').after(errorHtmlMessage);
    $('#signin-email').attr('class', 'error-border');
  }
}

function clearModal() {
  $('#signup-email').removeClass('error-border');
  $('#signup-password').removeClass('error-border');
  $('.sign-up-form p').remove();
  $('.reset-password-form p').remove();
}

function clearSignInForm() {
  $('#signin-email').removeClass('error-border');
  $('#signin-password').removeClass('error-border');
  $('.sign-in-form p').remove();
}

function clearInput() {
  $('#signup-email').val('');
  $('#signup-password').val('');
  $('#signin-email').val('');
  $('#signin-password').val('');
  $('#reset-email').val('');
}

