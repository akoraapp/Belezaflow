import type { ChangeEvent } from 'react';
import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY, LABEL_KICKER } from '../components/Section';
import type { Locale } from '../data/content';

export interface InventoryLowProduct {
  name: string;
  qty: number;
  unit: string;
}

export interface InventoryAlertWithAction {
  text: string;
  actionLabel: string;
}

export interface InventoryConsumptionEntry {
  service: string;
  items: string[];
  expanded: boolean;
  toggleLabel: string;
  onToggle: () => void;
}

export interface InventoryProductRow {
  name: string;
  qty: number;
  unit: string;
  statusBg: string;
  statusColor: string;
  statusLabel: string;
}

interface InventoryProps {
  t: Locale;
  inventoryTotalInvested: string;
  inventoryProductCountLabel: string;
  inventoryAlertsWithAction: InventoryAlertWithAction[];
  inventoryHasLow: boolean;
  inventoryLowHeadline: string;
  inventoryLowProducts: InventoryLowProduct[];
  inventoryConsumptionList: InventoryConsumptionEntry[];
  inventoryAllProducts: InventoryProductRow[];
  addFormOpen: boolean;
  addFormToggleLabel: string;
  addFormName: string;
  addFormQty: string;
  addFormValue: string;
  toggleAddForm: () => void;
  onAddFormNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddFormQtyChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddFormValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddFormSubmit: () => void;
}

export function Inventory({
  t,
  inventoryTotalInvested,
  inventoryProductCountLabel,
  inventoryAlertsWithAction,
  inventoryHasLow,
  inventoryLowHeadline,
  inventoryLowProducts,
  inventoryConsumptionList,
  inventoryAllProducts,
  addFormOpen,
  addFormToggleLabel,
  addFormName,
  addFormQty,
  addFormValue,
  toggleAddForm,
  onAddFormNameChange,
  onAddFormQtyChange,
  onAddFormValueChange,
  onAddFormSubmit,
}: InventoryProps) {
  const inv = t.inventory;
  const inputStyle = sx(
    "height:44px; border-radius:10px; border:1px solid #EBE2CF; padding:0 14px; font-size:14px; font-family:'Manrope',sans-serif; box-sizing:border-box;",
  );
  return (
    <Section label={t.sectionLabels.inventory} heading={inv.heading}>
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx('padding:70px 24px 14px; box-sizing:border-box;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{inv.title}</div>
            </div>

            <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:14px;')}>
              <div style={sx('background:#201C17; border-radius:20px; padding:20px; color:#F4E9D2;')}>
                <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#C9A24B; font-weight:700;')}>{inv.totalInvestedLabel}</div>
                <div style={sx("font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:600; margin-top:8px;")}>{inventoryTotalInvested}</div>
                <div style={sx('font-size:12px; color:#B7AE9C; margin-top:6px;')}>{inventoryProductCountLabel}</div>
              </div>

              <div style={sx('background:#F6EFE1; border-radius:20px; padding:18px;')}>
                <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A6A2E; margin-bottom:12px;')}>{inv.aiAlertsLabel}</div>
                {inventoryAlertsWithAction.map((a, i) => (
                  <div key={i} style={sx('padding:10px 0; border-top:1px solid #EAD9B0;')}>
                    <div style={sx('font-size:13px; color:#6B5A34; line-height:1.5;')}>{a.text}</div>
                    <div
                      style={sx(
                        'cursor:pointer; margin-top:8px; display:inline-flex; padding:7px 14px; border-radius:999px; background:#201C17; color:#F4E9D2; font-size:11px; font-weight:700;',
                      )}
                    >
                      {a.actionLabel}
                    </div>
                  </div>
                ))}
              </div>

              {inventoryHasLow && (
                <div style={sx('background:#201C17; border-radius:20px; padding:20px; color:#F4E9D2;')}>
                  <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#C9A24B; font-weight:700; margin-bottom:12px;')}>
                    {inventoryLowHeadline}
                  </div>
                  {inventoryLowProducts.map((p) => (
                    <div
                      key={p.name}
                      style={sx('display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0; border-top:1px solid rgba(244,233,210,0.14);')}
                    >
                      <div>
                        <div style={sx('font-size:14px; font-weight:700;')}>{p.name}</div>
                        <div style={sx('font-size:12px; color:#B7AE9C; margin-top:2px;')}>
                          {p.qty} {p.unit} {inv.remainingLabel}
                        </div>
                      </div>
                      <div
                        style={sx(
                          'cursor:pointer; flex-shrink:0; padding:9px 16px; border-radius:999px; background:#F4E9D2; color:#201C17; font-size:12px; font-weight:700;',
                        )}
                      >
                        {inv.restockCta}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:18px;')}>
                <div style={sx(LABEL_KICKER)}>{inv.movementsLabel}</div>
                {inv.movements.map((m) => (
                  <div key={m} style={sx('font-size:13px; padding:7px 0; border-top:1px solid #F2ECDF; color:#3A342C;')}>
                    {m}
                  </div>
                ))}
              </div>

              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:18px;')}>
                <div style={sx(LABEL_KICKER)}>{inv.consumptionLabel}</div>
                {inventoryConsumptionList.map((cs) => (
                  <div key={cs.service} style={sx('border-top:1px solid #F2ECDF;')}>
                    <div onClick={cs.onToggle} style={sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between; padding:10px 0;')}>
                      <div style={sx('font-size:14px; font-weight:700;')}>{cs.service}</div>
                      <div style={sx('font-size:12px; color:#B98D3E; font-weight:700;')}>{cs.toggleLabel}</div>
                    </div>
                    {cs.expanded && (
                      <div style={sx('padding-bottom:10px;')}>
                        {cs.items.map((ci) => (
                          <div key={ci} style={sx('font-size:13px; color:#8A8074; padding:3px 0;')}>
                            — {ci}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div style={sx(LABEL_KICKER)}>{inv.allProductsLabel}</div>
                <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
                  {inventoryAllProducts.map((p) => (
                    <div
                      key={p.name}
                      style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:14px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between;')}
                    >
                      <div>
                        <div style={sx('font-size:14px; font-weight:700;')}>{p.name}</div>
                        <div style={sx('font-size:12px; color:#8A8074; margin-top:2px;')}>
                          {p.qty} {p.unit} {inv.inStockLabel}
                        </div>
                      </div>
                      <div
                        style={{
                          ...sx('flex-shrink:0; padding:5px 12px; border-radius:999px; font-size:11px; font-weight:700;'),
                          background: p.statusBg,
                          color: p.statusColor,
                        }}
                      >
                        {p.statusLabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:18px;')}>
                <div onClick={toggleAddForm} style={sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between;')}>
                  <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074;')}>{inv.registerProductLabel}</div>
                  <div style={sx('font-size:12px; color:#B98D3E; font-weight:700;')}>{addFormToggleLabel}</div>
                </div>
                {addFormOpen && (
                  <div style={sx('display:flex; flex-direction:column; gap:10px; margin-top:14px;')}>
                    <input type="text" placeholder={inv.formNamePlaceholder} value={addFormName} onChange={onAddFormNameChange} style={inputStyle} />
                    <div style={sx('display:flex; gap:10px;')}>
                      <input
                        type="number"
                        placeholder={inv.formQtyPlaceholder}
                        value={addFormQty}
                        onChange={onAddFormQtyChange}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <input
                        type="number"
                        placeholder={inv.formValuePlaceholder}
                        value={addFormValue}
                        onChange={onAddFormValueChange}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                    </div>
                    <div style={sx('font-size:11px; color:#B0A78F;')}>{inv.formValueHint}</div>
                    <div
                      onClick={onAddFormSubmit}
                      style={sx(
                        'cursor:pointer; height:46px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700;',
                      )}
                    >
                      {inv.formSubmitCta}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={sx('padding:14px 24px; box-sizing:border-box; flex-shrink:0; border-top:1px solid #EBE2CF; background:#FBF8F2;')}>
              <div
                onClick={toggleAddForm}
                style={sx('height:50px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; cursor:pointer;')}
              >
                {inv.addProductCta}
              </div>
            </div>

            <TabBar active="mais" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>
    </Section>
  );
}
