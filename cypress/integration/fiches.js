describe("CRUD", () => {
  beforeEach(() => {});

  // it("check fiches/add button", () => {
  //   cy.visit("http://localhost:3004/fiches");

  //   cy.get("h2 > a")
  //     .should("have.attr", "href")
  //     .and("match", /\/fiches\/add/);
  //   cy.get("h2 > a > button").click();
  // });

  describe("CREATE", () => {
    before(() => {
      cy.request("http://localhost:3004/api/reset-db");
    });

    // it("check empty profile store", () => {
    //   cy.visit("http://localhost:3004/fiches/13-244");
    //   cy.findByText("Aucune fiche élève n'a été ajoutée à l'application");
    // });
    // it("check empty skill store", () => {
    //   cy.visit("http://localhost:3004/competences/13-244");
    //   cy.findByText("Aucune compétence n'a été ajoutée à l'application");
    // });
    // it("check empty workshop store", () => {
    //   cy.visit("http://localhost:3004/ateliers/13-244");
    //   cy.findByText("Aucun atelier n'a été ajouté à l'application");
    // });
    // it("check empty parent store", () => {
    //   cy.visit("http://localhost:3004/parents/13-244");
    //   cy.findByText("Aucune fiche parent n'a été ajoutée à l'application");
    // });
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
      cy.get("select#level").select("CP");
      cy.findByRole("button", { name: "Ajouter" }).click();
    });
    it("add workshop", () => {
      cy.visit("http://localhost:3004/ateliers/add");
      cy.get("input#name").type("ABC");
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains("L01").click();
      cy.findByRole("button", { name: "Ajouter" }).click();
    });
    it("add parent", () => {
      cy.visit("http://localhost:3004/parents/add");
      cy.get("input#firstname").type("p1");
      cy.get("input#lastname").type("p2");
      cy.get("input#email").type("p@e.com");
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains("1 2").click();
      cy.findByRole("button", { name: "Ajouter le parent" }).click();
    });
    // it("add workshop to profile", () => {
    //   cy.visit("http://localhost:3004/fiches/1-2");
    //   cy.get("h2").contains("Ateliers").should("be.visible");
    //   cy.get("button").contains("Associer un atelier").click();
    //   cy.get("select#workshop").select("ABC");
    //   cy.get("form").submit();
    // });
    // it("add skill to profile", () => {
    //   cy.visit("http://localhost:3004/fiches/1-2");
    //   cy.findByRole("button", { name: "Valider une compétence" }).click();
    //   cy.get("select#skill").select("L01");
    //   cy.get("form").submit();
    // });

    // it("check skill has been added to profile", () => {
    //   cy.visit("http://localhost:3004/fiches/1-2");
    //   cy.findByRole("heading", {
    //     name: "Compétences acquises"
    //   }).click();
    //   cy.findByRole("cell", { name: "L01" }).should("be.visible");
    //   cy.findByRole("cell", { name: "J" }).should("be.visible");
    // });
    // it("check workshop has been added to profile", () => {
    //   cy.visit("http://localhost:3004/fiches/1-2");
    //   cy.findByRole("heading", {
    //     name: "Ateliers"
    //   }).click();
    //   cy.findByRole("cell", { name: "ABC" }).should("be.visible");
    //   cy.findByRole("cell", { name: "L01" }).should("be.visible");
    // });
    // it("check parent has been added to profile", () => {
    //   cy.visit("http://localhost:3004/fiches/1-2");
    //   cy.get("h2").contains("Parents").click();
    //   cy.findByTitle("Cliquez pour ouvrir la fiche de p1 p2").click();
    //   cy.url().should("include", "/parents/p1-p2");
    //   cy.findByTitle("Cliquez pour ouvrir la fiche de 1 2").click();
    //   cy.url().should("include", "/fiches/1-2");
    // });
    // it("check 404 profile", () => {
    //   cy.visit("http://localhost:3004/fiches/13-244");
    //   cy.findByText(
    //     "Nous n'avons pas pu trouver de fiche associée à cet élève"
    //   );
    // });
    // it("check 404 skill", () => {
    //   cy.visit("http://localhost:3004/competences/13-244");
    //   cy.findByText("Nous n'avons pas pu trouver cette compétence");
    // });
    // it("check 404 workshop", () => {
    //   cy.visit("http://localhost:3004/ateliers/13-244");
    //   cy.findByText("Nous n'avons pas pu trouver cet atelier");
    // });
    // it("check 404 parent", () => {
    //   cy.visit("http://localhost:3004/parents/13-244");
    //   cy.findByText(
    //     "Nous n'avons pas pu trouver de fiche associée à ce parent"
    //   );
    // });
  });

  // describe("UPDATE", () => {
  //   it("update profile", () => {
  //     cy.visit("http://localhost:3004/fiches/1-2/edit");

  //     cy.get("input#firstname").type("3");
  //     cy.get("input#lastname").type("4");
  //     cy.get("input#birthdate").click();
  //     cy.get("select.react-datepicker__month-select").select("mars");
  //     cy.findByRole("button", {
  //       name: "Choose Friday, March 1st, 2019"
  //     }).click();
  //     cy.findByRole("button", { name: "Modifier" }).click();

  //     cy.visit("http://localhost:3004/fiches");
  //     cy.findByText("01/03/2019");
  //   });

  //   it("update skill", () => {
  //     cy.visit("http://localhost:3004/competences/L01/edit");
  //     cy.get("input#code").type("M01");
  //     cy.get("input#description").type("K");
  //     cy.get("select#domain").select("Français");
  //     cy.get("select#level").select("CE1");
  //     cy.findByRole("button", { name: "Modifier" }).click();
  //     cy.visit("http://localhost:3004/competences");
  //     cy.findByText("L01M01");
  //     cy.findByText("JK");
  //     cy.findByText("Français");
  //     cy.findByText("CE1");
  //   });

  //   it("update parent", () => {
  //     cy.visit("http://localhost:3004/parents/p1-p2/edit");
  //     cy.get("input#firstname").type("3");
  //     cy.get("input#lastname").type("4");
  //     cy.get(".react-select__multi-value__remove").click();
  //     cy.findByRole("button", { name: "Modifier le parent" }).click();
  //     cy.visit("http://localhost:3004/parents/p13-p24");
  //     cy.findByTitle("Cliquez pour ouvrir la fiche de 1 2").should(
  //       "not.be.visible"
  //     );
  //   });

  //   it("update workshop with new skill and completes it", () => {
  //     cy.visit("http://localhost:3004/competences/add");
  //     cy.get("input#code").type("L02");
  //     cy.get("input#description").type("J");
  //     cy.get("select#level").select("CP");
  //     cy.findByRole("button", { name: "Ajouter" }).click();

  //     cy.visit("http://localhost:3004/ateliers/ABC/edit");
  //     cy.get(".react-select-container").click();
  //     cy.get(".react-select__option").contains("L02").click();
  //     cy.findByRole("button", { name: "Modifier" }).click();

  //     cy.visit("http://localhost:3004/fiches/13-24");
  //     cy.findByRole("heading", {
  //       name: "Ateliers"
  //     }).click();

  //     cy.get("button#editWorkshop").click();

  //     cy.get("input#started").click();
  //     cy.get("select.react-datepicker__month-select").select("janvier");
  //     cy.findByRole("button", {
  //       name: "Choose Wednesday, January 1st, 2020"
  //     }).click();

  //     cy.get("input#completed").click();
  //     cy.get("select.react-datepicker__month-select").select("janvier");
  //     cy.findByRole("button", {
  //       name: "Choose Thursday, January 2nd, 2020"
  //     }).click();

  //     cy.findByRole("button", { name: "Terminer l'atelier" }).click();

  //     cy.findByRole("heading", {
  //       name: "Compétences acquises"
  //     }).click();
  //     cy.findByRole("cell", { name: "L02" }).should("be.visible");
  //   });
  // });
});
