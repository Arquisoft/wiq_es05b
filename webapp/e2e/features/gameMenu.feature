Feature: Check the game menu

Scenario: Register new user and click play button
  Given An unregistered user
  When clicks the play button
  Then Shows the game categories