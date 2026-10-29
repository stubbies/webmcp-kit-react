import Link from 'next/link';
import { AccountsListTools } from '@/components/mcp/AccountsListTools';
import { loadAccounts } from '@/app/actions';

export default async function AccountsPage() {
  const accounts = await loadAccounts();

  return (
    <>
      <AccountsListTools />
      <div className="card">
        <h2>Mesh accounts</h2>
        <ul className="account-list">
          {accounts.map((a) => (
            <li key={a.id}>
              <Link href={`/accounts/${a.id}`}>
                <strong>{a.id}</strong> — {a.name}
              </Link>
              <div className="muted">
                {a.region} · {a.currency}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
