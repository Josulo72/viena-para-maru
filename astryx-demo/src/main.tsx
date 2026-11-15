import {createRoot} from 'react-dom/client';
import {useState} from 'react';
import './styles.css';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {Button} from '@astryxdesign/core/Button';

function App() {
  const [n, setN] = useState(0);
  return (
    <Theme theme={neutralTheme}>
      <div style={{padding: 32, display: 'flex', gap: 12, alignItems: 'center'}}>
        <Button label="Primario" variant="primary" onClick={() => setN(n + 1)} />
        <Button label="Secundario" />
        <Button label="Borrar" variant="destructive" />
        <span>Clicks: {n}</span>
      </div>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
