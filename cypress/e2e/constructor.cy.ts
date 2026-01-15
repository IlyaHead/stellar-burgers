describe('Проверка функциональности конструктора бургеров', () => {
  
  beforeEach(() => {
    // Настраиваем перехват сетевых запросов перед каждым тестом
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');

    // Загружаем главную страницу и дожидаемся ингредиентов
    cy.visit('/');
    cy.wait('@getIngredients');

    // Имитируем авторизацию для сценариев заказа
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'test-access-token');
    });
    cy.setCookie('refreshToken', 'test-refresh-token');
  });

  afterEach(() => {
    // Обязательная очистка данных авторизации после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('1. Проверка корректного отображения главной страницы', () => {
    cy.get('h1').should('contain', 'Соберите бургер');
  });

  it('2. Проверка добавления булки в рабочую область', () => {
    cy.fixture('ingredients.json').then((data) => {
      const ingredientsList = data.data || data;
      const bun = ingredientsList.find((i: any) => i.type === 'bun');
      
      cy.get(`[data-cy="ingredient-${bun._id}"]`).find('button').click();
      cy.get('[data-cy="burger-constructor"]').should('contain', bun.name);
    });
  });

  it('3. Проверка добавления основного ингредиента (начинки)', () => {
    cy.fixture('ingredients.json').then((data) => {
      const ingredientsList = data.data || data;
      const main = ingredientsList.find((i: any) => i.type === 'main');
      
      cy.get(`[data-cy="ingredient-${main._id}"]`).find('button').click();
      cy.get('[data-cy="burger-constructor"]').should('contain', main.name);
    });
  });

  it('4. Проверка открытия модального окна с описанием ингредиента', () => {
    cy.fixture('ingredients.json').then((data) => {
      const ingredientsList = data.data || data;
      const ingredient = ingredientsList[0];
      
      cy.get(`[data-cy="ingredient-${ingredient._id}"] [data-cy="ingredient-link"]`).click();
      cy.get('[data-cy="modal"]').should('be.visible').and('contain', ingredient.name);
    });
  });

  it('5. Проверка закрытия модального окна кликом по крестику', () => {
    cy.get('[data-cy="ingredient-link"]').first().click();
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('6. Проверка закрытия модального окна кликом на оверлей или кнопкой Esc', () => {
    // Тестируем клик по темной области (оверлею)
    cy.get('[data-cy="ingredient-link"]').first().click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
    
    // Тестируем закрытие через клавиатуру
    cy.get('[data-cy="ingredient-link"]').first().click();
    cy.get('body').type('{esc}');
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('7. Проверка полного цикла заказа и последующей очистки конструктора', () => {
    cy.fixture('ingredients.json').then((data) => {
      const ingredientsList = data.data || data;
      const bun = ingredientsList.find((i: any) => i.type === 'bun');
      const main = ingredientsList.find((i: any) => i.type === 'main');

      // Добавляем ингредиенты
      cy.get(`[data-cy="ingredient-${bun._id}"]`).find('button').click();
      cy.get(`[data-cy="ingredient-${main._id}"]`).find('button').click();

      // Нажимаем на кнопку заказа и ждем ответа от API
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@postOrder');

      // Проверяем отображение номера заказа в модальном окне
      cy.get('[data-cy="order-number"]').should('contain', '12345');
      cy.get('[data-cy="modal-close"]').click();
      
      // Проверяем, что корзина очистилась после успешного заказа
      cy.get('[data-cy="burger-constructor"]')
        .should('not.contain', bun.name)
        .and('not.contain', main.name);
    });
  });
});