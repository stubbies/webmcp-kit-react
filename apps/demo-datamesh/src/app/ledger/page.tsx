import { LedgerLoadForm } from '@/components/LedgerLoadForm';
import { LedgerTablePanel } from '@/components/LedgerTablePanel';
import { LedgerPageTools } from '@/components/mcp/LedgerPageTools';
import { loadAccounts } from '@/app/actions';

export default async function LedgerPage() {
  const accounts = await loadAccounts();

  return (
    <>
      <LedgerPageTools />
      <LedgerLoadForm accounts={accounts} />
      <LedgerTablePanel toolPrefix="ledger_" />
    </>
  );
}
