describe("CRUD", () => {
  before(() => {
    cy.request("http://localhost:3004/api/reset-db");
  });
  beforeEach(() => {});

  // it("should", () => {
  //   cy.visit("http://localhost:3004/fiches");

  //   cy.get("h2 > a")
  //     .should("have.attr", "href")
  //     .and("match", /\/fiches\/add/);
  //   cy.get("h2 > a > button").click();
  // });

  describe("CREATE", () => {
    it("add profile", () => {
      cy.visit("http://localhost:3004/fiches/add");

      cy.get("input#firstname").type("1");
      cy.get("input#lastname").type("2");
      cy.get("input#birthdate").click();
      cy.get("select.react-datepicker__month-select").select("janvier");
      cy.get("select.react-datepicker__year-select").select("2019");
      cy.findByRole("button", {
        name: "Choose Tuesday, January 1st, 2019"
      }).click();
      cy.findByRole("button", { name: "Ajouter" }).click();
    });

    it("add skill", () => {
      cy.visit("http://localhost:3004/competences/add");
      cy.get("input#code").type("L01");
      cy.get("input#description").type("J");
      cy.findByRole("button", { name: "Ajouter" }).click();
    });

    it("add workshop", () => {
      cy.visit("http://localhost:3004/ateliers/add");
      cy.get("input#name").type("ABC");
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains("L01").click();
      cy.findByRole("button", { name: "Ajouter" }).click();
    });

    it("add workshop to profile", () => {
      cy.visit("http://localhost:3004/fiches/1-2");
      cy.get("h2").contains("Ateliers").should("be.visible");
      cy.get("button").contains("Ajouter un atelier").click();
      cy.get("select#workshop").select("ABC");
      cy.get("form").submit();
    });

    it("add skill to profile", () => {
      cy.visit("http://localhost:3004/fiches/1-2");
      cy.findByRole("button", { name: "Ajouter une compétence" }).click();
      cy.get("select#skill").select("L01");
      cy.get("form").submit();
    });

    it("check skill has been added to profile", () => {
      cy.visit("http://localhost:3004/fiches/1-2");
      cy.findByRole("heading", {
        name: "Compétences acquises"
      }).click();
      cy.findByRole("cell", { name: "L01" }).should("be.visible");
      cy.findByRole("cell", { name: "J" }).should("be.visible");
    });

    it("check workshop has been added to profile", () => {
      cy.visit("http://localhost:3004/fiches/1-2");
      cy.findByRole("heading", {
        name: "Ateliers"
      }).click();
      cy.findByRole("cell", { name: "ABC" }).should("be.visible");
    });

    it("add parent", () => {
      cy.visit("http://localhost:3004/parents/add");
      cy.get("input#firstname").type("p1");
      cy.get("input#lastname").type("p2");
      cy.get("input#email").type("p@e.com");
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains("1 2").click();
      cy.findByRole("button", { name: "Ajouter" }).click();
    });

    it("check parent has been added to profile", () => {
      cy.visit("http://localhost:3004/fiches/1-2");
      cy.get("h2").contains("Parents").click();
      cy.findByTitle("Cliquez pour ouvrir la fiche de p1 p2").click();
      cy.url().should("include", "/parents/p1-p2");
      cy.findByTitle("Cliquez pour ouvrir la fiche de 1 2").click();
      cy.url().should("include", "/fiches/1-2");
    });

    // it("check profile has been added to list", () => {
    //   cy.visit("http://localhost:3004/fiches");
    //   cy.findByTitle("Cliquez pour ouvrir la fiche de 1 2").click();
    //   cy.url().should("include", "/fiches/1-2");
    // });

    // it("check parent has been added to list", () => {
    //   cy.visit("http://localhost:3004/parents");
    //   cy.findByTitle("Cliquez pour ouvrir la fiche de p1 p2").click();
    //   cy.url().should("include", "/parents/p1-p2");
    // });

    // it("check skill has been added to list", () => {
    //   cy.visit("http://localhost:3004/competences");
    //   cy.findByTitle("Cliquez pour ouvrir la fiche de p1 p2").click();
    //   cy.url().should("include", "/parents/p1-p2");
    // })
  });
});
