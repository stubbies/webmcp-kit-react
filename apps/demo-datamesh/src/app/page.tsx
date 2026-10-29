import Link from 'next/link';
import { HubMeshTools } from '@/components/mcp/HubMeshTools';

export default function HubPage() {
  return (
    <>
      <HubMeshTools />
      <div className="card">
        <h2>How this demo works</h2>
        <ol>
          <li>
            <strong>Server Actions</strong> load secure ledger windows (entity + date range) into
            the browser session.
          </li>
          <li>
            <strong>Client filter tools</strong> (`ledger_*` on the ledger routes) refine thousands
            of rows in memory without round-trips.
          </li>
          <li>
            <strong>Export</strong> sends the current filter snapshot back through a Server Action
            for server-side re-validation.
          </li>
        </ol>
        <p>
          Open <Link href="/ledger">Ledger</Link> to load a window, or browse{' '}
          <Link href="/accounts">Accounts</Link> for param-scoped tools.
        </p>
      </div>
    </>
  );
}
