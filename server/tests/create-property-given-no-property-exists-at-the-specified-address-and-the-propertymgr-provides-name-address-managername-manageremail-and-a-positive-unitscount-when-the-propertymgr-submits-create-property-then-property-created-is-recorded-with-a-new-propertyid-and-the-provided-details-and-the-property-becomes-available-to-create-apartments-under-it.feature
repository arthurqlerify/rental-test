Feature: Create Property

  Scenario: Given no property exists at the specified address and the PropertyMgr provides name, address, managerName, managerEmail and a positive unitsCount, When the PropertyMgr submits Create Property, Then Property Created is recorded with a new propertyId and the provided details, and the property becomes available to create apartments under it.