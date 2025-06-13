describe('Página de Productos - SanaTres7+', () => {
  beforeEach(() => {
    cy.visit('https://api-medicamentos.libradev.com.ar/productos1.html');
  });

  it('Debe mostrar el encabezado de productos', () => {
    cy.contains('h2', '💊 Catálogo de Productos').should('be.visible');
  });

  it('Debe listar tarjetas de medicamentos', () => {
    cy.get('.productos-grid .card').should('have.length.at.least', 1);
  });

  it('Cada tarjeta debe tener imagen, nombre y precio', () => {
    cy.get('.productos-grid .card').each(($card) => {
      // Verifica que la imagen sea visible
      cy.wrap($card).find('img.card-img-top').should('be.visible');

      // Verifica que exista el nombre del medicamento
      cy.wrap($card).find('h5').should('exist');

      // Verifica que exista el precio con clase de estilo
      cy.wrap($card).find('p.text-success').should('exist');
    });
  });
});
