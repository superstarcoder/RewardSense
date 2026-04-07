// Maps MCC codes to human-readable category labels.
// Used to group transactions for display and insight aggregation.

const mccCategories = {
  // Dining
  '5812': { label: 'Dining', group: 'dining' },
  '5813': { label: 'Dining', group: 'dining' },
  '5814': { label: 'Dining', group: 'dining' },

  // Travel & Rideshare
  '4111': { label: 'Transit', group: 'travel' },
  '4121': { label: 'Rideshare', group: 'travel' },
  '4131': { label: 'Bus Lines', group: 'travel' },
  '4411': { label: 'Cruise Lines', group: 'travel' },
  '4511': { label: 'Airlines', group: 'travel' },
  '7011': { label: 'Hotels', group: 'travel' },
  '7512': { label: 'Car Rental', group: 'travel' },

  // Apple / Tech
  '5045': { label: 'Apple & Tech', group: 'apple_tech' },
  '5734': { label: 'Apple & Tech', group: 'apple_tech' },
  '7372': { label: 'Apple & Tech', group: 'apple_tech' },

  // Groceries
  '5411': { label: 'Groceries', group: 'groceries' },
  '5412': { label: 'Groceries', group: 'groceries' },

  // Retail / Amazon
  '5999': { label: 'Shopping', group: 'shopping' },
  '5942': { label: 'Shopping', group: 'shopping' },
  '5961': { label: 'Shopping', group: 'shopping' },
  '5310': { label: 'Shopping', group: 'shopping' },

  // Entertainment
  '7832': { label: 'Entertainment', group: 'entertainment' },
  '7922': { label: 'Entertainment', group: 'entertainment' },
  '7991': { label: 'Entertainment', group: 'entertainment' },

  // Gas
  '5541': { label: 'Gas', group: 'gas' },
  '5542': { label: 'Gas', group: 'gas' },
};

// Returns the category for a given MCC code.
// Falls back to { label: 'Other', group: 'other' } for unmapped codes.
function getCategory(mcc) {
  return mccCategories[mcc] || { label: 'Other', group: 'other' };
}

module.exports = { mccCategories, getCategory };
