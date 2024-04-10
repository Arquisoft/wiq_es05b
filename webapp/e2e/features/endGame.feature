Feature: End game

Scenario:The user finishes a game
  Given An user who is answering questions
  When He answers the last one
  Then Redirect to end game view