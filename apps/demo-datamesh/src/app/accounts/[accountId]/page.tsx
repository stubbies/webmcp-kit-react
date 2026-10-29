import { notFound } from 'next/navigation';
import { LedgerLoadForm } from '@/components/LedgerLoadForm';
import { LedgerTablePanel } from '@/components/LedgerTablePanel';
import { AccountDetailTools } from '@/components/mcp/AccountDetailTools';
import { getAccount, loadAccounts } from '@/app/actions';

type PageProps = {
  params: Promise<{ accountId: string }>;
};

export default async function AccountDetailPage({ params }: PageProps) {
  const { accountId } = await params;
  let account;
  try {
    account = await getAccount(accountId);
  } catch {
    notFound();
  }

  const accounts = await loadAccounts();

  return (
    <>
      <AccountDetailTools accountId={accountId} />
      <div className="card">
        <h2>{account.name}</h2>
        <p className="muted">
          {account.id} · {account.region} · {account.currency}
        </p>
        <p>
          MCP tools on this route include <code>get_account</code> and a ledger loader pre-scoped
          to <strong>{accountId}</strong>. Filter tools use prefix{' '}
          <code>account_{accountId}_</code>.
        </p>
      </div>
      <LedgerLoadForm accounts={accounts} scopedAccountId={accountId} />
      <LedgerTablePanel toolPrefix={`account_${accountId}_`} title={`Ledger — ${accountId}`} />
    </>
  );
}
