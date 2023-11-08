describe("Login to Pathology Website ", () => {
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    cy.fixture("example").then(function (data) {
      globalThis.data = data;
    });
  });

  it("Verify User with correct credentials is able to login to website", () => {
    let totalTestCosts = 0;

    let TestCostLabels = [];
    var moneyValues = [];

    cy.visit("https://gor-pathology.web.app");

    //Loggin in to the application
    cy.get('input[name="email"]').type("test@kennect.io");
    cy.get('input[name="email"]').should("have.value", "test@kennect.io");

    cy.get('input[type="password"]').type("Qwerty@1234");
    cy.get('input[type="password"]').should("have.value", "Qwerty@1234");

    cy.get('button[type="submit"]:contains("Login")').eq(0).click();

    //Adding Tests to

    cy.wait(5000);
    cy.get("#patient-test").click({ force: true });
    cy.get("#patient-test")
      .click({ force: true })
      .then((el) => {
        let tests = globalThis.data.tests;
        for (let i in tests) {
          cy.get("#patient-test").type(tests[i]);
          cy.wait(1000);
          cy.get("#patient-test-popup .MuiBox-root div").eq(0).click();
        }
      });

    //calculating costs of added tests and validating against subtotal
    cy.get(".MuiChip-label")
      .each(($el, index, list) => {
        TestCostLabels.push($el.text());
      })
      .then(() => {
        moneyValues = TestCostLabels.map((item) => {
          const matches = item.match(/(\d+₹)/);
          return matches ? matches[0].replace("₹", "") : null;
        });

        for (let i in moneyValues) {
          totalTestCosts = totalTestCosts + parseInt(moneyValues[i], 10);
        }

        //getting subtotal value
        cy.get(
          '[style="margin-top: 36px; padding: 26px;"] div:nth-child(3) div:nth-child(2)'
        ).then((el) => {
          let subtotal = parseInt(el.text(), 10);

          expect(subtotal).to.deep.equal(totalTestCosts);
        });

        //validating toal after discount
        cy.wait(4000);
        cy.get(".MuiSelect-root").click();
        cy.get('.MuiList-root li[role="option"]').eq(2).click();
        cy.get(
          '[style="margin-top: 36px; padding: 26px;"] div:nth-child(3) div:nth-child(2) div:nth-child(2)'
        ).then((el) => {
          let temp = el.text();
          let total = parseInt(temp.replace("₹", ""), 10);

          let actualTotal = totalTestCosts - totalTestCosts * (10 / 100);
          expect(total).to.deep.equal(actualTotal);
        });
      });
  });
});
