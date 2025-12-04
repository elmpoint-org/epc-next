import gql from 'graphql-tag';

export default gql`
  "A singular payment from user to EPC."
  type Payment {
    id: ID!

    "the user making or intending to make this payment"
    user: User

    "the total dollar amount (USD)"
    amount: Int!

    "payment status. if set to STRIPE, check the stripe status instead."
    status: PaymentStatus!
    details: PaymentDetails!

    "optional: a stripe transaction, iff user chooses to pay with stripe"
    stripeTransaction: StripePaymentIntent

    timestamp: TS!
  }

  "a daily residence payment"
  type PaymentDetails_HeadTax {
    "the calendar reservation being paid for"
    stay: Stay
  }
  type PaymentDetails_AnnualDues {
    shares: Int!
  }
  type PaymentDetails_DayTripper {
    dayTripper: Boolean!
  }
  type PaymentDetails_Generic {
    description: String!
  }

  # ------------------------------------

  type Query {
    payment: Payment
  }

  # ------------------------------------

  union PaymentDetails =
      PaymentDetails_HeadTax
    | PaymentDetails_AnnualDues
    | PaymentDetails_DayTripper
    | PaymentDetails_Generic

  enum PaymentStatus {
    UNPAID
    PAYMENT_SENT
    PAID
    STRIPE
  }

  type StripePaymentIntent {
    id: ID!
    # TODO
  }
`;
