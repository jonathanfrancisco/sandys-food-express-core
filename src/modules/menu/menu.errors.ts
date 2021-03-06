export default {
  InvalidFoodPicture: {
    code: 'INVALID_FOOD_PICTURE',
    message: 'Invalid picture. Please try again',
  },
  EmailAlreadyUsed: {
    code: 'USER_EMAIL_ALREADY_EXISTS',
    message: 'Email address has already been taken by another user',
  },
  Unauthorized: {
    code: 'UNAUTHORIZED',
    message: `You're not authorized to access this endpoint`,
  },
  FoodNotFound: {
    code: 'FOOD_NOT_FOUND',
    message: 'Food does not exist',
  },
  FoodInUseInMenu: {
    code: 'FOOD_IN_USE_IN_MENU',
    message: 'Food is currently scheduled in one or more menus you have created'
  }
};
