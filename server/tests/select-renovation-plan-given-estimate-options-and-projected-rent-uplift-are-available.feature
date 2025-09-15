Feature: Select Renovation Plan

  Scenario: Given estimate options and projected rent uplift are available, When the PropertyMgr selects one plan level or chooses no renovation, Then Renovation Plan Selected is recorded with the chosen level, budget and expected completion window.
    Given estimate options and projected rent uplift are available
    When the PropertyMgr selects one plan level or chooses no renovation
    Then Renovation Plan Selected is recorded with the chosen level, budget and expected completion window.