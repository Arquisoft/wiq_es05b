Feature: Registering a new user

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then Redirect to home page