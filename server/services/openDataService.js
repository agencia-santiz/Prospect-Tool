import {
  fetchOpenDataLeads,
} from '../../src/services/openDataService.js';

const normalizeFetchArgs = (locationOrArgs, segment, excludeNames = [], quantity = 9) => {
  if (locationOrArgs && typeof locationOrArgs === 'object' && !Array.isArray(locationOrArgs)) {
    return {
      location: String(locationOrArgs.location || '').trim(),
      segment: String(locationOrArgs.segment || '').trim(),
      excludeNames: Array.isArray(locationOrArgs.excludeNames) ? locationOrArgs.excludeNames : [],
      quantity: Number.isFinite(Number(locationOrArgs.quantity)) ? Number(locationOrArgs.quantity) : 9,
    };
  }

  return {
    location: String(locationOrArgs || '').trim(),
    segment: String(segment || '').trim(),
    excludeNames: Array.isArray(excludeNames) ? excludeNames : [],
    quantity: Number.isFinite(Number(quantity)) ? Number(quantity) : 9,
  };
};

export const createOpenDataService = ({ fetchImpl = fetch } = {}) => {
  const fetchEnrichedLeads = async (locationOrArgs, segment, excludeNames = [], quantity = 9) => {
    const args = normalizeFetchArgs(locationOrArgs, segment, excludeNames, quantity);
    return fetchOpenDataLeads(
      args.location,
      args.segment,
      args.excludeNames,
      args.quantity,
      fetchImpl,
    );
  };

  return {
    fetchEnrichedLeads,
  };
};
