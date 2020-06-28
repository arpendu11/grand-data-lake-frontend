export const initializeDatabase = (driver) => {
  const initCypher = `CALL db.index.fulltext.createNodeIndex("SearchString",["User", "UserGroup","AccessRight", "Account"],["accountDomain", "accountStatus", "accountName", "employeeOrganization", "employeeStatus", "entitlementDescription", "entitlementName", "firstName", "fqdn", "identityGroupDescription", "identityGroupName", "lastName", "location", "email", "middleName", "notes"], {analyzer: "url_or_email", eventually_consistent: "true"})`

  const testCypher = `CALL db.indexes() YIELD name where name = "SearchString" RETURN name`

  const checkIndex = (driver) => {
    const session = driver.session()
    return session
      .writeTransaction((tx) => tx.run(testCypher))
      .then()
      .finally(() => session.close())
  }

  const executeQuery = (driver) => {
    const session = driver.session()
    return session
      .writeTransaction((tx) => {
        tx.run(initCypher)
      })
      .then()
      .finally(() => session.close())
  }

  checkIndex(driver).catch((error) => {
    console.error(error.message)
    executeQuery(driver).catch((error) => {
      console.error(
        'Database indexing and initialization failed to complete!!\n',
        error.message
      )
    })
  })
}
