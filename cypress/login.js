describe("Login", () => {
  before(() => {
    cy.visit("/");
  });

  it("should allow to login", () => {
    cy.get("button").contains("Connexion").click();
    cy.get("form").submit();

    cy.getCookies()
      .should("have.length", 3)
      .spread((c1, c2, c3) => {
        expect(c1).to.have.property("name", "next-auth.session-token");
        expect(c2).to.have.property("name", "next-auth.csrf-token");
        expect(c3).to.have.property("name", "next-auth.callback-url");
      });
  });

  //   it("With username/password", () => {
  //     cy.contains("Connexion").click();
  //     cy.get("input[name='togglePassword']").click({ force: true });
  //     cy.get("input[name='username']").type("romseguy");
  //     cy.get("input[name='password']").type("wxcv");
  //     cy.get("form").submit();
  //   });

  // it("w", () => {
  // signIn("credentials", { username: "romseguy", password: "wxcv" });
  // fetch("/auth/signIn", {
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json; charset=UTF-8"
  //   },
  //   body: JSON.stringify({ username: "romseguy", password: "wxcv" })
  // });
  // });
});
