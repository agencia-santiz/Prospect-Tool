import assert from 'node:assert/strict';
import { filterLeadsBySegment, isLeadRelevantToSegment } from '../src/utils/segmentLeadMatcher.js';

const pizzaLead = {
  nome_fantasia: 'Rock Way Pizza Bar',
  cidade: 'Marília',
  provenance: {
    primaryType: 'pizza_restaurant',
    types: ['restaurant', 'pizza_restaurant'],
  },
};

const unrelatedRestaurant = {
  nome_fantasia: 'Sugoi Kansha Japanese Restaurant',
  cidade: 'Marília',
  provenance: {
    primaryType: 'restaurant',
    types: ['restaurant'],
  },
};

const pizzaDecision = isLeadRelevantToSegment(pizzaLead, 'Pizzaria');
assert.equal(pizzaDecision.accepted, true);
assert.equal(pizzaDecision.reason, 'text_match');

const unrelatedDecision = isLeadRelevantToSegment(unrelatedRestaurant, 'Pizzaria');
assert.equal(unrelatedDecision.accepted, false);
assert.equal(unrelatedDecision.reason, 'insufficient_segment_evidence');

const misleadingGoogleLead = {
  nome_fantasia: 'Gabriel Lanches',
  atividade_principal: 'Pizzaria',
  cidade: 'Marília',
  provenance: {
    source: 'GOOGLE_MAPS',
    primaryType: 'hamburger_restaurant',
    types: ['hamburger_restaurant', 'restaurant'],
  },
};

const misleadingDecision = isLeadRelevantToSegment(misleadingGoogleLead, 'Pizzaria');
assert.equal(misleadingDecision.accepted, false);
assert.equal(misleadingDecision.reason, 'insufficient_segment_evidence');

const filteredPizzaLeads = filterLeadsBySegment([pizzaLead, unrelatedRestaurant], 'Pizzaria');
assert.equal(filteredPizzaLeads.length, 1);
assert.equal(filteredPizzaLeads[0].nome_fantasia, 'Rock Way Pizza Bar');

const restaurantSegmentLead = {
  nome_fantasia: 'Sabor & Cia',
  cidade: 'Marília',
  provenance: {
    primaryType: 'restaurant',
    types: ['restaurant'],
  },
};

const restaurantDecision = isLeadRelevantToSegment(restaurantSegmentLead, 'Restaurante / Gastronomia');
assert.equal(restaurantDecision.accepted, true);
assert.equal(restaurantDecision.reason, 'generic_type_match');

const pharmacyLead = {
  nome_fantasia: 'Rede SP',
  cidade: 'São Paulo',
  provenance: {
    osmTags: {
      shop: 'chemist',
    },
  },
};

const pharmacyDecision = isLeadRelevantToSegment(pharmacyLead, 'Farmácia');
assert.equal(pharmacyDecision.accepted, true);
assert.equal(pharmacyDecision.reason, 'osm_signal');
