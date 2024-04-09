Feature: Registering a new user

  Scenario: The username already exists
    Given An unregistered user with repeated username
    When Fill the data in the form
    Then Alert about the username

Scenario: The password does not fulfill the security parameters (length)
  Given An unregistered user with short password
  When Fill the data in the form
  Then Alert about the weak password

  Scenario: The password does not fulfill the security parameters (upperCase)
    Given An unregistered user with non upperCase password
    When Fill the data in the form
    Then Alert about the weak password

  Scenario: The password does not fulfill the security parameters (special character)
    Given An unregistered user with non special character password
    When Fill the data in the form
    Then Alert about the weak password

  Scenario: The password does not fulfill the security parameters (number)
    Given An unregistered user with non number password
    When Fill the data in the form
    Then Alert about the weak password

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then Redirect to home page

