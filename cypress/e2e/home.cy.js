/*

Developers: Rojas Kevin, Ariel Paz, Liz Esperanza Ávalos.
Estructura de pruebas automatizadas

*/

// Pruebas en la Página de Inicio InfoMedica

describe('Página principal de SanaTres7+', () => {
  beforeEach(() => {
    cy.visit('https://api-medicamentos.libradev.com.ar/index.html');
  });

  it('Debe mostrar el título principal correctamente', () => {
    cy.get('h1.display-5')
      .should('be.visible')
      .and('contain.text', 'Bienvenido a SanaTres7+');
  });

  it('Debe mostrar la sección de catálogo de productos', () => {
    cy.get('#productos')
      .should('exist')
      .within(() => {
        cy.get('h2').should('contain.text', 'Catálogo de Productos');
        cy.get('.productos-grid .card').should('have.length', 3);
      });
  });

  it('Debe mostrar la sección de laboratorios con imágenes', () => {
    cy.get('#laboratorios')
      .should('exist')
      .within(() => {
        cy.get('h2').should('contain.text', 'Laboratorios Asociados');
        cy.get('img[alt^="Lab"]').should('have.length', 4);
      });
  });

  it('Debe mostrar imágenes de productos específicas', () => {
    cy.get('img[alt="Paracetamol 500mg"]').should('exist');
    cy.get('img[alt="Amoxicilina 500mg"]').should('exist');
    cy.get('img[alt="Gel cicatrizante 30g"]').should('exist');
  });

  describe('Navegación y acceso al panel de administración', () => {
    it('La navbar tiene los enlaces correctos', () => {
      cy.get('nav').should('exist');
      cy.get('nav a').contains('Inicio').should('have.attr', 'href', '#inicio');
      cy.get('nav a').contains('Productos').should('have.attr', 'href', 'productos1.html');
      cy.get('nav a').contains('Laboratorios').should('have.attr', 'href', 'laboratorios.html');
    });

    it('Puede acceder al panel de administración desde el botón "Ingresar"', () => {
      cy.get('nav a.btn')
        .should('contain.text', 'Ingresar')
        .click();

      cy.url().should('include', '/adminMeds.html');
      cy.contains('Admin Medicamentos').should('be.visible');
    });
  });
});
