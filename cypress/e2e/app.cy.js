/// <reference types="cypress" />

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

    cy.wait(1000);
  }

  static hitEnter() {
    cy.focused().type('{enter}');

    cy.wait(1000);
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
      RegisterForm.typeImageUrl('');
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

        expect(color).to.equal(RegisterForm.colors.error);
      });
    });
  });

  describe('Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const titleMock = 'Alien BR';
    const imageUrlMock =
      'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg';

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it(`When I enter "${titleMock}" in the title field`, () => {
      RegisterForm.typeTitle(titleMock);
    });

    it(`When I enter "${imageUrlMock}" in the URL field`, () => {
      RegisterForm.typeImageUrl(imageUrlMock);
    });

    it('Then I can hit enter to submit the form', () => {
      RegisterForm.hitEnter();
    });

    it('And the list of registered images should be updated with the new item', () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1];

        const lastElementSrc = lastElement.getAttribute('src');

        expect(lastElementSrc).to.equal(imageUrlMock);
      });
    });

    it('And the new item should be stored in the localStorage', () => {
      cy.getAllLocalStorage().should((localStorage) => {
        const storageData = localStorage[window.location.origin];

        const elements = JSON.parse(Object.values(storageData));

        const lastElement = elements[elements.length - 1];

        expect(lastElement).to.deep.equal({
          title: titleMock,
          imageUrl: imageUrlMock,
        });
      });
    });

    it('Then The inputs should be cleared', () => {
      RegisterForm.elements.titleInput().should('have.value', '');

      RegisterForm.elements.imageUrlInput().should('have.value', '');
    });
  });

  describe('Submitting an image and updating the list', () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const titleMock = 'Alien BR';
    const imageUrlMock =
      'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg';

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it(`Then I have entered "${titleMock}" in the title field`, () => {
      RegisterForm.typeTitle(titleMock);
    });

    it(`Then I have entered "${imageUrlMock}" in the URL field`, () => {
      RegisterForm.typeImageUrl(imageUrlMock);
    });

    it('When I click the submit button', () => {
      RegisterForm.clickSubmitButton();
    });

    it('And the list of registered images should be updated with the new item', () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1];

        const lastElementSrc = lastElement.getAttribute('src');

        expect(lastElementSrc).to.equal(imageUrlMock);
      });
    });

    it('And the new item should be stored in the localStorage', () => {
      cy.getAllLocalStorage().should((localStorage) => {
        const storageData = localStorage[window.location.origin];

        const elements = JSON.parse(Object.values(storageData));

        const lastElement = elements[elements.length - 1];

        expect(lastElement).to.deep.equal({
          title: titleMock,
          imageUrl: imageUrlMock,
        });
      });
    });

    it('Then The inputs should be cleared', () => {
      RegisterForm.elements.titleInput().should('have.value', '');

      RegisterForm.elements.imageUrlInput().should('have.value', '');
    });
  });

  describe('Refreshing the page after submitting an image clicking in the submit button', () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const titleMock = 'Alien BR';
    const imageUrlMock =
      'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg';

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it('Then I have submitted an image by clicking the submit button', () => {
      RegisterForm.typeTitle(titleMock);

      RegisterForm.typeImageUrl(imageUrlMock);

      RegisterForm.clickSubmitButton();
    });

    it('When I refresh the page', () => {
      cy.reload();
    });

    it('Then I should still see the submitted image in the list of registered images', () => {
      cy.getAllLocalStorage().should((localStorage) => {
        const storageData = localStorage[window.location.origin];

        const elements = JSON.parse(Object.values(storageData));

        const lastElement = elements[elements.length - 1];

        expect(lastElement).to.deep.equal({
          title: titleMock,
          imageUrl: imageUrlMock,
        });
      });
    });
  });
});
