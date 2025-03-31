const pizzas = [
  {
    _id: '6603ff1a2d8a2f8e36a57c41',
    name: 'Margherita',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Fresh Basil', 'Extra Virgin Olive Oil'],
    prices: {
      small: 249,
      medium: 349,
      large: 499
    },
    category: 'vegetarian',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c42',
    name: 'Pepperoni',
    description: 'America\'s favorite pizza topped with spicy pepperoni slices.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Pepperoni'],
    prices: {
      small: 299,
      medium: 399,
      large: 549
    },
    category: 'non-vegetarian',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c43',
    name: 'Veggie Supreme',
    description: 'Loaded with fresh vegetables and topped with extra cheese.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Bell Peppers', 'Mushrooms', 'Onions', 'Black Olives', 'Sweet Corn'],
    prices: {
      small: 279,
      medium: 389,
      large: 529
    },
    category: 'vegetarian',
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c44',
    name: 'BBQ Chicken',
    description: 'Tender chicken pieces with onions and bell peppers, drizzled with BBQ sauce.',
    ingredients: ['BBQ Sauce', 'Mozzarella Cheese', 'Grilled Chicken', 'Red Onions', 'Bell Peppers'],
    prices: {
      small: 329,
      medium: 429,
      large: 599
    },
    category: 'non-vegetarian',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c45',
    name: 'Tandoori Paneer',
    description: 'A fusion pizza with tandoori marinated paneer, bell peppers, and onions.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Tandoori Paneer', 'Bell Peppers', 'Red Onions', 'Coriander'],
    prices: {
      small: 299,
      medium: 399,
      large: 549
    },
    category: 'vegetarian',
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c46',
    name: 'Chicken Tikka',
    description: 'Spicy Indian-style chicken tikka pieces with onions and bell peppers.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Chicken Tikka', 'Red Onions', 'Bell Peppers', 'Coriander'],
    prices: {
      small: 329,
      medium: 429,
      large: 599
    },
    category: 'non-vegetarian',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c47',
    name: 'Cheese Overload',
    description: 'For the cheese lovers - loaded with four different types of cheese.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Cheddar Cheese', 'Parmesan Cheese', 'Feta Cheese'],
    prices: {
      small: 299,
      medium: 399,
      large: 549
    },
    category: 'vegetarian',
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '6603ff1a2d8a2f8e36a57c48',
    name: 'Meat Feast',
    description: 'A carnivore\'s delight with pepperoni, chicken, ham, and bacon.',
    ingredients: ['Tomato Sauce', 'Mozzarella Cheese', 'Pepperoni', 'Grilled Chicken', 'Ham', 'Bacon'],
    prices: {
      small: 349,
      medium: 449,
      large: 649
    },
    category: 'non-vegetarian',
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }
];

export default pizzas; 