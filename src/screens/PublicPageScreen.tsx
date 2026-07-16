import { useState } from 'react';
import { sx } from '../lib/sx';
import type { Locale } from '../data/content';
import type { NewFeatureStrings } from '../data/newFeatures';
import type { ServiceItem } from '../lib/types';

interface BookingData {
  service: ServiceItem;
  time: string;
  name: string;
  phone: string;
}

interface PublicPageScreenProps {
  t: Locale;
  strings: NewFeatureStrings['publicBooking'];
  publicName: string;
  services: ServiceItem[];
  availableSlots: string[];
  isWorkingToday: boolean;
  fmtPrice: (n: number) => string;
  onConfirmBooking: (data: BookingData) => void;
  onClose: () => void;
}

export function PublicPageScreen({
  t,
  strings,
  publicName,
  services,
  availableSlots,
  isWorkingToday,
  fmtPrice,
  onConfirmBooking,
  onClose,
}: PublicPageScreenProps) {
  const p = t.publicPage;
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId) ?? null;
  const inputStyle = sx(
    "height:46px; border-radius:12px; border:1px solid #EBE2CF; padding:0 14px; font-size:14px; font-family:'Manrope',sans-serif; box-sizing:border-box; width:100%;",
  );

  function confirm() {
    if (!selectedService || !time || !name.trim() || !phone.trim()) return;
    onConfirmBooking({ service: selectedService, time, name: name.trim(), phone: phone.trim() });
    setConfirmed(true);
  }

  return (
    <div style={sx('position:absolute; inset:0; z-index:80; background:#FAF7F0; overflow-y:auto; -webkit-overflow-scrolling:touch;')}>
      <div
        style={sx(
          'position:sticky; top:0; z-index:10; display:flex; justify-content:flex-end; padding:16px; background:linear-gradient(180deg, rgba(32,28,23,0.35), transparent);',
        )}
      >
        <div
          onClick={onClose}
          role="button"
          aria-label={t.today.readyResponsesCloseLabel}
          style={sx(
            'cursor:pointer; width:34px; height:34px; border-radius:50%; background:rgba(32,28,23,0.4); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center;',
          )}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#FAF7F0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l12 12M13 1 1 13"></path>
          </svg>
        </div>
      </div>

      <div
        style={sx(
          'margin-top:-54px; padding:74px 24px 30px; box-sizing:border-box; text-align:center; background:radial-gradient(120% 100% at 50% 0%, #2B261F 0%, #201C17 60%, #17130F 100%); color:#F4E9D2; position:relative;',
        )}
      >
        <div style={sx('position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, transparent, #C9A24B, transparent);')} />
        <div style={sx('width:80px; height:80px; border-radius:50%; margin:0 auto 16px; border:2px solid #C9A24B; padding:3px; box-sizing:border-box;')}>
          <div
            style={sx(
              'width:100%; height:100%; border-radius:50%; background:repeating-linear-gradient(135deg,#3A342C,#3A342C 6px,#332E27 6px,#332E27 12px); display:flex; align-items:center; justify-content:center; font-size:7px; font-family:monospace; color:#C9A24B; letter-spacing:0.4px;',
            )}
          >
            {p.photoLabel}
          </div>
        </div>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; letter-spacing:0.3px;")}>{publicName || p.name}</div>
        <div
          style={sx(
            'display:inline-block; margin-top:8px; padding:5px 14px; border:1px solid #C9A24B; border-radius:999px; font-size:11px; color:#E3C989; font-weight:700; letter-spacing:0.6px; text-transform:uppercase;',
          )}
        >
          {p.role}
        </div>
        <div style={sx('font-size:12px; color:#B7AE9C; margin-top:14px; line-height:1.6; max-width:280px; margin-left:auto; margin-right:auto;')}>{p.bio}</div>
      </div>

      <div style={sx('padding:18px 24px; display:flex; gap:8px; border-bottom:1px solid #EBE2CF; background:#FFFFFF;')}>
        <div style={sx('flex:1; text-align:center; padding:10px 4px; border-radius:12px; background:#FBF6EA;')}>
          <div style={sx('font-size:10px; color:#8A8074; text-transform:uppercase; letter-spacing:0.4px; font-weight:700;')}>Instagram</div>
          <div style={sx('font-size:12px; font-weight:700; margin-top:3px; color:#26221D;')}>{p.instagram}</div>
        </div>
        <div style={sx('flex:1; text-align:center; padding:10px 4px; border-radius:12px; background:#FBF6EA;')}>
          <div style={sx('font-size:10px; color:#8A8074; text-transform:uppercase; letter-spacing:0.4px; font-weight:700;')}>WhatsApp</div>
          <div style={sx('font-size:12px; font-weight:700; margin-top:3px; color:#26221D;')}>{p.whatsapp}</div>
        </div>
        <div style={sx('flex:1; text-align:center; padding:10px 4px; border-radius:12px; background:#FBF6EA;')}>
          <div style={sx('font-size:10px; color:#8A8074; text-transform:uppercase; letter-spacing:0.4px; font-weight:700;')}>{p.locationLabel}</div>
          <div style={sx('font-size:12px; font-weight:700; margin-top:3px; color:#26221D;')}>{p.location}</div>
        </div>
      </div>

      <div style={sx('padding:22px 24px; background:#FFFFFF;')}>
        {confirmed ? (
          <div style={sx('text-align:center; padding:26px 0;')}>
            <div style={sx('width:52px; height:52px; border-radius:50%; background:#FBF3E4; display:flex; align-items:center; justify-content:center; margin:0 auto 14px;')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8A6A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:19px; color:#201C17;")}>{strings.confirmedTitle}</div>
            <div style={sx('font-size:12px; color:#8A8074; margin-top:6px;')}>{strings.confirmedSubtitle}</div>
          </div>
        ) : (
          <>
            <div style={sx('font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#B98D3E; margin-bottom:14px;')}>{strings.step1}</div>
            <div style={sx('display:flex; flex-direction:column; gap:10px; margin-bottom:20px;')}>
              {services.map((svc) => {
                const active = svc.id === serviceId;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setServiceId(svc.id)}
                    data-testid={`booking-service-${svc.id}`}
                    style={{
                      ...sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; border-radius:14px;'),
                      border: `1.5px solid ${active ? '#B98D3E' : '#EBE2CF'}`,
                      background: active ? '#FBF3E4' : '#FFFFFF',
                    }}
                  >
                    <div>
                      <div style={sx("font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:600; color:#26221D;")}>{svc.name}</div>
                      <div style={sx('font-size:12px; color:#B98D3E; font-weight:700; margin-top:2px;')}>{fmtPrice(svc.price)}</div>
                    </div>
                    <div
                      style={{
                        ...sx('flex-shrink:0; padding:9px 16px; border-radius:999px; font-size:12px; font-weight:700;'),
                        background: active ? '#201C17' : '#F6EFE1',
                        color: active ? '#F4E9D2' : '#8A6A2E',
                        border: `1px solid ${active ? '#201C17' : '#E3C989'}`,
                      }}
                    >
                      {active ? p.selectedLabel : p.selectLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={sx('font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#B98D3E; margin-bottom:14px;')}>{strings.step2}</div>
            <div style={sx('display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;')}>
              {!isWorkingToday && <span style={sx('font-size:12px; color:#B0A78F;')}>{strings.notWorkingDay}</span>}
              {isWorkingToday && availableSlots.length === 0 && <span style={sx('font-size:12px; color:#B0A78F;')}>{strings.noSlots}</span>}
              {isWorkingToday &&
                availableSlots.map((slot) => {
                  const active = slot === time;
                  return (
                    <div
                      key={slot}
                      onClick={() => setTime(slot)}
                      data-testid={`booking-slot-${slot}`}
                      style={{
                        ...sx("cursor:pointer; padding:10px 16px; border-radius:12px; font-family:'Cormorant Garamond',serif; font-size:13.5px; font-weight:600;"),
                        border: `1.5px solid ${active ? '#B98D3E' : '#EBE2CF'}`,
                        background: active ? '#201C17' : '#FFFFFF',
                        color: active ? '#F4E9D2' : '#26221D',
                      }}
                    >
                      {slot}
                    </div>
                  );
                })}
            </div>

            <div style={sx('font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#B98D3E; margin-bottom:14px;')}>{strings.step3}</div>
            <div style={sx('display:flex; flex-direction:column; gap:10px; margin-bottom:20px;')}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={strings.namePlaceholder} style={inputStyle} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={strings.phonePlaceholder} style={inputStyle} />
            </div>

            {selectedService && (
              <div style={sx('display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-radius:14px; background:#FBF3E4; margin-bottom:16px;')}>
                <div>
                  <div style={sx('font-size:12.5px; font-weight:700; color:#201C17;')}>
                    {selectedService.name}
                    {time ? ` · ${time}` : ''}
                  </div>
                  <div style={sx('font-size:10.5px; color:#8A8074; margin-top:2px;')}>{selectedService.duration} min</div>
                </div>
                <div style={sx("font-family:'Cormorant Garamond',serif; font-size:16px; color:#8A6A2E; font-weight:600;")}>{fmtPrice(selectedService.price)}</div>
              </div>
            )}

            <div
              onClick={confirm}
              style={{
                ...sx(
                  'height:52px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; letter-spacing:0.3px;',
                ),
                cursor: selectedService && time && name.trim() && phone.trim() ? 'pointer' : 'default',
                background:
                  selectedService && time && name.trim() && phone.trim()
                    ? 'linear-gradient(90deg,#201C17,#2B261F)'
                    : '#EBE2CF',
                color: selectedService && time && name.trim() && phone.trim() ? '#F4E9D2' : '#B0A78F',
              }}
            >
              {strings.confirmCta}
            </div>
          </>
        )}
      </div>

      <div style={sx('padding:22px 24px; background:#FFFFFF; border-top:1px solid #EBE2CF;')}>
        <div style={sx('font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#B98D3E; margin-bottom:14px;')}>{p.portfolioLabel}</div>
        <div style={sx('display:grid; grid-template-columns:repeat(3,1fr); gap:8px;')}>
          {p.portfolio.map((photo, i) => (
            <div
              key={i}
              style={sx(
                'aspect-ratio:1; border-radius:12px; background:repeating-linear-gradient(135deg,#F0E6D2,#F0E6D2 6px,#EADCC0 6px,#EADCC0 12px); display:flex; align-items:center; justify-content:center; font-size:7px; font-family:monospace; color:#8A6A2E; text-align:center; padding:4px; box-sizing:border-box; border:1px solid #EBE2CF;',
              )}
            >
              {photo}
            </div>
          ))}
        </div>
      </div>

      <div style={sx('padding:16px 24px calc(env(safe-area-inset-bottom, 0px) + 28px); background:#FAF7F0; text-align:center;')}>
        <div style={sx('font-size:10px; color:#B0A78F; letter-spacing:0.3px;')}>{p.poweredBy}</div>
      </div>
    </div>
  );
}
