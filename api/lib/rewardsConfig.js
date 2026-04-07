// Reward structures for each card, keyed by card_product_id.
// This is application-layer enrichment — not part of Method's schema.
//
// points_value_cents: how much each point is worth in cents when redeemed
//   Chase UR:         1.25¢ (conservative — assumes travel portal redemption)
//   Apple Daily Cash: 1.00¢ (direct cash back)
//   Citi TYP:         1.00¢ (statement credit)
//
// reward_rules: evaluated in order; first matching rule wins.
// base_multiplier: applied when no rule matches.

const rewardsConfig = {
  cp_chase_sapphire_preferred: {
    card_product_id: 'cp_chase_sapphire_preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    points_currency: 'Chase Ultimate Rewards',
    points_value_cents: 1.25,
    reward_rules: [
      {
        category: 'dining',
        mcc_codes: ['5812', '5813', '5814'],
        multiplier: 3,
      },
      {
        category: 'travel',
        mcc_codes: ['4111', '4121', '4131', '4411', '4511', '7011', '7512'],
        multiplier: 2,
      },
    ],
    base_multiplier: 1,
  },

  cp_apple_card: {
    card_product_id: 'cp_apple_card',
    name: 'Apple Card',
    issuer: 'Goldman Sachs',
    points_currency: 'Daily Cash',
    points_value_cents: 1.0,
    reward_rules: [
      {
        category: 'apple_tech',
        mcc_codes: ['5045', '5734', '7372'],
        multiplier: 3,
      },
    ],
    base_multiplier: 2,
  },

  cp_citi_double_cash: {
    card_product_id: 'cp_citi_double_cash',
    name: 'Citi Double Cash Card',
    issuer: 'Citi',
    points_currency: 'Citi ThankYou Points',
    points_value_cents: 1.0,
    reward_rules: [],
    base_multiplier: 2,
  },
};

module.exports = rewardsConfig;
