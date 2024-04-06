Feature: Correct login

Scenario:The user is not logged in the site
  Given An existent user
  When I fill the data in the form and press submit
  Then Redirect to game menu page