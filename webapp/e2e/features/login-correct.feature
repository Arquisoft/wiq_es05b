Feature: Correct login

Scenario:The user is not logged in the site
  Given An existent user
  When I fill the data in the form and press submit
  Then Redirect to game menu page

  Scenario:The user tries to log with invalid username
  Given An user
  When I fill the data in the form with invalid username and press submit
  Then I see error toaster

   Scenario:The user tries to log with invalid password
  Given An user
  When I fill the data in the form with invalid password and press submit
  Then I see error toaster