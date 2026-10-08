import { T } from '../theme';
import { Card, SectionTitle } from '../components/primitives';
import { useLang } from '../lib/LangContext';

export function ManualScreen() {
  const { t } = useLang();

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 25, fontWeight: 400, color: T.ink, marginBottom: 8 }}>{t.manual.title}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted, marginBottom: 22, lineHeight: 1.5 }}>{t.manual.intro}</div>

      {t.manual.sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 20 }}>
          <SectionTitle>{section.title}</SectionTitle>
          <Card>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ fontFamily: 'Inter', fontSize: 13, color: T.ink, lineHeight: 1.55 }}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ))}
    </div>
  );
}
