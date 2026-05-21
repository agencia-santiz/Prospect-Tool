import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const readSource = async (relativePath) => readFile(join(repoRoot, relativePath), 'utf8');

const appSource = await readSource('src/App.tsx');
assert.ok(appSource.includes('PricingModal'));
assert.ok(appSource.includes('SettingsModal'));
assert.ok(appSource.includes('AddToPipelineModal'));
assert.ok(appSource.includes('DealDetailsModal'));
assert.ok(appSource.includes('cardConfig={cardConfig}'));
assert.ok(appSource.includes('onUpdateCardConfig={handleUpdateCardConfig}'));
assert.ok(appSource.includes('workspaceMembers'));
assert.ok(appSource.includes('ownerUserId'));
assert.ok(appSource.includes('summary: \'\''));
assert.ok(appSource.includes('readStoredWhatsAppStatusOverrides'));
assert.ok(appSource.includes('writeStoredWhatsAppStatusOverrides'));
assert.ok(appSource.includes('getResolvedWhatsAppStatus'));
assert.ok(!appSource.includes('leadCardConfig='));
assert.ok(!appSource.includes('LeadQuickViewModal'));
assert.ok(!appSource.includes('LeadCardVisibilityConfig'));
assert.ok(!appSource.includes('onUpdateLeadCardConfig'));

const leadCardSource = await readSource('src/components/LeadCard.tsx');
assert.ok(leadCardSource.includes('buildWhatsAppChatUrl'));
assert.ok(leadCardSource.includes('getWhatsAppStatus'));
assert.ok(leadCardSource.includes('sendLeadFeedback'));
assert.ok(leadCardSource.includes('Bom Lead'));
assert.ok(leadCardSource.includes('Criar Negócio no Pipeline'));
assert.ok(!leadCardSource.includes('LeadCardVisibilityConfig'));
assert.ok(!leadCardSource.includes('cardConfig.showSource'));

const leadListSource = await readSource('src/components/LeadListView.tsx');
assert.ok(leadListSource.includes('buildWhatsAppChatUrl'));
assert.ok(leadListSource.includes('getWhatsAppStatus'));
assert.ok(!leadListSource.includes('LeadCardVisibilityConfig'));
assert.ok(!leadListSource.includes('WhatsAppStatusDropdown'));

const dealModalSource = await readSource('src/components/DealDetailsModal.tsx');
assert.ok(dealModalSource.includes('buildWhatsAppChatUrl'));
assert.ok(dealModalSource.includes('getWhatsAppStatus'));
assert.ok(dealModalSource.includes('Situação atual'));
assert.ok(dealModalSource.includes('Próxima ação'));

const boardSource = await readSource('src/components/PipelineBoard.tsx');
assert.ok(boardSource.includes('CardVisibilityConfig'));
assert.ok(boardSource.includes('workspaceMembers'));
assert.ok(boardSource.includes('cardConfig.showContactInfo'));
assert.ok(boardSource.includes('cardConfig.showLocation'));
assert.ok(boardSource.includes('cardConfig.showTags'));
assert.ok(boardSource.includes('cardConfig.showValue'));
assert.ok(boardSource.includes('cardConfig.showDate'));
assert.ok(boardSource.includes('variant="dark"'));
assert.ok(boardSource.includes('getOwnerLabel'));
assert.ok(boardSource.includes('getCustomFieldValue'));
assert.ok(boardSource.includes('visibleCustomFields'));
assert.ok(boardSource.includes("'Source'"));
assert.ok(boardSource.includes("'Industry'"));
assert.ok(boardSource.includes('cardConfig.showPriority'));
assert.ok(boardSource.includes('StatusBadge'));
assert.ok(boardSource.includes('priorityInfo.tone'));

console.log('App shell checks passed.');
