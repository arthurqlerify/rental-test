Feature: Provide Renovation Estimate

  Scenario: Given an estimate request exists with defined scope and apartment details, When the ConstrDept submits costs, lead times and assumptions for each renovation level, Then Renovation Estimate Provided is recorded with the option set.
    Given an estimate request exists with defined scope and apartment details
    When the ConstrDept submits costs, lead times and assumptions for each renovation level
    Then Renovation Estimate Provided is recorded with the option set