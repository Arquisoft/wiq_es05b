Feature: Registering a new user

Scenario: The password does not fulfill the security parameters
  Given An unregistered user with weak password
  When Fill the data in the form
  Then Alert about the weak password

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then Redirect to home page

