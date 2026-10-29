import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { useMcpRegistry } from './McpProvider';

const panelStyle: CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  width: 360,
  maxHeight: '70vh',
  background: '#1e1e2e',
  color: '#cdd6f4',
  border: '1px solid #45475a',
  borderRadius: 8,
  fontFamily: 'ui-monospace, monospace',
  fontSize: 12,
  zIndex: 99999,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

export function McpDevTools({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [payload, setPayload] = useState('{}');
  const [invokeResult, setInvokeResult] = useState<string | null>(null);
  const [invokeError, setInvokeError] = useState<string | null>(null);
  const tools = useMcpRegistry();

  const selected = useMemo(
    () => tools.find((t) => t.name === selectedName) ?? tools[0],
    [tools, selectedName],
  );

  const invoke = useCallback(async () => {
    if (!selected || !document.modelContext) {
      setInvokeError('WebMCP not available');
      return;
    }
    setInvokeError(null);
    setInvokeResult(null);
    try {
      const parsed = JSON.parse(payload) as object;
      const registered = await document.modelContext.getTools();
      const tool = registered.find((t) => t.name === selected.name);
      if (!tool) {
        setInvokeError(`Tool "${selected.name}" not found in getTools()`);
        return;
      }
      const result = await document.modelContext.executeTool(tool, parsed);
      setInvokeResult(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    } catch (e) {
      setInvokeError(e instanceof Error ? e.message : String(e));
    }
  }, [selected, payload]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 99999,
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #45475a',
          background: '#313244',
          color: '#cdd6f4',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        MCP DevTools
      </button>
    );
  }

  return (
    <div style={panelStyle}>
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #45475a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong>WebMCP DevTools</strong>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{ background: 'transparent', border: 'none', color: '#cdd6f4', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: 8, overflow: 'auto', flex: 1 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Tool</label>
        <select
          value={selected?.name ?? ''}
          onChange={(e) => setSelectedName(e.target.value)}
          style={{ width: '100%', marginBottom: 8, background: '#313244', color: '#cdd6f4', border: '1px solid #45475a' }}
        >
          {tools.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} {t.registered ? '✓' : '…'}
            </option>
          ))}
        </select>
        {selected && (
          <>
            <p style={{ margin: '0 0 8px', opacity: 0.85 }}>{selected.description}</p>
            <label style={{ display: 'block', marginBottom: 4 }}>Payload (JSON)</label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#313244',
                color: '#cdd6f4',
                border: '1px solid #45475a',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="button"
              onClick={() => void invoke()}
              style={{
                marginTop: 8,
                padding: '6px 12px',
                background: '#89b4fa',
                color: '#1e1e2e',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Invoke
            </button>
            {invokeError && (
              <pre style={{ color: '#f38ba8', marginTop: 8, whiteSpace: 'pre-wrap' }}>{invokeError}</pre>
            )}
            {invokeResult && (
              <pre style={{ color: '#a6e3a1', marginTop: 8, whiteSpace: 'pre-wrap' }}>{invokeResult}</pre>
            )}
            {selected.lastResult !== undefined && selected.lastInvokedAt && (
              <div style={{ marginTop: 12 }}>
                <div style={{ opacity: 0.7 }}>Last execute via hook:</div>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selected.lastResult, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
        {tools.length === 0 && <p>No tools registered in provider.</p>}
      </div>
    </div>
  );
}
