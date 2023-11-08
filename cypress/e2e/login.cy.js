describe("Login to Pathology Website ", () => {
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    cy.fixture("example").then(function (data) {
      globalThis.data = data;
    });
  });

  it("Verify if the ", () => {
    cy.visit("https://gor-pathology.web.app");
    cy.get('input[name="email"]').type("test@kennect.io");
    cy.get('input[name="email"]').should("have.value", "test@kennect.io");

    cy.get('input[type="password"]').type("Qwerty@1234");
    cy.get('input[type="password"]').should("have.value", "Qwerty@1234");

    cy.get('button[type="submit"]:contains("Login")').eq(0).click();
  });
});
