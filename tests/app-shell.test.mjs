import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const readSource = async (relativePath) => {
  return readFile(join(repoRoot, relativePath), 'utf8');
};

const appSource = await readSource('src/App.tsx');
assert.ok(appSource.includes('PricingModal'));
assert.ok(appSource.includes('SettingsModal'));
assert.ok(appSource.includes('isPricingModalOpen'));
assert.ok(appSource.includes('isSettingsModalOpen'));
assert.ok(appSource.includes('setIsPricingModalOpen(true)'));
assert.ok(appSource.includes('setIsSettingsModalOpen(true)'));
assert.ok(appSource.includes('getSegmentSuggestions'));
assert.ok(appSource.includes('resolveSegmentQuery'));
assert.ok(appSource.includes('fetchOpenDataLeads'));
assert.ok(appSource.includes('showSegmentSuggestions'));
assert.ok(appSource.includes('segmentInputRef'));
assert.ok(appSource.includes('setFilteredSegments(getSegmentSuggestions(value, 8))'));
assert.ok(appSource.includes('setSearchParams(prev => ({ ...prev, segment: resolvedSegment }))'));
assert.ok(appSource.includes('captureProspectingSnapshot'));
assert.ok(appSource.includes('restoreProspectingSnapshot'));
assert.ok(appSource.includes('handleGoToExplore'));
assert.ok(appSource.includes('exploreHeaderTitle'));
assert.ok(appSource.includes('Iniciando busca na fonte ativa'));
assert.ok(appSource.includes('Dados Abertos'));
assert.ok(appSource.includes('cardConfig={cardConfig}'));
assert.ok(appSource.includes('onUpdateCardConfig={handleUpdateCardConfig}'));
assert.ok(appSource.includes('parseCardConfig(savedCardConfig)'));
assert.ok(appSource.includes('serializeCardConfig(cardConfig)'));

const leadCardSource = await readSource('src/components/LeadCard.tsx');
assert.ok(leadCardSource.includes('source_open_data'));
assert.ok(leadCardSource.includes('buildWhatsAppChatUrl'));
assert.ok(leadCardSource.includes('getWhatsAppStatus'));

const leadListSource = await readSource('src/components/LeadListView.tsx');
assert.ok(leadListSource.includes('buildWhatsAppChatUrl'));
assert.ok(leadListSource.includes('getWhatsAppStatus'));

const dealModalSource = await readSource('src/components/DealDetailsModal.tsx');
assert.ok(dealModalSource.includes('buildWhatsAppChatUrl'));
assert.ok(dealModalSource.includes('getWhatsAppStatus'));

const boardSource = await readSource('src/components/PipelineBoard.tsx');
assert.ok(boardSource.includes('CardVisibilityConfig'));
assert.ok(boardSource.includes('cardConfig.showId'));
assert.ok(boardSource.includes('cardConfig.showContactInfo'));
assert.ok(boardSource.includes('cardConfig.showLocation'));
assert.ok(boardSource.includes('cardConfig.showTags'));
assert.ok(boardSource.includes('cardConfig.showValue'));
assert.ok(boardSource.includes('cardConfig.showDate'));
