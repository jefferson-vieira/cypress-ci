/// <reference types="cypress" />

import assert from 'assert';

class RegisterForm {
  static colors = {
    error: 'rgb(220, 53, 69)',
  };

  static elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    imageUrlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit'),
  };

  static typeTitle(title) {
    if (!title) {
      return;
    }

    this.elements.titleInput().type(title);
  }

  static typeImageUrl(imageUrl) {
    if (!imageUrl) {
      return;
    }

    this.elements.imageUrlInput().type(imageUrl);
  }

  static clickSubmitButton() {
    this.elements.submitBtn().click();
  }
}

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it(`When I enter "" in the title field`, () => {
      RegisterForm.typeTitle('');
    });

    it(`Then I enter "" in the URL field`, () => {
      RegisterForm.typeTitle('');
    });

    it('Then I click the submit button', () => {
      RegisterForm.clickSubmitButton();
    });

    it('Then I should see "Please type a title for the image" message above the title field', () => {
      RegisterForm.elements
        .titleFeedback()
        .should('contains.text', 'Please type a title for the image');
    });

    it('And I should see "Please type a valid URL" message above the imageUrl field', () => {
      RegisterForm.elements
        .imageUrlFeedback()
        .should('contains.text', 'Please type a valid URL');
    });

    it('And I should see an exclamation icon in the title and URL fields', () => {
      RegisterForm.elements.imageUrlFeedback().should(([element]) => {
        const styles = window.getComputedStyle(element);

        const color = styles.getPropertyValue('border-right-color');

        assert.strictEqual(color, RegisterForm.colors.error);
      });
    });
  });
});
