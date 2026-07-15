import type { ReactNode } from 'react';
import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { Section, DeviceRow } from '../components/Section';
import type { Locale, OnboardingStep } from '../data/content';

function OptionList({ options }: { options: OnboardingStep['options'] }) {
  return (
    <div style={sx('display:flex; flex-direction:column; gap:12px;')}>
      {options.map((opt) => (
        <div
          key={opt.label}
          style={{
            ...sx('display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-radius:14px;'),
            border: `1.5px solid ${opt.borderColor}`,
            background: opt.bg,
          }}
        >
          <span style={sx('font-size:16px; font-weight:600;')}>{opt.label}</span>
          {opt.selected && <div style={sx('width:10px; height:10px; border-radius:50%; background:#B98D3E;')} />}
        </div>
      ))}
    </div>
  );
}

function StepFrame({ step, title, subtitle, children, cta }: { step: string; title: string; subtitle: string; children: ReactNode; cta: string }) {
  return (
    <IOSDevice>
      <div style={sx('height:100%; display:flex; flex-direction:column; padding:78px 28px 40px; box-sizing:border-box; background:#FFFFFF;')}>
        <div style={sx('font-size:12px; letter-spacing:2px; color:#B98D3E; font-weight:700; text-transform:uppercase;')}>{step}</div>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:16px; margin-bottom:6px;")}>{title}</div>
        <div style={sx('font-size:14px; color:#8A8074; margin-bottom:28px;')}>{subtitle}</div>
        {children}
        <div style={sx('flex:1;')} />
        <div
          style={sx(
            'height:50px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:600; letter-spacing:0.4px;',
          )}
        >
          {cta}
        </div>
      </div>
    </IOSDevice>
  );
}

export function Onboarding({ t }: { t: Locale }) {
  const o = t.onboarding;
  return (
    <Section label={t.sectionLabels.onboarding} heading={o.heading}>
      <DeviceRow>
        <StepFrame step={`${o.step} 1 / 4`} title={o.s1.title} subtitle={o.s1.subtitle} cta={o.next}>
          <OptionList options={o.s1.options} />
        </StepFrame>

        <StepFrame step={`${o.step} 2 / 4`} title={o.s3.title} subtitle={o.s3.subtitle} cta={o.next}>
          <OptionList options={o.s3.options} />
        </StepFrame>

        <StepFrame step={`${o.step} 3 / 4`} title={o.s4.title} subtitle={o.s4.subtitle} cta={o.next}>
          <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
            {o.s4.options.map((opt) => (
              <div
                key={opt.label}
                style={{
                  ...sx('display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-radius:14px;'),
                  border: `1.5px solid ${opt.borderColor}`,
                  background: opt.bg,
                }}
              >
                <span style={sx('font-size:15px; font-weight:600;')}>{opt.label}</span>
                {opt.selected && <div style={sx('width:10px; height:10px; border-radius:50%; background:#B98D3E;')} />}
              </div>
            ))}
          </div>
        </StepFrame>

        <StepFrame step={`${o.step} 4 / 4`} title={o.s5.title} subtitle={o.s5.subtitle} cta={o.finish}>
          <div style={sx('text-align:center; padding:28px 0;')}>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:600; color:#201C17;")}>{o.s5.amount}</div>
            <div style={sx('font-size:13px; color:#8A8074; margin-top:6px;')}>{o.s5.perMonth}</div>
          </div>
          <div style={sx('height:6px; border-radius:999px; background:#F0E6D2; margin:8px 0 30px; overflow:hidden;')}>
            <div style={sx('width:62%; height:100%; background:#B98D3E;')} />
          </div>
        </StepFrame>
      </DeviceRow>
    </Section>
  );
}
