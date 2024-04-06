Feature: answer a question

Scenario: Register new user plays a new game
  Given An unregistered user
  When Plays a game answering a question
  Then Points are updated