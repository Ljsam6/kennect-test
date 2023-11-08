describe("To verify patients registration page", () => {
  beforeEach(() => {
    // Cypress.session.clearAllSavedSessions();
    cy.fixture("example").then(function (data) {
      globalThis.data = data;
    });
  });
  it("Verify error messages for patients forms- negative scenarios", () => {
    cy.visit("https://gor-pathology.web.app");
    //   Loggin in to the application

    cy.get('input[name="email"]').type("test@kennect.io");
    cy.get('input[name="email"]').should("have.value", "test@kennect.io");

    cy.get('input[type="password"]').type("Qwerty@1234");
    cy.get('input[type="password"]').should("have.value", "Qwerty@1234");

    cy.get('button[type="submit"]:contains("Login")').eq(0).click();

    cy.wait(5000);
    // open Patients tab
    cy.get(".MuiListItemText-root span").contains("Patients").click();
    cy.get('button:contains("Add Patient")').eq(0).click();

    //Verify Error message if name too big
    cy.get('input[name = "name"]').type(
      globalThis.data.Invalid_patientDetails.name
    );
    cy.get('input[name = "name"]')
      .blur()
      .then(() => {
        cy.get(".MuiFormHelperText-root").then(($el) => {
          expect($el.text()).to.deep.equal("Too big name");
        });
      });

    // Verify Error Message if Name field is empty

    cy.get('input[name = "name"]')
      .clear()
      .blur()
      .then(() => {
        cy.get(".MuiFormHelperText-root").then(($el) => {
          expect($el.text()).to.deep.equal("Patient name is required");
        });
      });
    //verify If Email Invalid
    cy.get('input[name = "email"]').type(
      globalThis.data.Invalid_patientDetails.email
    );
    cy.get('input[name = "email"]')
      .blur()
      .then(() => {
        cy.get(".MuiFormHelperText-root").then(($el) => {
          expect($el.text()).to.deep.equal("Invalid email address");
        });
      });

    //Validate if Mobile Number Invalid
    cy.get('input[name = "phone"]').type(
      globalThis.data.Invalid_patientDetails.Phone
    );
    cy.get('input[name = "phone"]')
      .blur()
      .then(() => {
        cy.get(".MuiFormHelperText-root").then(($el) => {
          expect($el.text()).to.deep.equal("Invalid phone number");
        });
      });
  });

  it("Verify Valid data creates ,patient registration record", () => {
    let totalTestCosts = 0;

    let TestCostLabels = [];
    var moneyValues = [];
    cy.visit("https://gor-pathology.web.app");
    cy.get(".MuiListItemText-root span").contains("Patients").click();
    cy.get('button:contains("Add Patient")').eq(0).click();

    cy.wait(5000);

    //   **********************************Page1****************************************

    //Validate data is inputted in input box
    cy.get('input[name = "name"]')
      .type(globalThis.data.Valid_patientDetails.name)
      .should("have.value", globalThis.data.Valid_patientDetails.name);

    //Validate email is inputted in input box
    cy.get('input[name = "email"]')
      .type(globalThis.data.Valid_patientDetails.email)
      .should("have.value", globalThis.data.Valid_patientDetails.email);

    //Validate mobile is inputted in input box
    cy.get('input[name = "phone"]')
      .type(globalThis.data.Valid_patientDetails.Phone)
      .should("have.value", globalThis.data.Valid_patientDetails.Phone);

    cy.get('button span:contains("General Details")').click();

    //   **********************************Page2****************************************

    //enetering height
    cy.get('input[name="height"]')
      .clear()
      .type("164")
      .should("have.value", "164");
    // cy.get('input[name="height"]').blur();
    // cy.get('input[name="height"]').should("have.text", "164");
    //   entering weight
    cy.get('input[name="weight"]')
      .clear()
      .type("60")
      .should("have.value", "60");
    // cy.get('input[name="weight"]').blur();
    // cy.get('input[name="weight"]').should("have.text", "60");

    //   selecting gender
    cy.get("#mui-component-select-gender").click();
    cy.get('ul li[data-value="male"]').click();
    cy.get("#mui-component-select-gender").should("have.text", "Male");

    //   entering Age
    cy.get('input[name="age"]').clear().type("20").should("have.value", "20");

    //   entering blood pressure -systolic
    cy.get('input[name="systolic"]')
      .clear()
      .type("160")
      .should("have.value", "160");

    //   entering blood pressure -diastolic
    cy.get('input[name="diastolic"]')
      .clear()
      .type("60")
      .should("have.value", "60");

    cy.get('button span:contains("Add Tests")').click();

    //   **********************************Page3****************************************
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
        cy.wait(5000);
        cy.get(
          ".MuiCardContent-root div:nth-child(4) div:nth-child(1) div:nth-child(2)"
        ).then((el) => {
          let subtotal = parseInt(el.text(), 10);

          expect(subtotal).to.deep.equal(totalTestCosts);
        });

        //validating toal after discount
        // cy.get(".MuiSelect-root").eq(0).click();
        // cy.get('.MuiList-root li[role="option"]').eq(2).click();

        cy.get(
          '.MuiFormControl-root[style="width: 100%; margin-top: 18px;"] .MuiInputBase-root div'
        ).click({ force: true });
        cy.get('.MuiList-root li[role="option"]').eq(2).click();
        cy.wait(5000);
        cy.get(
          ".MuiCardContent-root div:nth-child(4) div:nth-child(2) div:nth-child(2)"
        ).then((el) => {
          let temp = el.text();
          let total = parseInt(temp.replace("₹", ""), 10);

          let actualTotal = totalTestCosts - totalTestCosts * (10 / 100);
          expect(total).to.deep.equal(actualTotal);
        });

        //Selecting Lab

        cy.get(".MuiAutocomplete-inputRoot #patient-tests-labs").click({
          force: true,
        });
        cy.get("#patient-tests-labs-option-1").click();

        //Adding Equipment
        cy.get("button .MuiIconButton-label > .material-icons").click();

        cy.get(
          '[style="font-size: 13px;"] div[aria-label="Eqipment Name"]'
        ).click({ force: true });
        // '[style="font-size: 13px;"] div[aria-label="Eqipment Name"]';
        //   td>[style="font-size: 13px;"] input
        cy.get('ul li[role="option"]').click();

        cy.get('button span>span:contains("check")').click();

        cy.get('button span:contains("Add Patient")').click();
      });
  });
});
