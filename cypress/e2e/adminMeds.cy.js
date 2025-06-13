// Pruebas de interfaz del Panel de Medicamentos.

describe('Panel de Administración de Medicamentos - InfoMedica', () => {
  const testData = {
    droga: 'Ibuprofeno01',
    marca: 'Generica',
    presentacion: '500mg',
    laboratorio: 'Casasco',
    cobertura: '75',
    copago: '1000'
  };

  beforeEach(() => {
    cy.visit('https://api-medicamentos.libradev.com.ar/adminMeds.html');
  });

  it('Crear medicamento', () => {
    cy.contains('a', 'Crear').click(); // Sección lateral

    cy.get('#droga').type(testData.droga);
    cy.get('#marca').type(testData.marca);
    cy.get('#presentacion').type(testData.presentacion);
    cy.get('#laboratorio').type(testData.laboratorio);
    cy.get('#cobertura').type(testData.cobertura);
    cy.get('#copago').type(testData.copago);

    cy.get('button.btn.btn-success').contains('Crear').click(); // Botón verde

    cy.get('#outputCrear', { timeout: 8000 })
      .should('not.have.text', '')
      .invoke('text')
      .should(text => expect(text).to.match(/creado|correctamente|Medicamento/i));
  });


  it('Buscar medicamento por texto', () => {
    cy.contains('a', 'Buscar').click(); // Sección lateral

    cy.get('#buscarTexto').type(testData.marca);
    cy.get('button.btn.btn-primary').contains('Buscar').click(); // Botón azul

    cy.get('#resultadoBuscar', { timeout: 8000 })
      .should('not.have.text', '')
      .invoke('text')
      .should('include', testData.marca);
  });

  it('Editar un medicamento', () => {
    cy.contains('a', 'Editar').click(); // Sección lateral

    cy.get('#editarId').type('1');
    cy.get('#editarDroga').type('Actualizado');
    cy.get('#editarMarca').type('Generico1');
    cy.get('#editarPresentacion').type('650mg');
    cy.get('#editarLab').type('Casasco');
    cy.get('#editarCobertura').type('85');
    cy.get('#editarCopago').type('15');

    cy.get('button.btn.btn-warning').contains('Editar').click(); // Botón amarillo

    cy.get('#outputEditar', { timeout: 8000 })
      .should('not.have.text', '')
      .invoke('text')
      .should(text => expect(text).to.match(/actualizado|editado|Medicamento/i));
  });

  it('Eliminar un medicamento', () => {
    cy.contains('a', 'Eliminar').click(); // Sección lateral

    cy.get('#eliminarId').type('80');
    cy.get('button.btn.btn-danger').contains('Eliminar').click(); // Botón rojo

    cy.get('#outputEliminar', { timeout: 8000 })
      .should('not.have.text', '')
      .invoke('text')
      .should('include', 'eliminado');
  });
});
