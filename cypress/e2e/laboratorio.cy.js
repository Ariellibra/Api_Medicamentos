describe('Página de Laboratorios - SanaTres7+', () => {
  beforeEach(() => {
    cy.visit('https://api-medicamentos.libradev.com.ar/laboratorios.html');
  });

  it('Debe mostrar el título de laboratorios', () => {
    cy.get('h2').should('contain.text', 'Conocé Nuestros Laboratorios');
  });

  it('Debe mostrar al menos 4 tarjetas de laboratorio con imagen y descripción', () => {
    cy.get('.card').should('have.length.at.least', 4).each(($card) => {
      cy.wrap($card).find('img').should('be.visible');
      cy.wrap($card).find('h4').should('exist');
      cy.wrap($card).find('p').should('exist');
    });
  });

  it('Debe permitir navegar a Productos desde la navbar', () => {
    cy.contains('Productos').click();
    cy.url().should('include', 'productos1.html');
  });

  it('Debe permitir ir al panel de administración desde "Ingresar"', () => {
    cy.contains('Ingresar').click();
    cy.url().should('include', 'adminMeds.html');
    cy.contains('Admin Medicamentos').should('be.visible');
  });
});
