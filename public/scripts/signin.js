function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var Name = profile.getName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var redirect_url = 'http://localhost:3030/dashboard?username=' + Name;
    document.location.href = redirect_url;
  };