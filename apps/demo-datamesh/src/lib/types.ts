export type TransactionStatus = 'posted' | 'pending' | 'failed';

export type Account = {
  id: string;
  name: string;
  region: string;
  currency: string;
};

export type Counterparty = {
  id: string;
  name: string;
  sector: string;
};

export type LedgerTransaction = {
  id: string;
  accountId: string;
  counterpartyId: string;
  bookedAt: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  memo: string;
};

export type LedgerRow = LedgerTransaction & {
  accountName: string;
  counterpartyName: string;
};
