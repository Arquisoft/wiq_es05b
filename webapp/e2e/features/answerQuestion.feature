Feature: Check the game menu

Scenario: Register new user plays a new game
  Given An unregistered user
  When plays a game answering a question
  Then points are updated